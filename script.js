// Calling the cloudinary responsive method for image responsiveness
let cl = cloudinary.Cloudinary.new({ cloud_name: 'dp20bvzhn' });
cl.responsive();

/**
 * Ribbons Class File.
 * Creates low-poly ribbons background effect inside a target container.
 */
;(function(name, factory) {
  if (typeof window === 'object') {
    window[name] = factory()
  }
})('Ribbons', function() {
  var _w = window,
    _b = document.body,
    _d = document.documentElement

  // random helper
  var random = function() {
    if (arguments.length === 1) {
      // only 1 argument
      if (Array.isArray(arguments[0])) {
        // extract index from array
        var index = Math.round(random(0, arguments[0].length - 1))
        return arguments[0][index]
      }
      return random(0, arguments[0]) // assume numeric
    } else if (arguments.length === 2) {
      // two arguments range
      return Math.random() * (arguments[1] - arguments[0]) + arguments[0]
    } else if (arguments.length === 4) {
      //

      var array = [arguments[0], arguments[1], arguments[2], arguments[3]]
      return array[Math.floor(Math.random() * array.length)]
      //return console.log(item)
    }
    return 0 // default
  }

  // screen helper
  var screenInfo = function(e) {
    var width = Math.max(
        0,
        _w.innerWidth || _d.clientWidth || _b.clientWidth || 0
      ),
      height = Math.max(
        0,
        _w.innerHeight || _d.clientHeight || _b.clientHeight || 0
      ),
      scrollx =
        Math.max(0, _w.pageXOffset || _d.scrollLeft || _b.scrollLeft || 0) -
        (_d.clientLeft || 0),
      scrolly =
        Math.max(0, _w.pageYOffset || _d.scrollTop || _b.scrollTop || 0) -
        (_d.clientTop || 0)

    return {
      width: width,
      height: height,
      ratio: width / height,
      centerx: width / 2,
      centery: height / 2,
      scrollx: scrollx,
      scrolly: scrolly
    }
  }

  // mouse/input helper
  var mouseInfo = function(e) {
    var screen = screenInfo(e),
      mousex = e ? Math.max(0, e.pageX || e.clientX || 0) : 0,
      mousey = e ? Math.max(0, e.pageY || e.clientY || 0) : 0

    return {
      mousex: mousex,
      mousey: mousey,
      centerx: mousex - screen.width / 2,
      centery: mousey - screen.height / 2
    }
  }

  // point object
  var Point = function(x, y) {
    this.x = 0
    this.y = 0
    this.set(x, y)
  }
  Point.prototype = {
    constructor: Point,

    set: function(x, y) {
      this.x = x || 0
      this.y = y || 0
    },
    copy: function(point) {
      this.x = point.x || 0
      this.y = point.y || 0
      return this
    },
    multiply: function(x, y) {
      this.x *= x || 1
      this.y *= y || 1
      return this
    },
    divide: function(x, y) {
      this.x /= x || 1
      this.y /= y || 1
      return this
    },
    add: function(x, y) {
      this.x += x || 0
      this.y += y || 0
      return this
    },
    subtract: function(x, y) {
      this.x -= x || 0
      this.y -= y || 0
      return this
    },
    clampX: function(min, max) {
      this.x = Math.max(min, Math.min(this.x, max))
      return this
    },
    clampY: function(min, max) {
      this.y = Math.max(min, Math.min(this.y, max))
      return this
    },
    flipX: function() {
      this.x *= -1
      return this
    },
    flipY: function() {
      this.y *= -1
      return this
    }
  }

  // class constructor
  var Factory = function(options) {
    this._canvas = null
    this._context = null
    this._sto = null
    this._width = 0
    this._height = 0
    this._scroll = 0
    this._ribbons = []
    this._options = {
      // ribbon color HSL saturation amount
      colorSaturation: '80%',
      // ribbon color HSL brightness amount
      colorBrightness: '60%',
      // ribbon color opacity amount
      colorAlpha: 0.65,
      // how fast to cycle through colors in the HSL color space
      colorCycleSpeed: 6,
      // where to start from on the Y axis on each side (top|min, middle|center, bottom|max, random)
      verticalPosition: 'center',
      // how fast to get to the other side of the screen
      horizontalSpeed: 150,
      // how many ribbons to keep on screen at any given time
      ribbonCount: 3,
      // add stroke along with ribbon fill colors
      strokeSize: 0,
      // move ribbons vertically by a factor on page scroll
      parallaxAmount: -0.5,
      // add animation effect to each ribbon section over time
      animateSections: true
    }
    this._onDraw = this._onDraw.bind(this)
    this._onResize = this._onResize.bind(this)
    this._onScroll = this._onScroll.bind(this)
    this.setOptions(options)
    this.init()
  }

  // class prototype
  Factory.prototype = {
    constructor: Factory,

    // Set and merge local options
    setOptions: function(options) {
      if (typeof options === 'object') {
        for (var key in options) {
          if (options.hasOwnProperty(key)) {
            this._options[key] = options[key]
          }
        }
      }
    },

    // Initialize the ribbons effect
    init: function() {
      try {
        this._canvas = document.createElement('canvas')
        this._canvas.style['display'] = 'block'
        this._canvas.style['position'] = 'fixed'
        this._canvas.style['margin'] = '0'
        this._canvas.style['padding'] = '0'
        this._canvas.style['border'] = '0'
        this._canvas.style['outline'] = '0'
        this._canvas.style['left'] = '0'
        this._canvas.style['top'] = '0'
        this._canvas.style['width'] = '100%'
        this._canvas.style['height'] = '100%'
        this._canvas.style['z-index'] = '-1'
        this._onResize()

        this._context = this._canvas.getContext('2d')
        this._context.clearRect(0, 0, this._width, this._height)
        this._context.globalAlpha = this._options.colorAlpha

        window.addEventListener('resize', this._onResize)
        window.addEventListener('scroll', this._onScroll)
        document.body.appendChild(this._canvas)
      } catch (e) {
        console.warn('Canvas Context Error: ' + e.toString())
        return
      }
      this._onDraw()
    },

    // Create a new random ribbon and to the list
    addRibbon: function() {
      // movement data
      var dir = Math.round(random(1, 9)) > 5 ? 'right' : 'left',
        stop = 1000,
        hide = 200,
        min = 0 - hide,
        max = this._width + hide,
        movex = 0,
        movey = 0,
        startx = dir === 'right' ? min : max,
        starty = Math.round(random(0, this._height))

      // asjust starty based on options
      if (/^(top|min)$/i.test(this._options.verticalPosition)) {
        starty = 0 + hide
      } else if (/^(middle|center)$/i.test(this._options.verticalPosition)) {
        starty = this._height / 2
      } else if (/^(bottom|max)$/i.test(this._options.verticalPosition)) {
        starty = this._height - hide
      }

      // ribbon sections data
      var ribbon = [],
        point1 = new Point(startx, starty),
        point2 = new Point(startx, starty),
        point3 = null,
        color = Math.round(random(35, 35, 40, 40)),
        delay = 0

      // buils ribbon sections
      while (true) {
        if (stop <= 0) break
        stop--

        movex = Math.round(
          (Math.random() * 1 - 0.2) * this._options.horizontalSpeed
        )
        movey = Math.round((Math.random() * 1 - 0.5) * (this._height * 0.25))

        point3 = new Point()
        point3.copy(point2)

        if (dir === 'right') {
          point3.add(movex, movey)
          if (point2.x >= max) break
        } else if (dir === 'left') {
          point3.subtract(movex, movey)
          if (point2.x <= min) break
        }
        // point3.clampY( 0, this._height );
        //console.log(Math.round(random(1, 5)))
        ribbon.push({
          // single ribbon section
          point1: new Point(point1.x, point1.y),
          point2: new Point(point2.x, point2.y),
          point3: point3,
          color: color,
          delay: delay,
          dir: dir,
          alpha: 0,
          phase: 0
        })

        point1.copy(point2)
        point2.copy(point3)

        delay += 4
        //color += 1
        //console.log('colorCycleSpeed', color)
      }
      this._ribbons.push(ribbon)
    },

    // Draw single section
    _drawRibbonSection: function(section) {
      if (section) {
        if (section.phase >= 1 && section.alpha <= 0) {
          return true // done
        }
        if (section.delay <= 0) {
          section.phase += 0.02
          section.alpha = Math.sin(section.phase) * 1
          section.alpha = section.alpha <= 0 ? 0 : section.alpha
          section.alpha = section.alpha >= 1 ? 1 : section.alpha

          if (this._options.animateSections) {
            var mod = Math.sin(1 + section.phase * Math.PI / 2) * 0.1

            if (section.dir === 'right') {
              section.point1.add(mod, 0)
              section.point2.add(mod, 0)
              section.point3.add(mod, 0)
            } else {
              section.point1.subtract(mod, 0)
              section.point2.subtract(mod, 0)
              section.point3.subtract(mod, 0)
            }
            section.point1.add(0, mod)
            section.point2.add(0, mod)
            section.point3.add(0, mod)
          }
        } else {
          section.delay -= 0.5
        }
        //console.log('section.color', section.color)
        var s = this._options.colorSaturation,
          l = this._options.colorBrightness,
          c =
            'hsla(' +
            section.color +
            ', ' +
            s +
            ', ' +
            l +
            ', ' +
            section.alpha +
            ' )'

        this._context.save()

        if (this._options.parallaxAmount !== 0) {
          this._context.translate(
            0,
            this._scroll * this._options.parallaxAmount
          )
        }
        this._context.beginPath()
        this._context.moveTo(section.point1.x, section.point1.y)
        this._context.lineTo(section.point2.x, section.point2.y)
        this._context.lineTo(section.point3.x, section.point3.y)
        this._context.fillStyle = c
        this._context.fill()

        if (this._options.strokeSize > 0) {
          this._context.lineWidth = this._options.strokeSize
          this._context.strokeStyle = c
          this._context.lineCap = 'round'
          this._context.stroke()
        }
        this._context.restore()
      }
      return false // not done yet
    },

    // Draw ribbons
    _onDraw: function() {
      // cleanup on ribbons list to rtemoved finished ribbons
      for (var i = 0, t = this._ribbons.length; i < t; ++i) {
        if (!this._ribbons[i]) {
          this._ribbons.splice(i, 1)
        }
      }

      // draw new ribbons
      this._context.clearRect(0, 0, this._width, this._height)

      for (
        var a = 0;
        a < this._ribbons.length;
        ++a // single ribbon
      ) {
        var ribbon = this._ribbons[a],
          numSections = ribbon.length,
          numDone = 0

        for (
          var b = 0;
          b < numSections;
          ++b // ribbon section
        ) {
          if (this._drawRibbonSection(ribbon[b])) {
            numDone++ // section done
          }
        }
        if (numDone >= numSections) {
          // ribbon done
          this._ribbons[a] = null
        }
      }
      // maintain optional number of ribbons on canvas
      if (this._ribbons.length < this._options.ribbonCount) {
        this.addRibbon()
      }
      requestAnimationFrame(this._onDraw)
    },

    // Update container size info
    _onResize: function(e) {
      var screen = screenInfo(e)
      this._width = screen.width
      this._height = screen.height

      if (this._canvas) {
        this._canvas.width = this._width
        this._canvas.height = this._height

        if (this._context) {
          this._context.globalAlpha = this._options.colorAlpha
        }
      }
    },

    // Update container size info
    _onScroll: function(e) {
      var screen = screenInfo(e)
      this._scroll = screen.scrolly
    }
  }

  // export
  return Factory
})

