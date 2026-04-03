// ── NAVIGATION ──
const nav = document.querySelector('nav');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navLinkItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
});

hamburger?.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const bars = hamburger.querySelectorAll('span');
  bars[0].style.transform = navLinks.classList.contains('open') ? 'rotate(45deg) translate(5px, 5px)' : '';
  bars[1].style.opacity = navLinks.classList.contains('open') ? '0' : '1';
  bars[2].style.transform = navLinks.classList.contains('open') ? 'rotate(-45deg) translate(5px, -5px)' : '';
});

navLinkItems.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
  });
});

// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkItems.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { threshold: 0.3 });

sections.forEach(s => { sectionObserver.observe(s); });

// ── SCROLL REVEAL ──
// Exposed globally so render.js can call it after injecting dynamic content
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

window.observeReveals = () => {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver.observe(el);
  });
};

// Initial pass for any reveals already in the HTML
window.observeReveals();

// ── TYPING ANIMATION ──
const typingEl = document.getElementById('typing-text');
if (typingEl) {
  // Use phrases from data.js if available, otherwise fallback
  const phrases = (typeof PORTFOLIO !== 'undefined' && PORTFOLIO.typingPhrases)
    ? PORTFOLIO.typingPhrases
    : ['Mechanical Engineer', 'Robotics Designer', 'Electronics Enthusiast'];

  let phraseIndex = 0, charIndex = 0, deleting = false;

  function type() {
    const current = phrases[phraseIndex];
    typingEl.textContent = deleting
      ? current.substring(0, charIndex--)
      : current.substring(0, charIndex++);

    let delay = deleting ? 60 : 100;
    if (!deleting && charIndex > current.length) {
      delay = 2000; deleting = true;
    } else if (deleting && charIndex < 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  type();
}

// ── CONTACT FORM (Formspree) ──
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn    = document.getElementById('form-submit-btn');
  const status = document.getElementById('form-status');

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const data = new FormData(contactForm);

  try {
    const res = await fetch(contactForm.action, {
      method:  'POST',
      body:    data,
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      status.style.display    = 'block';
      status.style.color      = 'var(--accent2)';
      status.style.fontFamily = 'var(--font-mono)';
      status.style.fontSize   = '0.8rem';
      status.style.padding    = '0.8rem 0';
      status.textContent      = '✓ Message sent — I\'ll be in touch soon.';
      contactForm.reset();
      btn.textContent = 'Message Sent ✓';
      btn.style.background = 'var(--accent2)';
    } else {
      throw new Error('Form submission failed');
    }
  } catch {
    status.style.display  = 'block';
    status.style.color    = 'var(--accent3)';
    status.textContent    = '✕ Something went wrong. Email me directly at imbigulamarcus99@gmail.com';
    btn.textContent       = 'Send Message →';
    btn.disabled          = false;
  }
});

// ── CURSOR GLOW ──
const glow = document.createElement('div');
glow.style.cssText = `
  position:fixed; width:300px; height:300px; border-radius:50%;
  background:radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%);
  pointer-events:none; z-index:9998; transform:translate(-50%,-50%);
  transition: opacity 0.3s ease;
`;
document.body.appendChild(glow);
document.addEventListener('mousemove', e => {
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

// ── STAT COUNTER ANIMATION ──
function animateCounter(el, target, suffix = '') {
  let current = 0;
  const increment = target / 50;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + suffix;
  }, 30);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = entry.target.querySelectorAll('[data-count]');
      counters.forEach(counter => {
        const target = parseInt(counter.dataset.count, 10);
        const suffix = counter.dataset.suffix || '';
        animateCounter(counter, target, suffix);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stat-cards');
if (heroStats) statsObserver.observe(heroStats);