// Calling the cloudinary responsive method for image responsiveness
let cl = cloudinary.Cloudinary.new({ cloud_name: 'dp20bvzhn' });
cl.responsive();

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
