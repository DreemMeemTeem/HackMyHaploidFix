DirectionsDisplayer = (function() {
  var DirectionsDisplayer = function(opts) {
    var self = this;

    self.elem = opts.element;
    
    self.prompts = {
      welcome: {
        text: 'Hello, and welcome to HackMyHaploid! You have the amazing chance to try a simulation where you can change specific base pairs to create a mutated gene that malfunctions enough for it to become a malignant cancer cell. You will learn a lot through this simulation, so be prepared to tinker within our software.',
        next: 'intro'
      },
      intro: {
        text: 'Here is the original untouched segment of the p53 gene, the tumor suppressant gene. Right now, it is currently functioning properly and the green generic normal cell is chilling in its environment. Change a couple of base pairs using the little arrows in the bar at the bottom to see what happens.',
        previous: 'welcome'
      },
      aminodone: {
        text: function(opts) {
          console.log(opts)
          return 'Wow! You created the DNA base pair sequence ' + opts.DNAcodon + ', which translates to the RNA sequence ' + opts.RNAcodon + ' and produces the Amino acid structure ' + opts.aminoDesc + '.'
        },
        next: 'aboutamino'
      },
      aboutamino: {
        text: 'Amino acids play a crucial role in the formation of proteins that assist in carrying out metabolic functions of cells. After they are translated from DNA to RNA, the RNA is pushed through a ribosome which prints out the amino acid chain the DNA originally coded for, and the little amino acid strands all link up together to form tertiary and quarternary structures of proteins. Any little mistake, even single base pairs being replaced, can cause serious problems for any cell.\n\nTry messing with the DNA some more, and see what you get.',
        next: 'donemessing'
      },
      donemessing: {
        text: 'All right, you were able to learn about some amino acids that can result from single base pair mutations! Great job! Hopefully, you inferred that since DNA encodes data for proteins which conversely express the genes they were encoded from, mutations in the DNA causes the genes to be expressed incorrectly or not at all.',
        next: 'aboutp53'
      },
      aboutp53: {
        text: 'When genes are expressed incorrectly, they have the potential to turn regular cells into cancer cells. The gene we selected for this demo is especially prone to single base pair mutations. Discovered only a decade ago, recent studies, experiments and clinical trials note that the p53 gene seems to play a large role in the devolpment of many common cancers.',
        next: 'sendoncovirus'
      },
      sendoncovirus: {
        text: 'However, mutations aren\'t the only way for a cell to become cancerous. Oncoviruses are another common offender, injecting malignant RNA directly into the cell. Try pressing the "Inject Oncovirus" button.'
      },
      oncovirusoverview: {
        text: 'In a normal cell, oncoviruses would quickly turn its cellular machinery into a large scale factory, pumping out more and more viruses that would infect nearby cells. And so, more cells would become cancer cells.',
        next: 'recap1'
      },
      recap1: {
        text: 'Just to recap, you\'ve learned a lot about how cancer can be created. You learned how singular base pair changes can truly affect gene expression. You also learned about a bunch of essential and non-essential amino acids, 16 of the 20 to be exact. Different combinations of amino acid groups can create thousands upon thousands upon thousands of different, specialized proteins.',
        next: 'recap2'
      },
      recap2: {
        text: 'You also learned about the p53 gene, the tumor suppressor gene, and how any malfunction in terms of expressing the gene incorrectly or not at all can ultimately lead to a cancerous cell. Lastly, you learned about oncoviruses, and how they can infect many cells and turn them into cancer cells. Wow, you really learned a lot!',
        next: 'relate'
      },
      relate: {
        text: 'But how does this all relate?',
        next: 'awareness1'
      },
      awareness1: {
        text: 'Awareness and understanding is imperative in order to begin to solve the problems we currently face in medicine. Cancer has been around longer than recorded human history. Many people are genetically predisposed to certain diseases, and it is imperative that they obtain the proper screenings necessary to potentially catch cancer at an early stage. Single base pair mutations happen all the time, but our DNA polymerases and helicases (molecular tools that replicate and spellcheck DNA) tend to take care of this issue, as well as B and T-cells (specialized white blood cells), which actively comb through our bodies to catch cancerous cells that are ready to rebel.',
        next: 'awareness2'
      },
      awareness2: {
        html: 'However, this is not enough in some cases. Cancer can go undetected in your immune system and mobilize, metastasizing throughout your body until it is too powerful to fight. Yet, we are on the verge of using gene editing tools to fully eradicate powerful diseases such as cancer. Today, you used a simplified, digital version of a gene editing tool in order to prompt a normal cell to become malignant, much like what scientists have recently been doing in laboratories across the world. Congratulations on completing the demo! For a few minutes of your time, you were able to learn so much about what gene editing tools can do, and how cancer relates to this field of the biological sciences.\n\n<i>To learn more about cancer screenings and how you can decrease your susceptibility to the disease, please visit the American Cancer Society at <a href="http://www.cancer.org/">www.cancer.org</a>.</i>'
      }
    }

    self.elem.append($('<p>').prop('id', 'directions-text'));
    self.elem.append($('<span>').prop('id', 'directions-next').addClass('directions-next').text('Next \u279E').hide());
    self.elem.append($('<span>').prop('id', 'directions-close').addClass('directions-close').text('x'));

    self.textelem = $('#directions-text');
    $('#directions-close').click(function() {
      self.closeDirections();
    });

    var cookies = document.cookie;
    if (cookies.indexOf('HaploidIntro=complete') === -1) {
      self.startStage('welcome');
    }
  }

  DirectionsDisplayer.prototype.startStage = function(stage, opts) {
    var self = this;
    
    var prompt = self.prompts[stage];
    if (prompt && prompt.previous ? self.elem.data('prompt') === prompt.previous : true) {
      self.displayNotice(prompt, stage, opts);
    }
  }

  DirectionsDisplayer.prototype.starter = function(stage, opts) {
    var self = this;

    return function() {
      self.startStage(stage, opts);
    }
  }

  DirectionsDisplayer.prototype.displayNotice = function(notice, stageName, opts) {
    var self = this;
    
    if (notice.html) {
      self.textelem.html(notice.html);
    } else if (typeof notice.text === 'function') {
      self.textelem.text(notice.text(opts));
    } else {
      self.textelem.text(notice.text);
    }
    
    self.elem.data('prompt', stageName);

    if (notice.next) {
      $('#directions-next').click(function() {
        self.startStage(notice.next)
      }).show();
    } else {
      $('#directions-next').off().hide();
    }

    if (!self.elem.is(":visible")) {
      self.elem.slideDown();
    }
  }

  DirectionsDisplayer.prototype.hideNotice = function() {
    var self = this;

    self.elem.slideUp();
  }

  DirectionsDisplayer.prototype.closeDirections = function() {
    var self = this;

    self.elem.slideUp();
  }
  
  DirectionsDisplayer.prototype.isStage = function(stage) {
    var self = this;
    
    return self.elem.data('prompt') === stage
  }

  return DirectionsDisplayer
})()
