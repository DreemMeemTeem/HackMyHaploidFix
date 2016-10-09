var directions = new DirectionsDisplayer({
  element: $('#directions')
});

var indicator = new ProteinIndicator({
  element: $('#proteinindicator'),
  imageSrc: './img/p53.png'
});

var editor = new AminoEdit({
  element: $('#aminoedit'),
  basePairs: 'agcgcctacgctccccctacc',
  mutableNucleotideIndicies: [18, 19],
  events: {
    onRNAUpdate: function(sequence) {
      var mutableCodon = sequence.slice(sequence.length - 3).join('');
      indicator.updateDisplay(mutableCodon);
    },
    onAminoUpdate: function(sequence) {
      if (directions.isStage('intro')) {
        var DNAcodon = editor.currentDNASequence.slice(editor.currentDNASequence.length - 3).join('');
        var RNAcodon = editor.currentRNASequence.slice(editor.currentRNASequence.length - 3).join('');
        directions.startStage('aminodone', {
          DNA: editor.currentDNASequence,
          DNAcodon: DNAcodon,
          RNA: editor.currentRNASequence,
          RNAcodon: RNAcodon,
          amino: editor.currentAminoSequence,
          aminoDesc: indicator.aminoHighlightMap[RNAcodon].description
        });
      }
    }
  },
  directions: directions
});

var cell = new CellAnimation({
  element: $('#cellanimation'),
  sprites: {
    healthy: './img/cell-healthy.png',
    cancerous: './img/cell-cancerous.png',
    virus: './img/virus.png'
  }
});

$('#proteininject').click(function() {
  var sequence = editor.currentRNASequence;
  var codon = editor.currentRNASequence.slice(editor.currentRNASequence.length - 3).join('');
  
  var callback = function() {
    if (directions.isStage('sendoncovirus')) {
      directions.startStage('oncovirusoverview');
    }
  }
  
  if (codon === 'UGG' && false) {   // we're no longer using this, as "send oncovirus" is conceptually separate from the DNA/RNA/amino acid assembly
    cell.changeState('healthy', callback);
  } else {
    cell.changeState('cancerous', callback);
  }
})