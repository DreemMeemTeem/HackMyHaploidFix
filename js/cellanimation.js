CellAnimation = (function() {
  var CellAnimation = function(opts) {
    var self = this;

    self.elem = opts.element;
    self.sprites = opts.sprites || {};

    self.elem.append(
      $('<canvas>')
      .prop('id', 'cellanimation-canvas')
      .prop('width', self.elem.parent().width())
      .prop('height', self.elem.parent().height())
    );

    var canvas = $('#cellanimation-canvas').get(0);
    self.canvasContext = canvas.getContext('2d');

    self.stage = new createjs.Stage(canvas);

    self.spriteSheet = new createjs.SpriteSheet({
      framerate: 5,
      images: [self.sprites.healthy, self.sprites.cancerous, self.sprites.virus],
      frames: [
        [0, 0, 594, 608, 0],
        [595, 0, 602, 608, 0],
        [1231, 0, 594, 608, 0],
        [0, 0, 594, 608, 1],
        [595, 0, 602, 608, 1],
        [1231, 0, 594, 608, 1],
        [0, 0, 598, 608, 2, 299, 304]
      ],
      animations: {
        healthy: [0, 2],
        cancerous: [3, 5],
        virus: 6
      }
    });

    self.cell = new createjs.Sprite(self.spriteSheet, 'healthy');
    self.cell.x = 450;
    self.cell.y = 22;

    self.virus = new createjs.Sprite(self.spriteSheet, 'virus');
    self.virus.x = -100;
    self.virus.y = 300;
    self.virus.rotation = -90
    self.virus.scaleX = .25;
    self.virus.scaleY = .25;

    self.stage.addChild(self.virus);
    self.stage.addChild(self.cell);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener('tick', self.stage);
  }

  CellAnimation.prototype.changeState = function(state, cb) {
    var self = this;
    
    self.launchVirus(function() {
      self.cell.gotoAndPlay(state);
      if (cb) {
        cb();
      }
    });
  }

  CellAnimation.prototype.launchVirus = function(cb) {
    var self = this;

    self.virus.x = 0;

    createjs.Tween.get(self.virus)
      .to({
        x: 700
      }, 1000)
      .call(cb || new Function());
  }

  return CellAnimation
})()
