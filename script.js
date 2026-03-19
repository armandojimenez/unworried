/* ═══════════════════════════════════════════
   UNWORRIED LANDING — JAVASCRIPT
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── Language Switching ─────────────────────
  const SUPPORTED_LANGS = ['en', 'es'];
  const DEFAULT_LANG = 'en';

  function getLang() {
    // Check URL parameter first
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    if (urlLang && SUPPORTED_LANGS.includes(urlLang)) return urlLang;

    // Check localStorage
    const savedLang = localStorage.getItem('unworried-lang');
    if (savedLang && SUPPORTED_LANGS.includes(savedLang)) return savedLang;

    // Check browser language
    const browserLang = navigator.language.slice(0, 2);
    if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

    return DEFAULT_LANG;
  }

  function setLang(lang) {
    if (!SUPPORTED_LANGS.includes(lang)) return;

    document.documentElement.lang = lang;
    localStorage.setItem('unworried-lang', lang);

    // Update URL without reload
    const url = new URL(window.location);
    url.searchParams.set('lang', lang);
    window.history.replaceState({}, '', url);

    // Update toggle buttons
    document.querySelectorAll('.lang-toggle__btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update footer lang links
    document.querySelectorAll('.footer__lang-link').forEach(link => {
      link.classList.toggle('active', link.dataset.lang === lang);
    });
  }

  // ─── Navigation Scroll Effect ───────────────
  function initNav() {
    const nav = document.querySelector('.nav');
    if (!nav) return;

    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  // ─── Scroll Reveal Animations ───────────────
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-stagger');
    if (!reveals.length) return;

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px'
    });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ─── Interactive Demo ───────────────────────
  function initDemo() {
    const demoInput = document.querySelector('.demo-card__input');
    const demoBtn = document.querySelector('.demo-card__btn');
    const demoResult = document.querySelector('.demo-card__result');
    var readyLabel = document.querySelector('.demo-btn-label--ready');
    var againLabel = document.querySelector('.demo-btn-label--again');
    if (!demoInput || !demoBtn || !demoResult) return;

    var worries = {
      en: [
        {
          worry: "I dropped my phone and the screen cracked.",
          perspective: "That sinking feeling when you hear the crack \u2014 nobody likes that. But your phone still works, screens are fixable, and in the story of your week, this is a minor character. Maybe it\u2019s finally time for that case you keep meaning to get."
        },
        {
          worry: "My boss criticized my work in front of the whole team.",
          perspective: "Ouch \u2014 public criticism stings differently. But here\u2019s the thing: your work is visible enough to have thoughts about. That means you\u2019re not invisible. The sting fades, but the fact that you\u2019re doing work worth discussing? That stays."
        },
        {
          worry: "I\u2019m stuck in traffic and going to be late for dinner.",
          perspective: "Traffic doesn\u2019t care about your schedule, and fighting that reality only adds frustration to delay. You\u2019ll arrive when you arrive. The people waiting for you will understand \u2014 they\u2019ve been stuck in traffic too."
        }
      ],
      es: [
        {
          worry: "Se me cay\u00f3 el celular y se rompi\u00f3 la pantalla.",
          perspective: "Esa sensaci\u00f3n cuando escuchas el crack \u2014 a nadie le gusta. Pero tu celular sigue funcionando, las pantallas se arreglan, y en la historia de tu semana, esto es un personaje menor. Quiz\u00e1s es hora de comprar esa funda que siempre dices que vas a comprar."
        },
        {
          worry: "Mi jefe critic\u00f3 mi trabajo frente a todo el equipo.",
          perspective: "Ay \u2014 la cr\u00edtica p\u00fablica duele diferente. Pero piensa en esto: tu trabajo es lo suficientemente visible como para que opinen sobre \u00e9l. Eso significa que no eres invisible. El dolor pasa, pero el hecho de que haces trabajo que vale la pena discutir? Eso se queda."
        },
        {
          worry: "Estoy atrapado en el tr\u00e1fico y voy a llegar tarde a la cena.",
          perspective: "El tr\u00e1fico no le importa tu horario, y pelear contra esa realidad solo suma frustraci\u00f3n al retraso. Llegar\u00e1s cuando llegues. La gente que te espera va a entender \u2014 ellos tambi\u00e9n han estado atrapados en el tr\u00e1fico."
        }
      ]
    };

    var currentIndex = 0;
    var isAnimating = false;
    var firstClick = true;

    function setBtnState(state) {
      demoBtn.dataset.state = state;
      if (readyLabel && againLabel) {
        readyLabel.style.display = state === 'ready' ? '' : 'none';
        againLabel.style.display = state === 'again' ? '' : 'none';
      }
    }

    function showPerspective(perspective) {
      var resultText = demoResult.querySelector('.demo-card__result-text');
      if (resultText) {
        resultText.textContent = '\u201c' + perspective + '\u201d';
      }
      demoResult.classList.add('visible');
      setBtnState('again');
      demoBtn.style.opacity = '1';
      demoBtn.style.pointerEvents = '';
      isAnimating = false;
    }

    function runDemo() {
      if (isAnimating) return;
      isAnimating = true;

      var lang = document.documentElement.lang || 'en';
      var langWorries = worries[lang] || worries.en;

      // First click: input is already pre-filled, just show the perspective
      if (firstClick) {
        firstClick = false;
        var item = langWorries[0];
        currentIndex = 1;
        demoBtn.style.opacity = '0.5';
        demoBtn.style.pointerEvents = 'none';
        setTimeout(function () { showPerspective(item.perspective); }, 400);
        return;
      }

      // Subsequent clicks: type new worry, then show perspective
      var item = langWorries[currentIndex % langWorries.length];
      currentIndex++;

      // Reset previous result
      demoResult.classList.remove('visible');
      demoInput.textContent = '';
      demoInput.classList.add('typing');
      demoBtn.style.opacity = '0.5';
      demoBtn.style.pointerEvents = 'none';

      var charIndex = 0;
      var typeSpeed = 30;
      function typeChar() {
        if (charIndex < item.worry.length) {
          demoInput.textContent += item.worry[charIndex];
          charIndex++;
          setTimeout(typeChar, typeSpeed);
        } else {
          demoInput.classList.remove('typing');
          setTimeout(function () { showPerspective(item.perspective); }, 600);
        }
      }

      setTimeout(typeChar, 300);
    }

    demoBtn.addEventListener('click', runDemo);
  }

  // ─── Smooth Scroll for Anchor Links ─────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ─── Initialize ─────────────────────────────
  function init() {
    // Set initial language
    setLang(getLang());

    // Language toggle buttons
    document.querySelectorAll('.lang-toggle__btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setLang(this.dataset.lang);
      });
    });

    // Footer language links
    document.querySelectorAll('.footer__lang-link').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        setLang(this.dataset.lang);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });

    // Nav CTA scroll
    const navCta = document.querySelector('.nav__cta');
    if (navCta) {
      navCta.addEventListener('click', function () {
        const ctaSection = document.querySelector('.cta-section');
        if (ctaSection) {
          ctaSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    initNav();
    initScrollReveal();
    initDemo();
    initSmoothScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
