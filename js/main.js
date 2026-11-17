/* =========================================================================
   ReliefSync – main.js
   1. Mobile menu
   2. Promo video carousel
   3. Highlight the current section in the navigation
   ========================================================================= */


/* ---------- 1. MOBILE MENU ---------- */
const nav       = document.querySelector('.nav');
const navToggle = document.getElementById('navToggle');

navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', open);
});

// Close the menu after tapping a link
document.querySelectorAll('#navLinks a').forEach((link) => {
  link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});


/* ---------- 2. PROMO VIDEO CAROUSEL ---------- */
const videoFrame  = document.getElementById('videoFrame');
const promoVideo  = document.getElementById('promoVideo');
const promoVideoSource = document.getElementById('promoVideoSource');
const playBtn     = document.getElementById('playBtn');
const videoPoster = document.getElementById('videoPoster');
const videoTitle  = document.getElementById('videoTitle');
const videoStatus = document.getElementById('videoStatus');
const videoIndicators = [...document.querySelectorAll('.video-carousel__indicator')];
let activeVideoIndex = 0;

function showPlaceholder() {
  videoFrame.classList.remove('is-playing');
}

function showVideo(index) {
  activeVideoIndex = (index + videoIndicators.length) % videoIndicators.length;
  const indicator = videoIndicators[activeVideoIndex];
  promoVideo.pause();
  showPlaceholder();
  promoVideoSource.src = indicator.dataset.videoSrc;
  videoTitle.textContent = indicator.dataset.videoTitle;
  videoStatus.textContent = `Video ${activeVideoIndex + 1} of ${videoIndicators.length}`;
  videoIndicators.forEach((button, buttonIndex) => {
    if (buttonIndex === activeVideoIndex) button.setAttribute('aria-current', 'true');
    else button.removeAttribute('aria-current');
  });
  promoVideo.load();
}

playBtn.addEventListener('click', () => {
  videoFrame.classList.add('is-playing');
  const playing = promoVideo.play();
  if (playing && typeof playing.catch === 'function') {
    playing.catch(() => showPlaceholder());
  }
});

// Clicking anywhere on the poster also starts the video
videoPoster.addEventListener('click', (e) => {
  if (e.target !== playBtn && !playBtn.contains(e.target)) playBtn.click();
});

// A source switch can abort an in-flight request; only report actual load errors.
promoVideo.addEventListener('error', () => {
  if (promoVideo.error && promoVideo.error.code === 1) return;
  console.warn(`[ReliefSync] Unable to load video: ${promoVideoSource.src}`);
  showPlaceholder();
});

// Optional: when the video ends, show the poster again
promoVideo.addEventListener('ended', showPlaceholder);

videoIndicators.forEach((button, index) => {
  button.addEventListener('click', () => showVideo(index));
});

document.querySelectorAll('[data-video-step]').forEach((button) => {
  button.addEventListener('click', () => {
    showVideo(activeVideoIndex + Number(button.dataset.videoStep));
  });
});

// "Watch the video" button in the hero jumps to the section (handled by the #video link).


/* ---------- 3. PROTOTYPE MODAL ---------- */
const prototypeTrigger = document.querySelector('[data-open-prototype]');
const prototypeModal = document.getElementById('prototypeModal');
const prototypeCloseButtons = document.querySelectorAll('[data-close-prototype]');

function openPrototypeModal() {
  if (!prototypeModal) return;
  prototypeModal.classList.add('is-open');
  prototypeModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closePrototypeModal() {
  if (!prototypeModal) return;
  prototypeModal.classList.remove('is-open');
  prototypeModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

prototypeTrigger?.addEventListener('click', (event) => {
  event.preventDefault();
  openPrototypeModal();
});

prototypeCloseButtons.forEach((button) => {
  button.addEventListener('click', closePrototypeModal);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && prototypeModal?.classList.contains('is-open')) {
    closePrototypeModal();
  }
});

/* ---------- 4. SIGN-IN DIALOG ---------- */
const loginDialog = document.getElementById('loginDialog');
const loginTriggers = document.querySelectorAll('[data-open-login]');
const loginCloseButtons = document.querySelectorAll('[data-close-login]');
const loginForm = document.querySelector('.login-form');
const passwordInput = document.getElementById('loginPassword');
const passwordToggle = document.querySelector('[data-toggle-password]');

loginTriggers.forEach((trigger) => {
  trigger.addEventListener('click', (event) => {
    event.preventDefault();
    if (loginDialog && !loginDialog.open) loginDialog.showModal();
  });
});

loginCloseButtons.forEach((button) => {
  button.addEventListener('click', () => loginDialog?.close());
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && loginDialog?.open) loginDialog.close();
});

loginDialog?.addEventListener('click', (event) => {
  if (event.target === loginDialog) loginDialog.close();
});

loginForm?.addEventListener('submit', (event) => {
  event.preventDefault();
});

passwordToggle?.addEventListener('click', () => {
  if (!passwordInput) return;
  const isVisible = passwordInput.type === 'text';
  passwordInput.type = isVisible ? 'password' : 'text';
  passwordToggle.setAttribute('aria-pressed', String(!isVisible));
  passwordToggle.setAttribute('aria-label', isVisible ? 'Show password' : 'Hide password');
});

document.querySelectorAll('[data-demo-link]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});


/* ---------- 5. ACTIVE NAV LINK ---------- */
const sectionIds = ['home', 'prototype', 'how-it-works', 'pricing', 'about', 'contact'];
const navLinks   = [...document.querySelectorAll('#navLinks a[href^="#"]')];

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id));
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sectionIds.forEach((id) => {
  const el = document.getElementById(id);
  if (el) observer.observe(el);
});
