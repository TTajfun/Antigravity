/* ============================================
   ANIMATIONS.JS — Intersection Observer, Scroll Highlight, Parallax
   ============================================ */

// ---- Entrance Animations (A7) ----
function initEntranceAnimations() {
    const selectors = [
        '.animate-on-scroll',
        '.animate-slide-left',
        '.animate-slide-right',
        '.animate-scale-in',
        '.animate-highlight-sweep',
        '.text-highlight',
        '.split__media--clip'
    ];
    const elements = document.querySelectorAll(selectors.join(', '));
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => observer.observe(el));
}

// ---- Scroll Highlight for Services (A5) ----
function initScrollHighlight() {
    const servicesList = document.querySelector('.services__list');
    if (!servicesList) return;

    const links = servicesList.querySelectorAll('.services__link');
    if (!links.length) return;

    function updateHighlight() {
        const scrollPos = window.scrollY + window.innerHeight * 0.4;
        const sectionTop = servicesList.getBoundingClientRect().top + window.scrollY;
        const sectionHeight = servicesList.offsetHeight;
        const progress = Math.max(0, Math.min(1, (scrollPos - sectionTop) / sectionHeight));

        const activeIndex = Math.min(
            links.length - 1,
            Math.floor(progress * links.length)
        );

        links.forEach((link, i) => {
            if (i === activeIndex) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    window.addEventListener('scroll', updateHighlight, { passive: true });
    updateHighlight();
}

// ---- Parallax Floating Elements (A8) ----
function initParallax() {
    const elements = document.querySelectorAll('.parallax-element');
    if (!elements.length) return;

    function updateParallax() {
        const scrollY = window.scrollY;
        elements.forEach(el => {
            const factor = parseFloat(el.dataset.parallaxFactor) || 0.3;
            const offsetY = scrollY * factor;
            el.style.transform = `translateY(${offsetY}px)`;
        });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
}

// ---- Why Us Reason Blocks (A12) ----
function initReasonBlocks() {
    const reasons = document.querySelectorAll('.reason');
    if (!reasons.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    reasons.forEach(el => observer.observe(el));
}

// ---- Counter Animation ----
function initCounterAnimations() {
    const counters = document.querySelectorAll('[data-count-to]');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.countTo, 10);
                const duration = 2000;
                const startTime = performance.now();

                function updateCounter(currentTime) {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(target * eased);
                    if (progress < 1) {
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.textContent = target;
                    }
                }

                requestAnimationFrame(updateCounter);
                observer.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    initEntranceAnimations();
    initScrollHighlight();
    initParallax();
    initReasonBlocks();
    initCounterAnimations();
});

export { initEntranceAnimations, initScrollHighlight, initParallax, initReasonBlocks, initCounterAnimations };
