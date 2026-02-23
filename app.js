/* =============================================
   app.js — Birthday Wish Interactive Engine
   ============================================= */

// ─── DOM REFS ────────────────────────────────
const landing = document.getElementById('landing');
const mainSite = document.getElementById('mainSite');
const enterBtn = document.getElementById('enterBtn');
const bgAudio = document.getElementById('bgAudio');
const audioBtn = document.getElementById('audioBtn');
const audioIcon = document.getElementById('audioIcon');
const blowBtn = document.getElementById('blowBtn');
const wishText = document.getElementById('wishText');
const replayBtn = document.getElementById('replayBtn');
const balloonCont = document.getElementById('balloonContainer');
const starCont = document.getElementById('starContainer');

// ─── LANDING CANVAS SPARKLES ─────────────────
const lCanvas = document.getElementById('landingCanvas');
const lCtx = lCanvas.getContext('2d');

function resizeLanding() {
  lCanvas.width = window.innerWidth;
  lCanvas.height = window.innerHeight;
}
resizeLanding();
window.addEventListener('resize', resizeLanding);

const landingParticles = [];
const LANDING_COLORS = ['#ffd700', '#ff6eb4', '#a855f7', '#00e5ff', '#fb7185', '#ff2d78'];

for (let i = 0; i < 120; i++) {
  landingParticles.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 3 + 1,
    color: LANDING_COLORS[Math.floor(Math.random() * LANDING_COLORS.length)],
    vx: (Math.random() - 0.5) * 0.6,
    vy: (Math.random() - 0.5) * 0.6,
    alpha: Math.random(),
    alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.01,
  });
}

function animateLanding() {
  lCtx.clearRect(0, 0, lCanvas.width, lCanvas.height);
  landingParticles.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    p.alpha += p.alphaDir;
    if (p.alpha <= 0.1 || p.alpha >= 1) p.alphaDir *= -1;
    if (p.x < 0) p.x = lCanvas.width;
    if (p.x > lCanvas.width) p.x = 0;
    if (p.y < 0) p.y = lCanvas.height;
    if (p.y > lCanvas.height) p.y = 0;

    lCtx.beginPath();
    lCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    lCtx.fillStyle = p.color;
    lCtx.globalAlpha = p.alpha;
    lCtx.fill();
    lCtx.globalAlpha = 1;
  });
  requestAnimationFrame(animateLanding);
}
animateLanding();


// ─── ENTER BUTTON ────────────────────────────
enterBtn.addEventListener('click', () => {
  landing.classList.add('fade-out');
  bgAudio.volume = 0.45;
  bgAudio.play().catch(() => { });
  audioIcon.textContent = '🔊';
  setTimeout(() => {
    landing.classList.add('hidden');
    mainSite.classList.remove('hidden');
    initMainSite();
  }, 800);
});


// ─── AUDIO TOGGLE ────────────────────────────
audioBtn.addEventListener('click', () => {
  if (bgAudio.paused) {
    bgAudio.play();
    audioIcon.textContent = '🔊';
  } else {
    bgAudio.pause();
    audioIcon.textContent = '🔇';
  }
});


// ─── MAIN SITE INIT ──────────────────────────
function initMainSite() {
  createStars();
  createBalloons();
  initParticleCanvas();
  initScrollReveal();
  initFireworks();
  initParallax(); // ← professional parallax system
}