new Ribbons({
  colorSaturation: '60%',
  colorBrightness: '50%',
  colorAlpha: 0.5,
  colorCycleSpeed: 5,
  verticalPosition: 'random',
  horizontalSpeed: 200,
  ribbonCount: 3,
  strokeSize: 0,
  parallaxAmount: -0.2,
  animateSections: true
})



// Register scrolltrigger plugin
gsap.registerPlugin(ScrollTrigger, CustomEase);

//Custom eases
CustomEase.create('ease-out-quad', '0.25,0.46,0.45,0.94');
CustomEase.create('ease-out-cubic', '0.215,0.61,0.355,1');
CustomEase.create('ease-out-quart', '0.165,0.84,0.44,1');
CustomEase.create('ease-out-quint', '0.23,1,0.32,1');
CustomEase.create('ease-out-expo', '0.19,1,0.22,1');
CustomEase.create('ease-out-circ', '0.075,0.82,0.165,1');
CustomEase.create('ease-in-out-quad', '0.455,0.03,0.515,0.955');
CustomEase.create('ease-in-out-cubic', '0.645,0.045,0.355,1');
CustomEase.create('ease-in-out-quart', '0.77,0,0.175,1');
CustomEase.create('ease-in-out-quint', '0.86,0,0.07,1');
CustomEase.create('ease-in-out-expo', '1,0,0,1');
CustomEase.create('ease-in-out-circ', '0.785,0.135,0.15,0.86');
CustomEase.create('ease-in-quad', '0.55, 0.085, 0.68, 0.53');
CustomEase.create('ease-in-cubic', '0.55, 0.055, 0.675, 0.19');
CustomEase.create('ease-in-quart', '0.895, 0.03, 0.685, 0.22');
CustomEase.create('ease-in-quint', '0.755, 0.05, 0.855, 0.06');
CustomEase.create('ease-in-expo', '0.95, 0.05, 0.795, 0.035');
CustomEase.create('ease-in-circ', '0.6, 0.04, 0.98, 0.335');
CustomEase.create('custom', 'M0,0 C0.8,0 0.1,1 1,1');

