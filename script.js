// ===== WEDDING INVITATION - SCRIPT.JS =====
// Sharfiya Sharin & Muhammad Shanaf | Nikkah: 3rd October 2026, 11:00 AM IST

(function () {
  'use strict';

  // ===== CONFIG =====
  const WEDDING_DATE = new Date('2026-10-03T11:00:00+05:30');
  const PARTICLE_COUNT = 30;
  const isTouchDevice = () => 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  // ===== DOM REFERENCES =====
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ===== LOADING SCREEN =====
  function hideLoadingScreen() {
    const loader = $('#loadingScreen');
    const openBtn = $('#openInvitationBtn');
    if (loader && openBtn) {
      setTimeout(() => {
        const loadingText = $('.loading-text');
        if (loadingText) loadingText.textContent = "Your invitation is ready";
        openBtn.classList.remove('hidden');
        setTimeout(() => {
          openBtn.style.opacity = '1';
        }, 50);

        openBtn.addEventListener('click', () => {
          loader.classList.add('hidden');
          setTimeout(() => loader.remove(), 800);
        });
      }, 1200);
    } else if (loader) {
      setTimeout(() => {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 800);
      }, 1800);
    }
  }

  // ===== COUNTDOWN TIMER =====
  function updateCountdown() {
    const now = new Date();
    const diff = WEDDING_DATE - now;

    if (diff <= 0) {
      $('#days').textContent = '00';
      $('#hours').textContent = '00';
      $('#minutes').textContent = '00';
      $('#seconds').textContent = '00';
      const msg = $('#countdownMessage');
      if (msg) {
        msg.textContent = 'The blessed day has arrived! Alhamdulillah 🤲';
        msg.style.fontSize = '22px';
        msg.style.color = 'var(--gold)';
      }
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    animateNumber('days', days);
    animateNumber('hours', hours);
    animateNumber('minutes', minutes);
    animateNumber('seconds', seconds);
  }

  function animateNumber(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    const formatted = String(value).padStart(2, '0');
    if (el.textContent !== formatted) {
      el.style.transform = 'scale(1.1)';
      el.textContent = formatted;
      setTimeout(() => {
        el.style.transform = 'scale(1)';
      }, 200);
    }
  }

  // ===== SCROLL REVEAL ANIMATIONS =====
  function initScrollReveal() {
    const revealElements = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          // Don't unobserve to allow re-triggering if desired
        }
      });
    }, observerOptions);

    revealElements.forEach((el) => observer.observe(el));
  }

  // ===== FLOATING PARTICLES (WITH MOUSE PARALLAX) =====
  function createParticles() {
    const container = $('#particles');
    if (!container) return;

    const actualCount = window.innerWidth <= 768 ? 12 : PARTICLE_COUNT;

    for (let i = 0; i < actualCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 4 + 2;
      const left = Math.random() * 100;
      const delay = Math.random() * 15;
      const duration = Math.random() * 10 + 12;
      const opacity = Math.random() * 0.4 + 0.1;

      particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        opacity: ${opacity};
        box-shadow: 0 0 ${size * 2}px rgba(201, 165, 78, 0.4);
      `;

      container.appendChild(particle);
    }

    // Interactive Particles Parallax
    if (!isTouchDevice()) {
      document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * -40;
        const y = (e.clientY / window.innerHeight - 0.5) * -40;
        container.style.transform = `translate(${x}px, ${y}px)`;
      });
    }
  }

  // ===== PARALLAX ON SCROLL =====
  function initParallax() {
    const heroContent = $('.hero-content');
    const heroBgWrapper = $('.hero-bg');
    
    if (!heroContent && !heroBgWrapper) return;

    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            if (scrollY < windowHeight) {
              const parallaxAmount = scrollY * 0.4;
              const opacity = 1 - scrollY / windowHeight;

              if (heroContent) {
                heroContent.style.top = `${parallaxAmount}px`;
                heroContent.style.opacity = Math.max(opacity, 0);
              }

              if (heroBgWrapper) {
                heroBgWrapper.style.transform = `translateY(${scrollY * 0.2}px)`;
              }
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ===== AUDIO CONTROL =====
  function initAudio() {
    const audioBtn = $('#audioBtn');
    const audio = $('#bgAudio');

    if (!audioBtn || !audio) return;

    const iconPlay = audioBtn.querySelector('.play-svg');
    const iconPause = audioBtn.querySelector('.pause-svg');
    let isPlaying = false;

    // Set volume to 100% so it is clearly audible
    audio.volume = 1.0;

    const toggleAudio = () => {
      if (isPlaying) {
        audio.pause();
        audioBtn.classList.remove('playing');
        iconPlay.classList.remove('hidden');
        iconPause.classList.add('hidden');
        isPlaying = false;
      } else {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            audioBtn.classList.add('playing');
            iconPlay.classList.add('hidden');
            iconPause.classList.remove('hidden');
            isPlaying = true;
          }).catch(err => {
            console.log('Audio autoplay blocked by mobile browser:', err);
            // Reset state if blocked
            isPlaying = false;
            audioBtn.classList.remove('playing');
            iconPlay.classList.remove('hidden');
            iconPause.classList.add('hidden');
          });
        }
      }
    };

    audioBtn.addEventListener('click', toggleAudio);

    // Attempt to play immediately on load
    toggleAudio();

    // Auto-play on first valid user gesture (click/touch only)
    const onFirstInteraction = () => {
      if (!isPlaying) toggleAudio();
      document.removeEventListener('click', onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
    };

    document.addEventListener('click', onFirstInteraction, { once: true });
    document.addEventListener('touchstart', onFirstInteraction, { once: true });
  }

  // ===== SMOOTH SECTION TRANSITIONS =====
  function initSmoothSections() {
    const sections = $$('section');
    sections.forEach((section) => {
      section.style.transition = 'opacity 0.3s ease';
    });
  }

  // ===== HERO MOUSE PARALLAX & TEXT ANIMATIONS =====
  function initHeroAnimations() {
    const heroSection = $('.hero-section');
    const heroBgImg = $('.hero-bg img');
    const heroContent = $('.hero-content');
    if (!heroSection) return;

    const scrollIndicator = $('.scroll-indicator');
    if (scrollIndicator) {
      scrollIndicator.classList.add('animate-bounce');
    }

    if (isTouchDevice()) return;

    // Mouse parallax effect for hero
    heroSection.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      
      if (heroBgImg) heroBgImg.style.transform = `translate(${x}px, ${y}px) scale(1.1)`;
      if (heroContent) heroContent.style.transform = `translate(${x * -0.5}px, ${y * -0.5}px)`;
    });

    heroSection.addEventListener('mouseleave', () => {
      if (heroBgImg) heroBgImg.style.transform = `translate(0, 0) scale(1.1)`;
      if (heroContent) heroContent.style.transform = `translate(0, 0)`;
    });
  }

  // ===== COUNTER ANIMATION (for numbers) =====
  function animateCounterOnScroll() {
    const countdownSection = $('#countdown');
    if (!countdownSection) return;

    let hasAnimated = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            // The countdown is always updating, so just ensure a visual pop
            const numbers = countdownSection.querySelectorAll('.countdown-number');
            numbers.forEach((num, i) => {
              setTimeout(() => {
                num.style.transition = 'transform 0.5s ease, color 0.5s ease';
                num.style.transform = 'scale(1.2)';
                setTimeout(() => {
                  num.style.transform = 'scale(1)';
                }, 300);
              }, i * 150);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(countdownSection);
  }

  // ===== 3D TILT & SPARKLE ON CARDS =====
  function initSparkleEffects() {
    if (isTouchDevice()) return; // Skip 3D tilt on touch devices for better performance
    const cards = $$('.couple-card, .event-card, .quran-card, .venue-card');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Sparkle / Glow
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        card.style.background = `
          radial-gradient(
            300px circle at ${x}px ${y}px,
            rgba(201, 168, 76, 0.08),
            transparent 60%
          ),
          var(--ivory)
        `;

        // 3D Tilt Logic
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((y - centerY) / centerY) * -5; // max 5 deg tilt
        const tiltY = ((x - centerX) / centerX) * 5;  // max 5 deg tilt

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        card.style.boxShadow = `
          ${-tiltY * 2}px ${tiltX * 2 + 10}px 30px rgba(0, 0, 0, 0.15),
          0 0 15px rgba(201, 168, 76, 0.1)
        `;
      });

      card.addEventListener('mouseleave', () => {
        card.style.background = '';
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        card.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
        card.style.boxShadow = '';
      });
    });
  }

  // ===== MAGNETIC BUTTONS =====
  function initMagneticButtons() {
    if (isTouchDevice()) return; // Magnetic effect is annoying on mobile
    const buttons = $$('#directionsBtn, #audioBtn');

    buttons.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        // Gentle pull towards cursor
        btn.style.transform = `translate(${deltaX * 0.3}px, ${deltaY * 0.3}px)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px)';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      });
      
      btn.addEventListener('mouseenter', () => {
        btn.style.transition = 'transform 0.1s ease';
      });
    });
  }

  // ===== NAVBAR HIDE ON SCROLL (subtle effect for hero) =====
  function initScrollEffects() {
    const heroSection = $('.hero-section');
    if (!heroSection) return;

    let ticking = false;

    window.addEventListener(
      'scroll',
      () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            if (window.scrollY > 100) {
              heroSection.classList.add('scrolled');
            } else {
              heroSection.classList.remove('scrolled');
            }
            ticking = false;
          });
          ticking = true;
        }
      },
      { passive: true }
    );
  }

  // ===== INITIALIZE EVERYTHING =====
  function init() {
    hideLoadingScreen();
    createParticles();
    initScrollReveal();
    initParallax();
    initAudio();
    initSmoothSections();
    initHeroAnimations();
    animateCounterOnScroll();
    initSparkleEffects();
    initScrollEffects();
    initMagneticButtons();

    // Start countdown
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
