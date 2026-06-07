const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loader-bar');
const loaderPct = document.getElementById('loader-pct');
const pageMask = document.getElementById('page-mask');
const themeToggle = document.getElementById('theme-toggle');
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobile-nav');
const navLinks = document.querySelectorAll('.nav-link');
const mobileLinks = document.querySelectorAll('.mob-link');
const sections = document.querySelectorAll('section');
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const scrollProgress = document.getElementById('scroll-progress');
const footerYear = document.getElementById('footer-year');
const contactForm = document.getElementById('contact-form');
const formFeedback = contactForm.querySelector('.form-feedback');
let progress = 0;
const loadInterval = setInterval(() => {
  progress += 2;
  loaderBar.style.width = `${progress}%`;
  loaderPct.textContent = `${progress}%`;
  if (progress >= 100) {
    clearInterval(loadInterval);
    gsap.to(loader, {
      opacity: 0,
      duration: 0.8,
      onComplete: () => loader.style.display = 'none'
    });
    gsap.to(pageMask, {opacity: 0, duration: 0.8});
  }
}, 25);
footerYear.textContent = new Date().getFullYear();
const themeSaved = localStorage.getItem('portfolio-theme');
if (themeSaved) {
  document.body.setAttribute('data-theme', themeSaved);
  themeToggle.textContent = themeSaved === 'light' ? '☀️' : '🌙';
}
themeToggle.addEventListener('click', () => {
  const current = document.body.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  document.body.setAttribute('data-theme', next);
  themeToggle.textContent = next === 'light' ? '☀️' : '🌙';
  localStorage.setItem('portfolio-theme', next);
});
hamburger.addEventListener('click', () => {
  mobileNav.classList.toggle('open');
  mobileNav.setAttribute('aria-hidden', mobileNav.classList.contains('open') ? 'false' : 'true');
});
mobileLinks.forEach(link => link.addEventListener('click', () => mobileNav.classList.remove('open')));
window.addEventListener('mousemove', e => {
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
  cursorRing.animate({left: `${e.clientX}px`, top: `${e.clientY}px`}, {duration: 200, fill: 'forwards'});
});
const hoverTargets = document.querySelectorAll('a, button, .btn');
hoverTargets.forEach(target => {
  target.addEventListener('mouseenter', () => cursorRing.classList.add('hover'));
  target.addEventListener('mouseleave', () => cursorRing.classList.remove('hover'));
});
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const current = (scrollTop / docHeight) * 100;
  scrollProgress.style.width = `${current}%`;
  document.querySelectorAll('section').forEach(section => {
    const sectionTop = section.offsetTop - 200;
    if (scrollTop >= sectionTop) {
      const id = section.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
  if (scrollTop > 40) document.querySelector('.topbar').classList.add('scrolled');
  else document.querySelector('.topbar').classList.remove('scrolled');
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => null);
}
gsap.registerPlugin(ScrollTrigger);
gsap.utils.toArray('.reveal').forEach(element => {
  gsap.fromTo(element, {opacity: 0, y: 32}, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {trigger: element, start: 'top 92%'}
  });
});
gsap.from('.hero-copy h1', {opacity: 0, y: 40, duration: 1.2, ease: 'power3.out', delay: 0.2});
gsap.from('.hero-copy .hero-text', {opacity: 0, y: 42, duration: 1.2, ease: 'power3.out', delay: 0.35});
gsap.from('.hero-actions', {opacity: 0, y: 42, duration: 1.2, ease: 'power3.out', delay: 0.5});
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = contactForm.name.value.trim();
  const email = contactForm.email.value.trim();
  const message = contactForm.message.value.trim();
  if (!name || !email || !message) {
    formFeedback.textContent = 'Please complete all fields before sending.';
    return;
  }
  if (!email.includes('@')) {
    formFeedback.textContent = 'Please provide a valid email address.';
    return;
  }
  formFeedback.textContent = 'Sending your message...';
  fetch(contactForm.action, {
    method: 'POST', headers: {'Accept': 'application/json'}, body: new FormData(contactForm)
  }).then(response => {
    if (response.ok) {
      formFeedback.textContent = 'Message sent successfully. I will get back to you soon.';
      contactForm.reset();
    } else {
      formFeedback.textContent = 'There was an issue sending your message. Please try again later.';
    }
  }).catch(() => {
    formFeedback.textContent = 'Connection issue. Please check your network and try again.';
  });
});