// INITIALISE SPLIDE CAROUSEL
let splide = new Splide('.splide', {
  perMove: 1,
  gap: 0,
  drag: 'free',
  autoWidth: 'true',
  autoHeight: 'true',
  type: 'loop',
  cloneStatus: false,
  arrows: false,
  pagination: false,
  autoScroll: {
    speed: 1.5,
  },
  easing: 'cubic-bezier(0.25,0.46,0.45,0.94)',
}).mount(window.splide.Extensions);

// Destroy splide instance
function destroySplide() {
  if (splide) {
    splide.destroy();
    splide = null;
  }
}

// SKEW EFFECT ON DRAG OF CAROUSEL
const splideCarousel = () => {
  // SKEW ANIMATION ON CAROUSEL SLIDE LEFT OR RIGHT
  // Initialize variables to track the drag start position and drag state
  let isDragging = false;
  let dragStartPositionX = 0;

  // Function to handle drag start
  function handleDragStart(e) {
    // Set the flag to indicate that dragging has started
    isDragging = true;
    // Store the initial X position of the drag
    dragStartPositionX = e.clientX || e.touches[0].clientX;
  }

  // Function to handle drag move
  function handleDragMove(e) {
    // Check if dragging is in progress
    if (isDragging) {
      // Calculate the difference between the current X position and the start position
      const clientX = e.clientX || e.touches[0].clientX;
      const dragDistanceX = clientX - dragStartPositionX;

      // Determine the skew angle based on the drag direction
      let skewAngle = 0;

      if (dragDistanceX > 0) {
        // Dragged to the right
        skewAngle = -5; // Positive skew
      } else if (dragDistanceX < 0) {
        // Dragged to the left
        skewAngle = 5; // Negative skew
      }

      // Apply the skew angle to the .image__container using gsap
      gsap.to('.image__container', { skewX: `${skewAngle}deg` });
      gsap.to('.splide', { cursor: 'grabbing' });
    }
  }

  // Function to handle drag end
  function handleDragEnd() {
    // Reset the drag state and start position
    isDragging = false;
    dragStartPositionX = 0;
  }

  const splideSlider = document.querySelector('.splide');

  // Listen to mouse events on the document
  splideSlider.addEventListener('mousedown', handleDragStart);
  splideSlider.addEventListener('mousemove', handleDragMove);
  splideSlider.addEventListener('mouseup', handleDragEnd);

  // Listen to touch events on the document
  splideSlider.addEventListener('touchstart', handleDragStart, {
    passive: true,
  });
  splideSlider.addEventListener('touchmove', handleDragMove, { passive: true });
  splideSlider.addEventListener('touchend', handleDragEnd);

  splide.on('dragged', function () {
    gsap.to('.splide', { cursor: 'grab' });
    gsap.to('.image__container', { skewX: '0' });
  });
};

