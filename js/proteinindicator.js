ProteinIndicator = (function() {
  var ProteinIndicator = function(opts) {
    var self = this;

    self.elem = opts.element;
    self.imageSrc = opts.imageSrc;

    self.elem.append(
      $('<img>')
      .addClass('proteinindicator-overlay')
      .prop('id', 'proteinindicator-background')
      .prop('src', self.imageSrc)
    );
    self.elem.append(
      $('<canvas>')
      .addClass('proteinindicator-overlay')
      .prop('id', 'proteinindicator-canvas')
      .prop('width', $('#proteinindicator-background').width())
      .prop('height', $('#proteinindicator-background').height())
    );
    self.elem.append(
      $('<span>')
      .prop('id', 'proteinindicator-description')
      .addClass('proteinindicator-description')
      .css('top', $('#proteinindicator-background').height())
      //.css('width', $('#proteinindicator-background').width())
    );

    self.aminoHighlightMap = {
      'UCG': {
        position: [124, 67],
        description: 'Serine: nonessential amino acid, can be synthesized in the body from other metabolites'
      },
      'ACG': {
        position: [170, 105],
        description: 'Threonine: essential amino acid that is synthesized from aspartate in bacteria (e.g. E. coli)'
      },
      'AGG': {
        position: [75, 110],
        description: 'Arginine: semiessential amino acid that must be consumed through diet'
      },
      'AUG': {
        position: [56, 269],
        description: 'Methionine: start codon, dictates start of protein sequence'
      },
      'GCG': {
        position: [91, 331],
        description: 'Alanine: non-essential amino acid that is found in a wide varieties of foods, but is concentrated in meats'
      },
      'GGG': {
        position: [200, 100],
        description: 'Glycine: smallest possible amino acid, colorless, sweet-tasting crystalline solid'
      },
      'UGG': {
        position: [139, 161],
        description: 'Tryptophan: precursor to neurotransmitters serotonin and melatonin'
      },
      'UUG': {
        position: [51, 225],
        description: 'Leucine: must be obtained from diet, major component in "buffer" proteins'
      },
      'CUG': {
        position: [222, 202],
        description: 'Leucine: must be obtained from diet, major component in "buffer" proteins'
      },
      'CGG': {
        position: [184, 247],
        description: 'Arginine: semiessential amino acid that must be consumed through diet'
      },
      'CAG': {
        position: [40, 68],
        description: 'Glutamine: most abundant free amino acid found within human bloodstream'
      },
      'AAG': {
        position: [267, 263],
        description: 'Lysine: essential amino acid that often participates in hydrogen bonding and catalysis'
      },
      'GAG': {
        position: [166, 65],
        description: 'Glutamic acid: non-essential amino acid that is a key compound in cellular metabolism'
      },
      'CCG': {
        position: [41, 69],
        description: 'Proline: non-essential in humans (we can synthesize it from non essential amino acid L-glutamate.) In plants, proline accumulation is part of the process of generating tissue (e.g. pollen)'
      },
      'GUG': {
        position: [244, 276],
        description: 'Valine: essential amino acid; in sickle-cell diseases, valine substitutes for glutamic acid, causing hemoglobin to become prone to abnormal aggregation'
      },
      'UAG': {
        position: [218, 349],
        description: 'Stop codon: section in the DNA that signals the polymerase to stop reading and begin replication of the genetic material'
      }
    }

    var canvas = $('#proteinindicator-canvas').get(0);
    self.canvasContext = canvas.getContext('2d');

    self.stage = new createjs.Stage(canvas);

    canvas.addEventListener('mousedown', function(event) {
      console.log(event)
      console.log([event.layerX, event.layerY])
    });
  }

  ProteinIndicator.prototype.updateDisplay = function(codon) {
    var self = this;

    console.log('update: ' + codon)

    var highlightElement = self.aminoHighlightMap[codon];
    if (highlightElement) {
      var highlightPosition = highlightElement.position;

      var dot = new createjs.Graphics();
      dot.setStrokeStyle(1);
      dot.beginStroke(createjs.Graphics.getRGB(0, 0, 0));
      dot.beginFill('#ffeb3b');
      dot.drawCircle(0, 0, 15);

      var shape = new createjs.Shape(dot);
      shape.x = highlightPosition[0];
      shape.y = highlightPosition[1];

      self.stage.removeAllChildren();
      self.stage.addChild(shape);
      self.stage.update();

      $('#proteinindicator-description')
        .text(highlightElement.description)
        .show();
    }
  }

  return ProteinIndicator
})()
