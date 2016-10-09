AminoEdit = (function() {

  var AminoEdit = function(opts) {
    var self = this;

    self.elem = opts.element
    if (typeof opts.basePairs === 'string') {
      self.basePairs = opts.basePairs.toUpperCase().split('')
    } else {
      self.basePairs = opts.basePairs;
    }
    self.mutableNucleotideIndicies = opts.mutableNucleotideIndicies;
    self.events = opts.events || {};
    self.directions = opts.directions;

    self.currentDNASequence = self.basePairs;
    self.currentRNASequence = [];
    self.currentAminoSequence = [];

    self.elem.append(
      $('<div>')
      .addClass('editor-dnaContainer')
      .prop('id', 'DNAContainer')
    );
    self.dnaContainer = $('#DNAContainer');

    self.elem.append(
      $('<div>')
      .addClass('editor-rnaContainer')
      .prop('id', 'RNAContainer')
    );
    self.rnaContainer = $('#RNAContainer');

    self.basePairs.map(function(nucleotide, index) {
      self.dnaContainer.append(
        $('<div>')
        .addClass('editor-dnaNucleotide')
        .prop('id', 'editor-dnaNucleotide' + index)
        .append($('<span>').prop('id', 'editor-dnaNucleotideLabel' + index).text(nucleotide))
      )
    });

    self.mutableNucleotideIndicies.map(function(index) {
      var nucseq = ['A', 'C', 'G', 'T'];
      $('#editor-dnaNucleotide' + index)
        .addClass('mutable')
        .append(
          $('<div>')
          .addClass('nucleotideCycle up')
          .data('nucleotideIndex', index)
          .click(function() {
            var label = $('#editor-dnaNucleotideLabel' + $(this).data('nucleotideIndex'))
            var nucIndex = nucseq.indexOf(label.text());
            if (nucIndex === 0) {
              label.text('T');
            } else {
              label.text(nucseq[nucIndex - 1]);
            }
            self.currentDNASequence[index] = label.text();
            self.onDNAUpdate(self.currentDNASequence);
          })
        )
        .append(
          $('<div>')
          .addClass('nucleotideCycle down')
          .data('nucleotideIndex', index)
          .click(function() {
            var label = $('#editor-dnaNucleotideLabel' + $(this).data('nucleotideIndex'));
            var nucIndex = nucseq.indexOf(label.text());
            if (nucIndex === 3) {
              label.text('A');
            } else {
              label.text(nucseq[nucIndex + 1]);
            }
            self.currentDNASequence[index] = label.text();
            self.onDNAUpdate(self.currentDNASequence);
          })
        );
    });

    self.onDNAUpdate(self.currentDNASequence);
  }

  AminoEdit.prototype.drawRNA = function(sequence) {
    var self = this;

    var aminoMap = {
      'UUU': 'Phe',
      'UUC': 'Phe',
      'UUA': 'Leu',
      'UUG': 'Leu',
      'CUU': 'Leu',
      'CUC': 'Leu',
      'CUA': 'Leu',
      'CUG': 'Leu',
      'AUU': 'Ile',
      'AUC': 'Ile',
      'AUA': 'Ile',
      'AUG': 'Met',
      'GUU': 'Val',
      'GUC': 'Val',
      'GUA': 'Val',
      'GUG': 'Val',
      'UCU': 'Ser',
      'UCC': 'Ser',
      'UCA': 'Ser',
      'UCG': 'Ser',
      'CCU': 'Pro',
      'CCC': 'Pro',
      'CCA': 'Pro',
      'CCG': 'Pro',
      'ACU': 'Thr',
      'ACC': 'Thr',
      'ACA': 'Thr',
      'ACG': 'Thr',
      'GCU': 'Ala',
      'GCC': 'Ala',
      'GCA': 'Ala',
      'GCG': 'Ala',
      'UAU': 'Tyr',
      'UAC': 'Tyr',
      'UAA': 'Stp',
      'UAG': 'Stp',
      'CAU': 'His',
      'CAC': 'His',
      'CAA': 'Gln',
      'CAG': 'Gln',
      'AAU': 'Asn',
      'AAC': 'Asn',
      'AAA': 'Lys',
      'AAG': 'Lys',
      'GAU': 'Asp',
      'GAC': 'Asp',
      'GAA': 'Glu',
      'GAG': 'Glu',
      'UGU': 'Cys',
      'UGC': 'Cys',
      'UGA': 'Stp',
      'UGG': 'Trp',
      'CGU': 'Arg',
      'CGC': 'Arg',
      'CGA': 'Arg',
      'CGG': 'Arg',
      'AGU': 'Ser',
      'AGC': 'Ser',
      'AGA': 'Arg',
      'AGG': 'Arg',
      'GGU': 'Gly',
      'GGC': 'Gly',
      'GGA': 'Gly',
      'GGG': 'Gly'
    }

    self.rnaContainer.empty();
    self.currentRNASequence = sequence.map(function(nucleotide) {
      var rnaReplacements = {
        'A': 'U',
        'C': 'G',
        'G': 'C',
        'T': 'A'
      }
      return rnaReplacements[nucleotide]
    });

    self.onRNAUpdate(self.currentRNASequence);

    self.currentAminoSequence = [];

    for (var i = 0; i < self.currentRNASequence.length; i += 3) {
      //currentRNASequence[i]
      var aminoCodon = self.currentRNASequence.slice(i, i + 3);
      var aminoAbbr = aminoMap[aminoCodon.join('')];

      var nucleotideBoxes = aminoCodon.map(function(nucleotide) {
        return $('<span>')
          .addClass('editor-rnaNucleotide')
          .text(nucleotide)
          .appendTo(self.rnaContainer)
      });

      self.rnaContainer.append(
        $('<div>')
        .addClass('editor-rnaAminoLabel')
        .text(aminoAbbr.toUpperCase())
        .css('left', nucleotideBoxes[0].position().left + nucleotideBoxes[0].outerWidth(true) - 3)
      )
      self.rnaContainer.append(
        $('<div>')
        .addClass('editor-rnaAminoBars')
        .css('left', nucleotideBoxes[0].position().left + nucleotideBoxes[0].outerWidth(true))
      )

      self.currentAminoSequence.push(aminoAbbr.toUpperCase());
    };

    self.onAminoUpdate(self.currentAminoSequence);
  }

  AminoEdit.prototype.onDNAUpdate = function(sequence) {
    var self = this;

    self.drawRNA(sequence);

    if (self.events.onDNAUpdate) {
      self.events.onDNAUpdate(sequence)
    }
  }

  AminoEdit.prototype.onRNAUpdate = function(sequence) {
    var self = this;

    if (self.events.onRNAUpdate) {
      self.events.onRNAUpdate(sequence)
    }
  }

  AminoEdit.prototype.onAminoUpdate = function(sequence) {
    var self = this;

    if (self.events.onAminoUpdate) {
      self.events.onAminoUpdate(sequence)
    }
  }

  return AminoEdit
})()