// Barba JS Enter and Leave Animation for all the pages
const homeOnceAnimations = (container) => {
  // Get the element with id "counter"
  const counterElement = document.getElementById('counter');

  // Define a random target value (between 0 and 99) and the durations
  const randomTarget = Math.floor(Math.random() * 100);
  const delayBeforeStart = 400; // 0.4 seconds
  const duration1 = 350; // 0.35 seconds
  const pauseDuration = 1300; // 1 second
  const duration2 = 350; // 0.35 seconds

  // Initialize the counter value to 0
  let currentValue = 0;

  // Function to update the counter value
  function updateCounter(increment, target, duration) {
    const startTime = Date.now();

    function update() {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;

      if (elapsedTime < duration) {
        currentValue += increment;
        counterElement.textContent = Math.round(currentValue);
        requestAnimationFrame(update);
      } else {
        currentValue = target;
        counterElement.textContent = Math.round(currentValue);
      }
    }
    requestAnimationFrame(update);
  }

  // Delay the start by 0.4 seconds
  setTimeout(() => {
    // Calculate the increment value per millisecond for the first phase (0 to randomTarget)
    const increment1 = (randomTarget / duration1) * 10; // Multiplying by 10 for smoother animation

    // Start the first phase (0 to randomTarget)
    updateCounter(increment1, randomTarget, duration1);

    // After the first phase, pause for 1 second
    setTimeout(() => {
      // Calculate the increment value per millisecond for the second phase (randomTarget to 100)
      const increment2 = ((100 - randomTarget) / duration2) * 10; // Multiplying by 10 for smoother animation

      // Start the second phase (randomTarget to 100)
      updateCounter(increment2, 100, duration2);
    }, pauseDuration);
  }, delayBeforeStart);

  // Preloader & Home timeline
  const preloaderTl = gsap
    .timeline({
      defaults: {
        ease: 'ease-out-quad',
        duration: 0.35,
        delay: 0.4,
      },
    })

    .to('.preloader__counter', { padding: '1.1rem 1.1rem' })
    .to('.preloader__counter', { padding: '2rem 2rem', delay: 1 })
    .to('.preloader__overlay', { top: 0, ease: 'custom', duration: 0.8 })
    .to('.preloader', {
      top: '100vh',
      ease: 'custom',
      duration: 0.8,
      delay: 0.1,
    })
    .to(
      '#footer-overlay',
      { width: '100%', duration: 0.7, ease: 'ease-in-out-cubic' },
      '<'
    )
    .to('#header-link', { opacity: 1 }, '<')
    .to('#header-comp1', { opacity: 1, stagger: 0.05, duration: 0.4 }, '<')
    .to('#header-link', { filter: 'blur(0px)' }, '<')
    .to(
      '#header-comp1',
      { filter: 'blur(0px)', stagger: 0.05, duration: 0.4 },
      '<'
    )
    .to('#footer-comp1', { opacity: 1, stagger: 0.05, duration: 0.4 }, '<')
    .to(
      '#footer-comp1',
      { filter: 'blur(0px)', stagger: 0.05, duration: 0.4 },
      '<'
    )
    .fromTo(
      '#home-paragraph',
      { yPercent: '140' },
      { yPercent: '0', stagger: 0.09, duration: 0.8, ease: 'ease-out-cubic' },
      4
    )
    .to(
      '#image-container',
      {
        clipPath: 'polygon(0 100%, 100% 100%, 100% 1%, 0 1%)',
        stagger: 0.08,
        duration: 0.6,
        ease: 'ease-out-cubic',
      },
      '<-0.8'
    )
    .to('#slide-heading', { opacity: 1, stagger: 0.05, duration: 0.8 }, '<');

  // Splide slider functionality for the carousel
  splideCarousel();
};

