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
  const hoverSelectors = 'a, button, input, select, textarea, .service-card, .why-item, .project-card, .console-tab, .timeline-content';
  document.querySelectorAll(hoverSelectors).forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorDot.style.transform  = 'translate(-50%, -50%) scale(2.2)';
      cursorDot.style.background = '#06b6d4'; /* cyber-cyan */
      cursorDot.style.boxShadow  = '0 0 15px #06b6d4, 0 0 30px #3b82f6';
    });
    el.addEventListener('mouseleave', () => {
      cursorDot.style.transform  = 'translate(-50%, -50%) scale(1)';
      cursorDot.style.background = '#06b6d4';
      cursorDot.style.boxShadow  = '0 0 10px #06b6d4';
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
      this.r    = Math.random() * 1.4 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = (Math.random() - 0.5) * 0.3;
      this.life = Math.random();
      this.maxLife = 0.6 + Math.random() * 0.4;
      const hues = [190, 195, 205]; // Cyans and light blues
      this.hue  = hues[Math.floor(Math.random() * hues.length)];
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life += 0.0015;
      if (this.life > this.maxLife || this.x < 0 || this.x > W || this.y < 0 || this.y > H) {
        this.reset();
      }
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxLife) * Math.PI) * 0.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 95%, 65%, ${alpha})`;
      ctx.fill();
    }
  }

  // Create particles
  for (let i = 0; i < 90; i++) particles.push(new Particle());

  function drawConnections() {
    const maxDist = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.1;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
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
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveNavLink();
  }, { passive: true });

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
      const top    = section.offsetTop - 120;
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
  const revealEls = document.querySelectorAll('.reveal');

  revealEls.forEach((el, i) => {
    const delay = Math.min(i % 3 + 1, 3);
    el.classList.add(`reveal-delay-${delay}`);
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealEls.forEach(el => revealObserver.observe(el));

  // ──────────────────────────────────────────
  // 7. COUNTER ANIMATION (HERO STATS)
  // ──────────────────────────────────────────
  const statNums = document.querySelectorAll('.stat-num');

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1500;
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
        glow.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(6, 182, 212, 0.08) 0%, transparent 55%)`;
      }
    });
  });

  // ──────────────────────────────────────────
  // 9. FORM HANDLING
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

      // Simulate async submission
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success
      journeyForm.style.display  = 'none';
      formSuccess.style.display  = 'block';
      formSuccess.style.opacity  = '0';
      formSuccess.style.transform = 'translateY(16px)';
      formSuccess.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
      requestAnimationFrame(() => {
        formSuccess.style.opacity   = '1';
        formSuccess.style.transform = 'translateY(0)';
      });
    });
  }

  // ──────────────────────────────────────────
  // 10. HOVER TILT ON ABOUT CARDS
  // ──────────────────────────────────────────
  document.querySelectorAll('.about-card.glass-panel').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect  = card.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width  - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // ──────────────────────────────────────────
  // 11. FLOATING ORBS INTERACTION
  // ──────────────────────────────────────────
  document.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.orb');
    const fx   = (e.clientX / window.innerWidth  - 0.5) * 16;
    const fy   = (e.clientY / window.innerHeight - 0.5) * 12;
    orbs.forEach((orb, i) => {
      const factor = (i + 1) * 0.4;
      orb.style.transform = `translate(${fx * factor}px, ${fy * factor}px)`;
    });
  });

  // ──────────────────────────────────────────
  // 12. INTERACTIVE DEVELOPER CONSOLE
  // ──────────────────────────────────────────
  const consoleTabs = document.getElementById('consoleTabs');
  const termLog     = document.getElementById('termLog');
  const termStatus  = document.getElementById('term-status');

  const termMessages = {
    robot: [
      "roscore initialized successfully.",
      "LIDAR node stream: ONLINE [360hz]",
      "obstacle_avoidance node loaded.",
      "Navigation telemetry system nominal."
    ],
    iot: [
      "Accessing WiFi node transceiver...",
      "Connected. RSSI: -48dBm",
      "MQTT telemetry packet client connected.",
      "Streaming raw JSON payloads to broker."
    ],
    automation: [
      "Initializing Modbus TCP handshake...",
      "Conveyor actuator logic registers: ACTIVE",
      "SCADA analytics visual link verified.",
      "Part sorting supervisor thread running."
    ]
  };

  let activeTimeout = null;

  function simulateTerminal(tabKey) {
    if (activeTimeout) clearTimeout(activeTimeout);
    termLog.innerHTML = "";
    termStatus.textContent = "COMPILING...";
    termStatus.style.color = "var(--cyber-purple)";

    const lines = termMessages[tabKey];
    let index = 0;

    function printNextLine() {
      if (index < lines.length) {
        const line = document.createElement('div');
        line.innerHTML = `&gt; ${lines[index]}`;
        termLog.appendChild(line);
        termLog.scrollTop = termLog.scrollHeight;
        index++;
        activeTimeout = setTimeout(printNextLine, 350);
      } else {
        const finished = document.createElement('div');
        finished.innerHTML = `&gt; Compilation complete. Ready.<span class="cursor-blink"></span>`;
        termLog.appendChild(finished);
        termLog.scrollTop = termLog.scrollHeight;
        termStatus.textContent = "ONLINE";
        termStatus.style.color = "var(--cyber-green)";
      }
    }

    activeTimeout = setTimeout(printNextLine, 200);
  }

  if (consoleTabs) {
    consoleTabs.querySelectorAll('.console-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        // Toggle Active Tab Style
        consoleTabs.querySelectorAll('.console-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // Toggle Code Block Display
        const selectedTab = tab.getAttribute('data-tab');
        document.querySelectorAll('.code-block').forEach(block => {
          block.classList.remove('active');
        });
        document.getElementById(`code-${selectedTab}`).classList.add('active');

        // Trigger Terminal Simulator
        simulateTerminal(selectedTab);
      });
    });

    // Run initial compilation
    simulateTerminal('robot');
  }

  // ──────────────────────────────────────────
  // 13. INTERACTIVE TIMELINE SCROLL PATH
  // ──────────────────────────────────────────
  const timelineNodes = document.querySelectorAll('.timeline-node');
  if (timelineNodes.length) {
    const timelineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const node = entry.target.closest('.timeline-node');
          if (node) {
            timelineNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');
          }
        }
      });
    }, { threshold: 0.55, rootMargin: '-10% 0px -15% 0px' });

    document.querySelectorAll('.timeline-content').forEach(content => {
      timelineObserver.observe(content);
    });
  }

})();
