/**
 * KODAVARA — Main Site JavaScript
 * GSAP + ScrollTrigger powered animations & interactions
 */

// ============================================================
// WAIT FOR GSAP TO LOAD
// ============================================================
function initKodavara() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    setTimeout(initKodavara, 50);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  // ============================================================
  // NAVIGATION
  // ============================================================
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  // Active nav link
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile menu
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileMenu = document.querySelector('.nav__mobile');
  const mobileClose = document.querySelector('.nav__mobile-close');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
    if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => mobileMenu.classList.remove('open'));
    });
  }

  // ============================================================
  // HERO ANIMATIONS
  // ============================================================
  const heroTimeline = gsap.timeline({ delay: 0.2 });
  
  const heroEyebrow = document.querySelector('.hero__eyebrow');
  const heroHeadline = document.querySelector('.hero__headline');
  const heroSub = document.querySelector('.hero__sub');
  const heroActions = document.querySelector('.hero__actions');
  const heroScroll = document.querySelector('.hero__scroll');
  const heroMountain = document.querySelector('.hero__mountain');

  if (heroEyebrow) {
    heroTimeline.fromTo(heroEyebrow, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' });
  }
  if (heroHeadline) {
    const lines = heroHeadline.querySelectorAll('.hero__headline-line');
    if (lines.length) {
      heroTimeline.fromTo(lines,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' },
        '-=0.3'
      );
    } else {
      heroTimeline.fromTo(heroHeadline, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, '-=0.3');
    }
  }
  if (heroSub) {
    heroTimeline.fromTo(heroSub, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
  }
  if (heroActions) {
    heroTimeline.fromTo(heroActions, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4');
  }
  if (heroScroll) {
    heroTimeline.fromTo(heroScroll, { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.2');
  }
  if (heroMountain) {
    heroTimeline.fromTo(heroMountain, 
      { opacity: 0, x: 60 },
      { opacity: 0.9, x: 0, duration: 1.2, ease: 'power3.out' },
      0.3
    );
  }

  // ============================================================
  // SCROLL REVEAL — .reveal elements
  // ============================================================
  gsap.utils.toArray('.reveal').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      x: 0,
      duration: 0.75,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  gsap.utils.toArray('.reveal-scale').forEach(el => {
    gsap.to(el, {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: 'back.out(1.2)',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true
      }
    });
  });

  // Staggered children
  gsap.utils.toArray('[data-stagger]').forEach(container => {
    const children = container.children;
    gsap.fromTo(children,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // ============================================================
  // PARALLAX ORBS
  // ============================================================
  gsap.utils.toArray('.orb').forEach((orb, i) => {
    gsap.to(orb, {
      y: i % 2 === 0 ? -60 : 60,
      ease: 'none',
      scrollTrigger: {
        trigger: orb.parentElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  });

  // ============================================================
  // TOPOGRAPHIC CANVAS ANIMATION
  // ============================================================
  const topoCanvas = document.getElementById('topo-canvas');
  if (topoCanvas) {
    initTopoCanvas(topoCanvas);
  }

  // ============================================================
  // COUNTER ANIMATION
  // ============================================================
  gsap.utils.toArray('[data-count]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo({ val: 0 }, { val: target }, {
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            const v = this.targets()[0].val;
            el.textContent = prefix + (Number.isInteger(target) ? Math.round(v) : v.toFixed(1)) + suffix;
          }
        });
      }
    });
  });

  // ============================================================
  // FLOW ARROW DRAW ANIMATION
  // ============================================================
  gsap.utils.toArray('.flow-node').forEach((node, i) => {
    gsap.fromTo(node,
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1, scale: 1,
        duration: 0.4,
        delay: i * 0.12,
        ease: 'back.out(1.5)',
        scrollTrigger: {
          trigger: node.closest('.flow') || node,
          start: 'top 85%',
          once: true
        }
      }
    );
  });

  // ============================================================
  // CARD HOVER DEPTH
  // ============================================================
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 6,
        rotateX: -y * 6,
        duration: 0.4,
        ease: 'power2.out',
        transformPerspective: 800
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power3.out' });
    });
  });

  // ============================================================
  // SMOOTH SECTION TRANSITIONS
  // ============================================================
  gsap.utils.toArray('.section').forEach(section => {
    gsap.fromTo(section,
      { '--section-progress': '0%' },
      {
        '--section-progress': '100%',
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    );
  });
}

// ============================================================
// TOPOGRAPHIC CANVAS
// ============================================================
function initTopoCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let W, H, animFrame;
  let t = 0;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function drawLine(offset, amplitude, freq, yBase, color) {
    ctx.beginPath();
    ctx.moveTo(0, yBase);
    for (let x = 0; x <= W; x += 2) {
      const y = yBase
        + Math.sin(x * freq + t + offset) * amplitude
        + Math.sin(x * freq * 0.4 + t * 0.7 + offset * 2) * amplitude * 0.5;
      ctx.lineTo(x, y);
    }
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    t += 0.004;

    const lines = [
      { offset: 0,   amp: 18, freq: 0.008, yBase: H * 0.3 },
      { offset: 1.2, amp: 22, freq: 0.007, yBase: H * 0.4 },
      { offset: 2.4, amp: 16, freq: 0.009, yBase: H * 0.5 },
      { offset: 3.6, amp: 20, freq: 0.006, yBase: H * 0.6 },
      { offset: 4.8, amp: 14, freq: 0.010, yBase: H * 0.7 },
      { offset: 6.0, amp: 18, freq: 0.008, yBase: H * 0.75 },
    ];

    lines.forEach((l, i) => {
      const alpha = 0.04 + (i * 0.005);
      drawLine(l.offset, l.amp, l.freq, l.yBase, `rgba(45,140,255,${alpha})`);
    });

    animFrame = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();

  // Pause when not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(animFrame);
    else draw();
  });
}

// ============================================================
// INIT
// ============================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initKodavara);
} else {
  initKodavara();
}