// Run homeOnceAnimations as the DOM is completely loaded
window.addEventListener('DOMContentLoaded', homeOnceAnimations);

const homeEnterAnimation = (container) => {
  // Press p to navigate to the works page
  function triggerBarbaTransitionToWorksPage(e) {
    // Only trigger the transition if the user presses the letter 'a'.
    if (e.key === 'p') {
      // Trigger the transition to the about page.
      barba.go('/works.html');
    }
  }

  // Event listener for the keyboard press event.
  document.addEventListener('keydown', triggerBarbaTransitionToWorksPage);

  // Press w to navigate to the about page
  function triggerBarbaTransitionToAboutPage(e) {
    // Only trigger the transition if the user presses the letter 'a'.
    if (e.key === 'w') {
      // Trigger the transition to the about page.
      barba.go('/about.html');
    }
  }

  // Event listener for the keyboard press event.
  document.addEventListener('keydown', triggerBarbaTransitionToAboutPage);

  const preloaderTl = gsap.timeline({
    defaults: {
      ease: 'ease-out-quad',
      duration: 0.35,
    },
  });
  preloaderTl

    .to('#footer-overlay', {
      width: '100%',
      duration: 0.7,
      ease: 'ease-in-out-cubic',
      delay: 0.1,
    })
    .to('#header-link', { opacity: 1 }, '<')
    .to('#header-comp1', { opacity: 1, stagger: 0.03 }, '<')
    .to('#header-link', { filter: 'blur(0px)' }, '<')
    .to('#header-comp1', { filter: 'blur(0px)', stagger: 0.03 }, '<')
    .to('#footer-comp1', { opacity: 1, stagger: 0.05, duration: 0.4 }, '<')
    .to(
      '#footer-comp1',
      { filter: 'blur(0px)', stagger: 0.05, duration: 0.4 },
      '<'
    )
    .fromTo(
      '#home-paragraph',
      { yPercent: '140' },
      { yPercent: '0', stagger: 0.09, duration: 0.8, ease: 'ease-out-cubic' },
      0.5
    )
    .to(
      '#image-container',
      {
        clipPath: 'polygon(0 100%, 100% 100%, 100% 1%, 0 1%)',
        stagger: 0.08,
        duration: 0.6,
        ease: 'ease-out-cubic',
      },
      '<+0.01'
    )
    .to('#slide-heading', { opacity: 1, stagger: 0.05, duration: 0.8 }, '<')
    .to('.hamburger__menu', { opacity: 1 }, '<')
    .to('.hamburger__menu', { filter: 'blur(0px)' }, '<');

  return preloaderTl;
};

const generalLeaveTl = gsap.timeline({
  paused: true,
  defaults: {
    ease: 'ease-in-out-cubic',
    duration: 0.6,
  },
});

generalLeaveTl
  .to('.transition__overlay', { top: '0', ease: 'custom', duration: 0.7 })
  .to('.transition__overlay', { top: '-100%', ease: 'custom', duration: 0.7 });

const show = () => {
  return new Promise((resolve) =>
    generalLeaveTl.restart().play().then(resolve)
  );
};

const projectTransitionAnimation = (container) => {
  function scrollProjectWrapper(deltaY) {
    const projectWrapper = document.querySelector('#project-wrapper');
    const scrollAmount = -(projectWrapper.scrollWidth - window.innerWidth);
    const currentX =
      parseFloat(getComputedStyle(projectWrapper).transform.split(',')[4]) || 0;
    const newX = Math.min(0, Math.max(currentX + deltaY, scrollAmount));

    // Add the scroll-animation class
    projectWrapper.classList.add('scroll-animation');

    projectWrapper.style.transform = `translateX(${newX}px)`;

    // Listen for the transition end event to remove the class
    projectWrapper.addEventListener('transitionend', () => {
      projectWrapper.classList.remove('scroll-animation');
    });
  }

  // Scroll event listener
  function handleScroll(event) {
    if (window.matchMedia('(min-width: 534px)').matches) {
      if (event.deltaY !== 0) {
        // Use deltaY for vertical mouse scrolling
        scrollProjectWrapper(-event.deltaY);
      }
    }
  }

  // Event listener for mousewheel and keyboard events
  window.addEventListener('wheel', handleScroll);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      // Use deltaY for up and down arrow keys
      scrollProjectWrapper(event.key === 'ArrowUp' ? 50 : -50); // Adjust the scrolling distance as needed
    }
  });

  // Initial call to scrollProjectWrapper to set the initial position
  scrollProjectWrapper(0);

  // LINK HOVER ANIMATION
  const links = document.querySelectorAll('.right__container--link');
  // const bottomLines = document.querySelectorAll(".bottom__line");

  links.forEach((link) => {
    const maskTl = gsap
      .timeline({ paused: true })
      .to('#link-overlay', { top: '0', duration: 0.4, ease: 'ease-out-cubic' })
      .to(
        link.querySelector('.bottom__line'),
        { autoAlpha: 1, duration: 0.1 },
        '<'
      );

    link.addEventListener('mouseenter', () => maskTl.play());
    link.addEventListener('mouseleave', () => maskTl.reverse());
  });

  const projectsTl = gsap.timeline({
    defaults: {
      ease: 'ease-out-cubic',
      duration: 0.6,
    },
  });
  projectsTl

    .to('#project-comp', { filter: 'blur(0px)', stagger: 0.05, delay: 1 }, 0)
    .to('#project-comp', { opacity: 1, stagger: 0.05 }, 0.5)
    .to('#project-para', { y: '0', stagger: 0.09, duration: 0.8 }, 0.5)
    .to(
      '#project-imageContainer',
      {
        clipPath: 'polygon(0 100%, 100% 100%, 100% 1%, 0 1%)',
        duration: 0.9,
        ease: 'custom',
      },
      0.5
    );
};

