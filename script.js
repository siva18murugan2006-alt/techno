/* ============================================================
   TECHNERDZ – script.js
   Animations, interactions, particle system, form handling
   ============================================================ */

(function () {
  'use strict';

  // ──────────────────────────────────────────
  // 1. CUSTOM CURSOR
  // ──────────────────────────────────────────
  const cursorGlow = document.getElementById('cursorGlow');
  const cursorDot  = document.getElementById('cursorDot');

  document.addEventListener('mousemove', (e) => {
    cursorGlow.style.left = e.clientX + 'px';
    cursorGlow.style.top  = e.clientY + 'px';
    cursorDot.style.left  = e.clientX + 'px';
    cursorDot.style.top   = e.clientY + 'px';
  });

  document.addEventListener('mouseenter', () => {
    cursorGlow.style.opacity = '1';
    cursorDot.style.opacity  = '1';
  });
  document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
    cursorDot.style.opacity  = '0';
  });

  // Scale cursor on interactive elements
  document.querySelectorAll('a, button, input, select, textarea, .service-card, .why-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform  = 'translate(-50%, -50%) scale(2.5)';
      cursorDot.style.background = '#12a0cc';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform  = 'translate(-50%, -50%) scale(1)';
      cursorDot.style.background = '#0a7ea4';
    });
  });

  // ──────────────────────────────────────────
  // 2. PARTICLE CANVAS
  // ──────────────────────────────────────────
  const canvas  = document.getElementById('particleCanvas');
  const ctx     = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resizeCanvas() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x    = Math.random() * W;
      this.y    = Math.random() * H;
      this.r    = Math.random() * 1.5 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.4;
      this.vy   = (Math.random() - 0.5) * 0.4;
      this.life = Math.random();
      this.maxLife = 0.6 + Math.random() * 0.4;
      const hues = [195, 200, 205];
      this.hue  = hues[Math.floor(Math.random() * hues.length)];
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life += 0.002;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset();
      }
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.6;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, ${alpha})`;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function drawConnections() {
    const maxDist = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.12;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
          ctx.lineWidth   = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ──────────────────────────────────────────
  // 3. NAVBAR SCROLL BEHAVIOR
  // ──────────────────────────────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    updateActiveNavLink();
  });

  // ──────────────────────────────────────────
  // 4. HAMBURGER MENU
  // ──────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'translateY(7px) rotate(45deg)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ──────────────────────────────────────────
  // 5. ACTIVE NAV LINK ON SCROLL
  // ──────────────────────────────────────────
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY  = window.scrollY;
    sections.forEach(section => {
      const top    = section.offsetTop - 100;
      const bottom = top + section.offsetHeight;
      const id     = section.getAttribute('id');
      const link   = document.querySelector(`.nav-link[href="#${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < bottom);
      }
    });
  }

  // ──────────────────────────────────────────
  // 6. SCROLL REVEAL ANIMATIONS
  // ──────────────────────────────────────────
  const revealEls = document.querySelectorAll(
    '.section-label, .section-title, .section-subtitle, .about-card, ' +
    '.service-card, .why-item, .contact-card, .about-text, .about-visual, .footer-brand'
  );

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    const delay = Math.min(i % 4, 4);
    if (delay > 0) el.classList.add(`reveal-delay-${delay}`);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ──────────────────────────────────────────
  // 7. COUNTER ANIMATION (HERO STATS)
  // ──────────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num');

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1800;
    const step     = 16;
    const steps    = duration / step;
    const inc      = target / steps;
    let current    = 0;

    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = Math.floor(current);
    }, step);
  }

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNums.forEach(el => animateCounter(el));
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  if (statNums.length) counterObserver.observe(statNums[0].closest('.hero-stats'));

  // ──────────────────────────────────────────
  // 8. SERVICE CARD MOUSE GLOW FOLLOW
  // ──────────────────────────────────────────
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x    = ((e.clientX - rect.left) / rect.width)  * 100;
      const y    = ((e.clientY - rect.top)  / rect.height) * 100;
      const glow = card.querySelector('.service-card-glow');
      if (glow) {
        glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(0,212,255,0.1) 0%, transparent 50%)`;
      }
    });
  });

  // ──────────────────────────────────────────
  // 9. SMOOTH PARALLAX ON HERO
  // ──────────────────────────────────────────
  const hero = document.querySelector('.hero');
  window.addEventListener('scroll', () => {
    if (hero) {
      const scrolled = window.scrollY;
      hero.style.backgroundPositionY = `calc(50% + ${scrolled * 0.3}px)`;
    }
  }, { passive: true });

  // ──────────────────────────────────────────
  // 10. FORM HANDLING
  // ──────────────────────────────────────────
  const journeyForm  = document.getElementById('journeyForm');
  const formSuccess  = document.getElementById('formSuccess');
  const formSubmit   = document.getElementById('formSubmit');

  if (journeyForm) {
    journeyForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Disable + show loader
      formSubmit.disabled = true;
      formSubmit.querySelector('.submit-text').style.display = 'none';
      formSubmit.querySelector('.submit-loader').style.display = 'block';

      // Simulate async submission (replace with actual fetch in production)
      await new Promise(resolve => setTimeout(resolve, 1800));

      // Show success
      journeyForm.style.display  = 'none';
      formSuccess.style.display  = 'block';
      formSuccess.style.opacity  = '0';
      formSuccess.style.transform = 'translateY(20px)';
      formSuccess.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      requestAnimationFrame(() => {
        formSuccess.style.opacity   = '1';
        formSuccess.style.transform = 'translateY(0)';
      });
    });
  }

  // ──────────────────────────────────────────
  // 11. HOVER TILT ON ABOUT CARDS
  // ──────────────────────────────────────────
  document.querySelectorAll('.about-card.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ──────────────────────────────────────────
  // 12. FLOATING ORBS INTERACTION
  // ──────────────────────────────────────────
  document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.orb');
    const fx   = (e.clientX / window.innerWidth  - 0.5) * 20;
    const fy   = (e.clientY / window.innerHeight - 0.5) * 15;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.3;
      orb.style.transform = `translate(${fx * factor}px, ${fy * factor}px)`;
    });
  });

})();