// ─── STARS ───────────────────────────────────
function createStars() {
  starCont.innerHTML = '';
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = Math.random() * 3 + 1;
    star.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation-duration: ${Math.random() * 4 + 2}s;
      animation-delay: ${Math.random() * 5}s;
    `;
    starCont.appendChild(star);
  }
}


// ─── BALLOONS ────────────────────────────────
const BALLOON_COLORS = [
  'linear-gradient(135deg, #ff6eb4, #ff2d78)',
  'linear-gradient(135deg, #a855f7, #7c3aed)',
  'linear-gradient(135deg, #ffd700, #ff8c00)',
  'linear-gradient(135deg, #00e5ff, #0ea5e9)',
  'linear-gradient(135deg, #fb7185, #e11d48)',
  'linear-gradient(135deg, #34d399, #059669)',
  'linear-gradient(135deg, #f472b6, #ec4899)',
  'linear-gradient(135deg, #818cf8, #6366f1)',
];

function createBalloons() {
  balloonCont.innerHTML = '';
  for (let i = 0; i < 14; i++) {
    spawnBalloon();
  }
  setInterval(spawnBalloon, 2500);
}

function spawnBalloon() {
  const b = document.createElement('div');
  b.classList.add('balloon');
  const left = Math.random() * 100;
  const drift = (Math.random() - 0.5) * 150;
  const dur = Math.random() * 10 + 12;
  const delay = Math.random() * 5;
  const color = BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)];
  b.style.cssText = `
    left: ${left}%;
    background: ${color};
    --drift: ${drift}px;
    width: ${Math.random() * 30 + 50}px;
    height: ${Math.random() * 35 + 55}px;
    animation-duration: ${dur}s;
    animation-delay: ${delay}s;
    opacity: 0;
    box-shadow: inset -4px -6px 10px rgba(0,0,0,0.2), 0 0 15px rgba(255,255,255,0.1);
  `;
  balloonCont.appendChild(b);
  setTimeout(() => b.remove(), (dur + delay) * 1000 + 1000);
}


// ─── PARTICLE CANVAS ─────────────────────────
const pCanvas = document.getElementById('particleCanvas');
const pCtx = pCanvas.getContext('2d');

function resizeParticle() {
  pCanvas.width = window.innerWidth;
  pCanvas.height = window.innerHeight;
}

const hearts = ['💖', '💕', '💗', '💓', '🌸', '✨', '⭐', '🌟'];
let floaters = [];

function initParticleCanvas() {
  resizeParticle();
  window.addEventListener('resize', resizeParticle);
  for (let i = 0; i < 25; i++) createFloater(true);
  animateParticles();
}

function createFloater(immediate) {
  floaters.push({
    x: Math.random() * window.innerWidth,
    y: immediate ? Math.random() * window.innerHeight : window.innerHeight + 50,
    char: hearts[Math.floor(Math.random() * hearts.length)],
    size: Math.random() * 18 + 10,
    speed: Math.random() * 1.2 + 0.4,
    drift: (Math.random() - 0.5) * 1.5,
    alpha: Math.random() * 0.5 + 0.3,
    alphaDir: (Math.random() > 0.5 ? 1 : -1) * 0.005,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 2,
  });
}

function animateParticles() {
  pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
  floaters = floaters.filter(f => f.y > -80);

  floaters.forEach(f => {
    f.y -= f.speed;
    f.x += f.drift;
    f.alpha += f.alphaDir;
    if (f.alpha < 0.2 || f.alpha > 0.8) f.alphaDir *= -1;
    f.rotation += f.rotSpeed;

    pCtx.save();
    pCtx.globalAlpha = f.alpha;
    pCtx.font = `${f.size}px serif`;
    pCtx.translate(f.x + f.size / 2, f.y + f.size / 2);
    pCtx.rotate((f.rotation * Math.PI) / 180);
    pCtx.fillText(f.char, -f.size / 2, f.size / 2);
    pCtx.restore();
  });

  if (floaters.length < 30) createFloater(false);
  requestAnimationFrame(animateParticles);
}


// ─── SCROLL REVEAL ───────────────────────────
function initScrollReveal() {
  const items = document.querySelectorAll('.reveal-item');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('revealed'), parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  items.forEach(item => observer.observe(item));
}


// ─── CAKE / BLOW CANDLES ─────────────────────
let candlesBlown = false;

blowBtn.addEventListener('click', () => {
  if (candlesBlown) return;
  candlesBlown = true;

  blowBtn.style.transform = 'scale(0.95)';
  blowBtn.style.opacity = '0.6';
  blowBtn.disabled = true;

  const flames = document.querySelectorAll('.flame');
  flames.forEach((flame, i) => {
    setTimeout(() => {
      flame.style.opacity = '0';
      flame.style.transform = 'scale(0)';
      flame.style.transition = 'all 0.4s ease';
    }, i * 200);
  });

  setTimeout(() => {
    blowBtn.classList.add('hidden');
    wishText.classList.remove('hidden');
    launchConfettiExplosion();
  }, flames.length * 200 + 300);
});


// ─── CONFETTI EXPLOSION ──────────────────────
function launchConfettiExplosion() {
  const colors = ['#ffd700', '#ff6eb4', '#a855f7', '#00e5ff', '#fb7185', '#ff2d78', '#34d399', '#fbbf24'];
  for (let i = 0; i < 120; i++) {
    setTimeout(() => createConfettiPiece(colors), Math.random() * 1000);
  }
}

function createConfettiPiece(colors) {
  const piece = document.createElement('div');
  const size = Math.random() * 12 + 6;
  const color = colors[Math.floor(Math.random() * colors.length)];
  const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 200;
  const velX = (Math.random() - 0.5) * 600;
  const velY = -(Math.random() * 500 + 200);
  const rot = Math.random() * 720;
  const shape = Math.random() > 0.5 ? '50%' : '0';

  piece.style.cssText = `
    position: fixed;
    width: ${size}px;
    height: ${size * (Math.random() * 1.5 + 0.5)}px;
    background: ${color};
    left: ${startX}px;
    top: 40%;
    border-radius: ${shape};
    z-index: 9999;
    pointer-events: none;
    transform-origin: center;
  `;
  document.body.appendChild(piece);

  const duration = Math.random() * 1200 + 1000;
  const gravity = 1200;

  piece.animate([
    { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
    { transform: `translate(${velX * 0.6}px, ${velY}px) rotate(${rot / 2}deg)`, opacity: 1, offset: 0.4 },
    { transform: `translate(${velX}px, ${gravity}px) rotate(${rot}deg)`, opacity: 0.2 },
  ], {
    duration,
    easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    fill: 'forwards',
  }).onfinish = () => piece.remove();
}


// ─── FIREWORKS ───────────────────────────────
const fCanvas = document.getElementById('fireworksCanvas');
const fCtx = fCanvas.getContext('2d');
let fireworksRunning = false;
let fireworksTimer;

function resizeFireworks() {
  fCanvas.width = fCanvas.offsetWidth;
  fCanvas.height = fCanvas.offsetHeight;
}

const fireworks = [];
const sparkles = [];

class Firework {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * fCanvas.width;
    this.y = fCanvas.height;
    this.tx = Math.random() * fCanvas.width * 0.6 + fCanvas.width * 0.2;
    this.ty = Math.random() * fCanvas.height * 0.5 + 50;
    this.speed = Math.random() * 3 + 4;
    this.angle = Math.atan2(this.ty - this.y, this.tx - this.x);
    this.vx = Math.cos(this.angle) * this.speed;
    this.vy = Math.sin(this.angle) * this.speed;
    this.color = `hsl(${Math.random() * 360}, 100%, 65%)`;
    this.trail = [];
    this.exploded = false;
  }
  update() {
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 12) this.trail.shift();
    this.x += this.vx;
    this.y += this.vy;
    const dist = Math.hypot(this.tx - this.x, this.ty - this.y);
    if (dist < 10) this.explode();
  }
  draw() {
    fCtx.beginPath();
    this.trail.forEach((pt, i) => {
      fCtx.globalAlpha = i / this.trail.length * 0.8;
      fCtx.fillStyle = this.color;
      const r = (i / this.trail.length) * 3;
      fCtx.beginPath();
      fCtx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
      fCtx.fill();
    });
    fCtx.globalAlpha = 1;
  }
  explode() {
    this.exploded = true;
    const NUM = Math.floor(Math.random() * 30 + 60);
    for (let i = 0; i < NUM; i++) {
      sparkles.push(new Sparkle(this.x, this.y, this.color));
    }
  }
}

class Sparkle {
  constructor(x, y, color) {
    this.x = x; this.y = y;
    this.color = color;
    const angle = (Math.random() * Math.PI * 2);
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = 1;
    this.gravity = 0.12;
    this.r = Math.random() * 3 + 1;
    this.decay = Math.random() * 0.015 + 0.012;
  }
  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= this.decay;
    this.vx *= 0.98;
  }
  draw() {
    fCtx.beginPath();
    fCtx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    fCtx.fillStyle = this.color;
    fCtx.globalAlpha = Math.max(0, this.alpha);
    fCtx.fill();
    fCtx.globalAlpha = 1;
  }
}

let fAnimId;
function fireworksLoop() {
  fCtx.fillStyle = 'rgba(13, 2, 25, 0.25)';
  fCtx.fillRect(0, 0, fCanvas.width, fCanvas.height);

  fireworks.forEach((fw, i) => {
    if (!fw.exploded) { fw.update(); fw.draw(); }
    else fireworks.splice(i, 1);
  });

  for (let i = sparkles.length - 1; i >= 0; i--) {
    if (sparkles[i].alpha <= 0) { sparkles.splice(i, 1); continue; }
    sparkles[i].update();
    sparkles[i].draw();
  }

  fAnimId = requestAnimationFrame(fireworksLoop);
}

function initFireworks() {
  resizeFireworks();
  window.addEventListener('resize', resizeFireworks);

  const finaleSection = document.querySelector('.finale-section');
  const fwObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !fireworksRunning) {
        fireworksRunning = true;
        fireworksLoop();
        fireworksTimer = setInterval(() => {
          for (let i = 0; i < 3; i++) {
            setTimeout(() => fireworks.push(new Firework()), i * 200);
          }
        }, 900);
      } else if (!entry.isIntersecting && fireworksRunning) {
        fireworksRunning = false;
        clearInterval(fireworksTimer);
        cancelAnimationFrame(fAnimId);
        fCtx.clearRect(0, 0, fCanvas.width, fCanvas.height);
      }
    });
  }, { threshold: 0.3 });

  fwObserver.observe(finaleSection);
}


// ─── REPLAY BUTTON ───────────────────────────
replayBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Reset candles
  candlesBlown = false;
  document.querySelectorAll('.flame').forEach(f => {
    f.style.opacity = '1';
    f.style.transform = '';
    f.style.transition = '';
  });
  blowBtn.disabled = false;
  blowBtn.classList.remove('hidden');
  blowBtn.style.transform = '';
  blowBtn.style.opacity = '1';
  wishText.classList.add('hidden');

  // Re-trigger reveal items
  document.querySelectorAll('.reveal-item').forEach(el => {
    el.classList.remove('revealed');
  });
  setTimeout(initScrollReveal, 500);
});


// ─── CLICK SPARKLE EFFECT ────────────────────
document.addEventListener('click', (e) => {
  if (!mainSite.classList.contains('hidden')) {
    const emojis = ['💖', '✨', '🌸', '⭐', '💕', '🌟', '💎', '🦋'];
    for (let i = 0; i < 6; i++) {
      const el = document.createElement('div');
      el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      el.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        font-size: ${Math.random() * 18 + 12}px;
        pointer-events: none;
        z-index: 9999;
        transform: translate(-50%, -50%);
      `;
      document.body.appendChild(el);
      const angle = (Math.random() * 360 * Math.PI) / 180;
      const dist = Math.random() * 80 + 40;
      el.animate([
        { transform: 'translate(-50%,-50%) scale(0)', opacity: 1 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px)) scale(1.3)`, opacity: 1, offset: 0.5 },
        { transform: `translate(calc(-50% + ${Math.cos(angle) * dist * 1.5}px), calc(-50% + ${Math.sin(angle) * dist * 1.5}px)) scale(0)`, opacity: 0 },
      ], { duration: 800, easing: 'ease-out', fill: 'forwards' })
        .onfinish = () => el.remove();
    }
  }
});



// ════════════════════════════════════════════════════════════════
//  ✨ PARALLAX ENGINE v3 — Simple, Strong, Impossible to Miss ✨
//
//  Strategy:
//  • Orb wrappers: use top/left CSS (not transform) — zero animation conflict
//  • Hero content: translateY + opacity fade
//  • Section titles: obvious translateY (±40px range)
//  • Reason cards: staggered depth (each moves at slightly different speed)
//  • Wish items: staggered depth
//  • Cake + letter card: viewport-center-relative float
//  • Mouse: orbs tilt left/right (clearly visible horizontal drift)
//  • Scroll bar: rainbow progress across top
// ════════════════════════════════════════════════════════════════
function initParallax() {

  // ── Helpers ──────────────────────────────────────────────────
  const $ = sel => document.querySelector(sel);
  const $$ = sel => document.querySelectorAll(sel);
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const isMobile = () => window.innerWidth < 768;

  // ── Elements ─────────────────────────────────────────────────
  const scrollBar = $('#scrollBar');
  const pxOrb1 = $('.px-orb1');
  const pxOrb2 = $('.px-orb2');
  const pxOrb3 = $('.px-orb3');
  const pxRing = $('.px-ring');
  const heroEl = $('.px-hero-content');
  const starEl = $('.star-container');
  const photoBg = $('#photoBg');              // photo parallax background
  const sectionTitles = $$('.section-title');
  const reasonCards = $$('.reason-card');
  const wishItems = $$('.wish-item');
  const floatEls = $$('.parallax-float');  // cake-scene + letter-wrapper

  // Store base top values for orbs (set from CSS via getComputedStyle)
  // We'll adjust top directly — zero conflict with orbFloat CSS animation
  let orb1BaseTop, orb2BaseTop, orb3BaseTop;

  // ── Mouse tilt ───────────────────────────────────────────────
  let mouseX = 0, mouseY = 0;   // smoothed
  let rawMX = 0, rawMY = 0;
  document.addEventListener('mousemove', e => {
    rawMX = (e.clientX / window.innerWidth - 0.5) * 2;  // -1..1
    rawMY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ── Hero content: wait for entrance animation to finish ──────
  let heroReady = false;
  let heroScrollY = 0;
  setTimeout(() => { heroReady = true; }, 1500);

  // ── Collect orb base positions once ─────────────────────────
  function captureOrbBases() {
    if (pxOrb1) orb1BaseTop = pxOrb1.offsetTop;
    if (pxOrb2) orb2BaseTop = pxOrb2.offsetTop;
    if (pxOrb3) orb3BaseTop = pxOrb3.offsetTop;
  }
  captureOrbBases();

  // ── Main scroll + rAF loop ───────────────────────────────────
  function tick() {
    const sy = window.scrollY;
    const vh = window.innerHeight;

    // Progress bar
    if (scrollBar) {
      const max = document.documentElement.scrollHeight - vh;
      scrollBar.style.width = (max > 0 ? (sy / max) * 100 : 0) + '%';
    }

    // Smooth mouse
    mouseX += (rawMX - mouseX) * 0.06;
    mouseY += (rawMY - mouseY) * 0.06;

    const mob = isMobile();

    // ── 1. ORB WRAPPERS — top + left offset (no transform conflict!) ──
    if (!mob) {
      if (pxOrb1) {
        pxOrb1.style.transform = `translate3d(${mouseX * 30}px,  ${sy * 0.40}px, 0)`;
      }
      if (pxOrb2) {
        pxOrb2.style.transform = `translate3d(${mouseX * -40}px, ${-sy * 0.30}px, 0)`;
      }
      if (pxOrb3) {
        pxOrb3.style.transform = `translate3d(${mouseX * 20}px,  ${sy * 0.20}px, 0)`;
      }
      if (pxRing) {
        pxRing.style.transform = `translate3d(${mouseX * 8}px, ${-sy * 0.08}px, 0)`;
      }
    }

    // ── 2. STAR BACKGROUND — very slow drift (deep space feel) ──
    if (starEl) {
      starEl.style.transform = `translate3d(0, ${sy * 0.05}px, 0)`;
    }

    // ── 3. HERO CONTENT — lift & fade on scroll ──────────────────
    if (heroEl && heroReady) {
      const fade = clamp(1 - sy / (vh * 0.65), 0, 1);
      heroEl.style.transform = `translate3d(0, ${sy * 0.20}px, 0)`;
      heroEl.style.opacity = fade;
    }

    // ── 3b. PHOTO SECTION BG — classic parallax (bg moves slower than scroll) ──
    if (photoBg) {
      const pSection = photoBg.closest('section');
      if (pSection) {
        const pr = pSection.getBoundingClientRect();
        if (pr.bottom > 0 && pr.top < vh) {
          // How far into the section we are (0 = top, 1 = bottom)
          const progress = (vh - pr.top) / (vh + pr.height);
          // Shift bg by 35% of scroll — clearly visible parallax depth
          const offset = (progress - 0.5) * pr.height * 0.35;
          photoBg.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        }
      }
    }

    // ── 4. SECTION TITLES — clear visible offset (±40px range) ──
    sectionTitles.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      // Distance of element center from viewport center
      const fromCenter = (rect.top + rect.height / 2) - vh / 2;
      const speed = 0.18 + (i % 2) * 0.08;   // alternating speeds for variety
      el.style.transform = `translateY(${fromCenter * speed * -0.4}px)`;
    });

    // ── 5. REASON CARDS — staggered depth parallax ───────────────
    reasonCards.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const fromCenter = (rect.top + rect.height / 2) - vh / 2;
      // Each card gets a slightly different speed creating staggered depth
      const speed = [0.06, 0.10, 0.14, 0.08, 0.12, 0.07][i % 6];
      el.style.transform = `translateY(${fromCenter * speed * -0.5}px)`;
    });

    // ── 6. WISH ITEMS — alternating drift direction ──────────────
    wishItems.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const fromCenter = (rect.top + rect.height / 2) - vh / 2;
      const dir = i % 2 === 0 ? 1 : -1;  // alternating left/right lean
      el.style.transform = `translateY(${fromCenter * 0.08 * -0.5}px) translateX(${fromCenter * 0.03 * dir}px)`;
    });

    // ── 7. FLOAT ELEMENTS (cake + letter card) — depth bob ───────
    floatEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < -100 || rect.top > vh + 100) return;
      const fromCenter = (rect.top + rect.height / 2) - vh / 2;
      el.style.transform = `translateY(${fromCenter * 0.10 * -0.4}px)`;
    });

    requestAnimationFrame(tick);
  }

  tick();
}