const projectLeaveAnimation = (container) => {
  return new Promise((resolve) => {
    gsap.set('#image-wrapper', { overflow: 'hidden' });
    gsap.set('#rotate-image', { rotate: 0 });

    const leaveTl = gsap.timeline({
      defaults: {
        ease: 'ease-out-cubic',
      },
      onComplete: () => {
        resolve();
      },
    });

    leaveTl
      .to('#content-paragraph', { opacity: 0, duration: 0.1 })
      .to(
        '#rotate-image',
        { y: '-100%', rotate: '0', duration: 0.2, ease: 'ease-in-quart' },
        '<0.25'
      )
      .to('#image-wrapper', { opacity: 0 });
  });
};

const worksEnterAnimation = (container) => {
  // PARAGRAPH TEXT CHANGE ON IMAGE HOVER FUNCTIONALITY
  const paragraph1 = document.querySelector('.paragraph1');
  const paragraph2 = document.querySelector('.paragraph2');

  const imageContainers = document.querySelectorAll('#works-container');

  function triggerBarbaTransitionToAboutPage(e) {
    // Only trigger the transition if the user presses the letter 'a'.
    if (e.key === 'h') {
      // Trigger the transition to the about page.
      barba.go('/index.html');
    }
  }

  // Event listener for the keyboard press event.
  document.addEventListener('keydown', triggerBarbaTransitionToAboutPage);

  const worksTl = gsap.timeline({
    defaults: {
      ease: 'ease-out-cubic',
      duration: 0.8,
      stagger: 0.05,
    },
  });

  worksTl
    .to(
      '#works-container',
      {
        clipPath: 'polygon(0 100%, 100% 100%, 100% 1%, 0 1%)',
        stagger: 0.04,
        duration: 0.7,
        ease: 'ease-out-cubic',
      },
      0.45
    )
    .from(
      '.works__paragraph',
      { yPercent: '140', stagger: 0.09, duration: 0.9 },
      '<'
    )
    .to('.hamburger__menu', { opacity: 1 }, 0.5)
    .to('.hamburger__menu', { filter: 'blur(0px)' }, '<')
    .to('#header-comp1', { opacity: 1, stagger: 0.05, duration: 0.4 }, 0)
    .to('#header-link', { opacity: 1, stagger: 0.05, duration: 0.4 }, 0)
    .to(
      '#footer-overlay',
      { width: '100%', duration: 0.7, ease: 'ease-in-out-cubic' },
      0
    )
    .to(
      '#header-comp1',
      { filter: 'blur(0px)', stagger: 0.05, duration: 0.4 },
      0
    )
    .to(
      '#header-link',
      { filter: 'blur(0px)', stagger: 0.05, duration: 0.4 },
      0
    )
    .to('#footer-comp1', { opacity: 1, stagger: 0.05, duration: 0.4 }, 0)
    .to(
      '#footer-comp1',
      { filter: 'blur(0px)', stagger: 0.05, duration: 0.4 },
      0
    );

  return worksTl;
};

const aboutOnceAnimation = (container) => {
  const aboutTl = gsap.timeline({
    defaults: {
      ease: 'ease-out-cubic',
      duration: 0.8,
      stagger: 0.05,
    },
  });
  aboutTl

    .to('#footer-overlay', {
      width: '100%',
      delay: 0.3,
      duration: 0.7,
      ease: 'ease-in-out-cubic',
    })
    .to('#header-link', { opacity: 1 }, '<.5')
    .to('#header-comp1', { opacity: 1 }, '<')
    .to('#header-link', { filter: 'blur(0px)' }, '<')
    .to('#header-comp1', { filter: 'blur(0px)' }, '<')
    .to('#footer-comp1', { opacity: 1 }, '<')
    .to('#footer-comp1', { filter: 'blur(0px)' }, '<')
    .from(
      '#about-paragraph',
      { yPercent: '140', stagger: 0.04, duration: 0.6 },
      '<'
    )
    .fromTo('#right-container', { opacity: 0 }, { opacity: 1 }, '<')
    .to('.hamburger__menu', { opacity: 1 }, 1.3)
    .to('.hamburger__menu', { filter: 'blur(0px)' }, 1.3);

  return aboutTl;
};

const aboutEnterAnimation = (container) => {
  const aboutTl = gsap.timeline({
    defaults: {
      ease: 'ease-out-cubic',
      duration: 0.8,
      stagger: 0.05,
    },
  });
  aboutTl

    .fromTo('#right-container', { opacity: 0 }, { opacity: 1 })
    .from(
      '#about-paragraph',
      { yPercent: '140', stagger: 0.04, duration: 0.6 },
      '<0.5'
    )
    .to('.hamburger__menu', { opacity: 1 }, 1.3)
    .to('.hamburger__menu', { filter: 'blur(0px)' }, 1.3)
    .to(
      '#footer-overlay',
      { width: '100%', duration: 0.7, ease: 'ease-in-out-cubic' },
      0
    )
    .to('#header-link', { opacity: 1, duration: 0.4 }, 0)
    .to('#header-comp1', { opacity: 1, stagger: 0.05, duration: 0.4 }, 0)
    .to('#header-link', { filter: 'blur(0px)', duration: 0.4 }, 0)
    .to(
      '#header-comp1',
      { filter: 'blur(0px)', stagger: 0.05, duration: 0.4 },
      0
    )
    .to('#footer-comp1', { opacity: 1, stagger: 0.05, duration: 0.4 }, 0)
    .to(
      '#footer-comp1',
      { filter: 'blur(0px)', stagger: 0.05, duration: 0.4 },
      0
    );

  return aboutTl;
};

const faceRevealAnimation = (container) => {
  const faceReveal = document.querySelector('.face__reveal');
  const imageContainer = document.querySelector('#right-container');

  faceReveal.addEventListener('mouseenter', () => {
    gsap.to(imageContainer, {
      clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)',
      ease: 'ease-out-cubic',
      duration: -1,
    });
  });
  faceReveal.addEventListener('mouseleave', () => {
    gsap.to(imageContainer, {
      clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0% 100%)',
      ease: 'ease-in-cubic',
      duration: 0.3,
    });
  });

  function triggerBarbaTransitionToAboutPage(e) {
    // Only trigger the transition if the user presses the letter 'a'.
    if (e.key === 'h') {
      // Trigger the transition to the about page.
      barba.go('/index.html');
    }
  }

  // Event listener for the keyboard press event.
  document.addEventListener('keydown', triggerBarbaTransitionToAboutPage);
};

const worksOnceAnimation = (container) => {
  const worksTl = gsap.timeline({
    defaults: {
      ease: 'ease-out-cubic',
      duration: 0.8,
      stagger: 0.05,
    },
  });
  worksTl

    .to('#footer-overlay', {
      width: '100%',
      delay: 0.5,
      duration: 0.7,
      ease: 'ease-in-out-cubic',
    })
    .to('#header-link', { opacity: 1 }, '<.5')
    .to('#header-comp1', { opacity: 1 }, '<')
    .to('#header-link', { filter: 'blur(0px)' }, '<')
    .to('#header-comp1', { filter: 'blur(0px)' }, '<')
    .to('#footer-comp1', { opacity: 1 }, '<')
    .to('#footer-comp1', { filter: 'blur(0px)' }, '<')
    .to(
      '#works-container',
      {
        clipPath: 'polygon(0 100%, 100% 100%, 100% 1%, 0 1%)',
        stagger: 0.04,
        duration: 0.7,
        ease: 'ease-out-cubic',
      },
      '<'
    )
    .from(
      '.works__paragraph',
      { yPercent: '140', stagger: 0.09, duration: 0.9 },
      '<'
    );

  return worksTl;
};

const mobileNavigationAnimation = (container) => {
  const hamburgerMenus = document.querySelectorAll('.hamburger__menu');
  const hamburgerClose = document.querySelectorAll('#close');

  const mobileNavTl = gsap
    .timeline({
      paused: true,
      defaults: {
        ease: 'ease-out-cubic',
        duration: 0.5,
      },
    })

    .to('.mobile__nav', { autoAlpha: 1, pointerEvents: 'visible' })
    .to('.list__text', { y: '0', stagger: 0.01, delay: 0.3, duration: 0.5 }, 0)
    .to('#mobileComp', { opacity: 1, stagger: 0.01 }, '<')
    .to('#mobileComp', { filter: 'blur(0px)', stagger: 0.01 }, '<')
    .to('.list__line', { width: '100%', stagger: 0.01 }, '<');

  hamburgerMenus.forEach((menu) => {
    menu.addEventListener('click', () => mobileNavTl.play());
  });
  hamburgerClose.forEach((close) => {
    close.addEventListener('click', () => mobileNavTl.reverse());
  });
};

const projectHorizontalScroll = (container) => {
  function scrollProjectWrapper(deltaY) {
    const projectWrapper = document.querySelector('#project-wrapper');
    const scrollAmount = -(projectWrapper.scrollWidth - window.innerWidth);
    const currentX =
      parseFloat(getComputedStyle(projectWrapper).transform.split(',')[4]) || 0;
    const newX = Math.min(0, Math.max(currentX + deltaY, scrollAmount));
    projectWrapper.style.transform = `translateX(${newX}px)`;
  }

  // Scroll event listener
  function handleScroll(event) {
    if (window.matchMedia('(min-width: 534px)').matches) {
      if (event.deltaY !== 0) {
        // Use deltaY for vertical mouse scrolling
        scrollProjectWrapper(-event.deltaY);
      }
    }
  }

  // Event listener for mousewheel and keyboard events
  window.addEventListener('wheel', handleScroll);
  window.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      // Use deltaY for up and down arrow keys
      scrollProjectWrapper(event.key === 'ArrowUp' ? 50 : -50); // Adjust the scrolling distance as needed
    }
  });

  // Initial call to scrollProjectWrapper to set the initial position
  scrollProjectWrapper(0);
};

// Initialize barba js
barba.init({
  timeout: 6000,
  transitions: [
    {
      name: 'work-transition',
      async once(data) {
        worksOnceAnimation(data.next.container);
        mobileNavigationAnimation(data.next.container);
      },
      async leave(data) {
        data.current.container.style.opacity = '0';
        await show();
      },
      async enter(data) {
        data.current.container.style.opacity = '0';
        worksEnterAnimation(data.next.container);
        mobileNavigationAnimation(data.next.container);
      },
    },
    {
      name: 'home-transition',
      to: {
        namespace: ['home-page'],
      },
      async once(data) {
        homeOnceAnimations(data.next.container);
        mobileNavigationAnimation(data.next.container);
      },
      async beforeLeave(data) {
        data.current.container.style.opacity = '0';
        destroySplide(); // Destroy the Splide instance before leaving.
      },
      async leave(data) {
        await show();
      },
      async enter(data) {
        data.current.container.style.opacity = '0';

        let splide = new Splide(data.next.container.querySelector('.splide'), {
          perMove: 1,
          gap: 0,
          drag: 'free',
          autoWidth: 'true',
          autoHeight: 'true',
          type: 'loop',
          cloneStatus: false,
          arrows: false,
          pagination: false,
          autoScroll: {
            speed: 1.5,
          },
          easing: 'cubic-bezier(0.25,0.46,0.45,0.94)',
        }).mount(window.splide.Extensions);

        homeEnterAnimation(data.next.container);
        mobileNavigationAnimation(data.next.container);
      },
    },
    {
      name: 'about-transition',
      to: {
        namespace: ['about-page'],
      },
      async once(data) {
        aboutOnceAnimation(data.next.container);
        mobileNavigationAnimation(data.next.container);
      },
      async leave(data) {
        data.current.container.style.opacity = '0';
        await show();
      },
      async enter(data) {
        data.current.container.style.opacity = '0';
        aboutEnterAnimation(data.next.container);
        faceRevealAnimation();
        mobileNavigationAnimation(data.next.container);
      },
    },
    {
      name: 'project-transition',
      to: {
        namespace: ['project-page'],
      },
      async once(data) {
        projectTransitionAnimation(data.next.container);
      },
      async beforeLeave(data) {
        // Wrap the projectLeaveAnimation in a Promise
        await new Promise(async (resolve) => {
          await projectLeaveAnimation(data.next.container);
          resolve();
        });

        // Now that the animation is completed, you can change the opacity and trigger the transition
        data.current.container.style.opacity = '0';
        data.current.container.style.transition = 'opacity 0s'; // Add a transition for smooth fading

        // Delay the page transition to ensure the opacity change takes effect before moving to the next page
        await new Promise((resolve) => {
          setTimeout(resolve, 100); // Adjust the duration to match your transition duration
        });
      },
      async leave(data) {
        await projectLeaveAnimation(data.current.container);
        await show();
        window.scrollTo(0, 0);
      },
      async enter(data) {
        projectTransitionAnimation(data.next.container);
        projectHorizontalScroll(data.next.container);
      },
    },
  ],
});

// INITIALIZE LENIS SMOOTH SCROLL
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
});

function raf(time) {
  lenis.raf(time);
  ScrollTrigger.update();
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// CUSTOM CURSOR ANIMATION
const customCursor = document.querySelector('.custom__cursor');
let mouseXPosition;
let mouseYPosition;

window.addEventListener('mousemove', (e) => {
  mouseXPosition = e.clientX;
  mouseYPosition = e.clientY;

  gsap.to(customCursor, {
    top: mouseYPosition,
    left: mouseXPosition,
    ease: 'ease-out-cubic',
    duration: 0.1,
  });
});

// LOGIC TO UPDATE THE TIME ON THE HEADER NAVBAR
function updateTime() {
  const hours = document.querySelectorAll('#hour');
  const minutes = document.querySelectorAll('#minutes');

  const date = new Date();

  hours.forEach((hour) => {
    if (date.getHours() < 10) {
      hour.innerHTML = '0' + date.getHours();
    } else {
      hour.innerHTML = date.getHours();
    }
  });

  minutes.forEach((minute) => {
    if (date.getMinutes() < 10) {
      minute.innerHTML = '0' + date.getMinutes();
    } else {
      minute.innerHTML = date.getMinutes();
    }
  });

  setTimeout(function () {
    updateTime();
  }, 1000);
}
updateTime();

// DYNAMIC YEAR ON THE FOOTER
const footerDates = document.querySelectorAll('#year');
const footerYear = new Date();

footerDates.forEach((year) => (year.innerHTML = footerYear.getFullYear()));
