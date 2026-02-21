document.addEventListener('DOMContentLoaded', () => {
    // ──────────────────────────────────────
    // Mobile Menu Toggle
    // ──────────────────────────────────────
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navList = document.querySelector('.nav-list');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            if (navList) navList.classList.toggle('active');
        });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navList && navList.classList.contains('active') &&
            !navList.contains(e.target) &&
            mobileMenuBtn && !mobileMenuBtn.contains(e.target)) {
            navList.classList.remove('active');
        }
    });

    // ──────────────────────────────────────
    // Smooth scrolling for anchor links
    // ──────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ──────────────────────────────────────
    // Cookie Consent Banner
    // ──────────────────────────────────────
    initCookieConsent();

    // ──────────────────────────────────────
    // Hero Slider
    // ──────────────────────────────────────
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');

    if (slides.length === 0) return; // no slider on this page

    let current = 0;
    const total = slides.length;
    const INTERVAL_MS = 6000;
    let autoTimer = null;

    function goTo(index) {
        // Hide current
        slides[current].classList.remove('opacity-100', 'z-10');
        slides[current].classList.add('opacity-0', 'z-0');
        dots[current].classList.remove('bg-white', 'w-10');
        dots[current].classList.add('bg-white/40', 'w-6');

        // Show target
        current = ((index % total) + total) % total;
        slides[current].classList.remove('opacity-0', 'z-0');
        slides[current].classList.add('opacity-100', 'z-10');
        dots[current].classList.remove('bg-white/40', 'w-6');
        dots[current].classList.add('bg-white', 'w-10');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    function resetAuto() {
        clearInterval(autoTimer);
        autoTimer = setInterval(next, INTERVAL_MS);
    }

    // Dot clicks
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            goTo(parseInt(dot.dataset.goto, 10));
            resetAuto();
        });
    });

    // Arrow clicks
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });

    // Pause on hover
    const heroSection = document.getElementById('home');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', () => clearInterval(autoTimer));
        heroSection.addEventListener('mouseleave', resetAuto);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') { prev(); resetAuto(); }
        if (e.key === 'ArrowRight') { next(); resetAuto(); }
    });

    // Touch / swipe support
    let touchStartX = 0;
    if (heroSection) {
        heroSection.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].clientX;
        }, { passive: true });
        heroSection.addEventListener('touchend', (e) => {
            const diff = touchStartX - e.changedTouches[0].clientX;
            if (Math.abs(diff) > 50) {
                diff > 0 ? next() : prev();
                resetAuto();
            }
        }, { passive: true });
    }

    // Start auto-rotation
    resetAuto();
});

function initCookieConsent() {
    const banner = document.getElementById('cookie-consent-banner');
    if (!banner) return;

    const consent = localStorage.getItem('myval_cookie_consent');
    if (consent) return; // Already accepted or declined

    // Show banner after a short delay
    setTimeout(() => {
        banner.classList.remove('hidden');
        banner.classList.add('cookie-banner-enter');
    }, 1500);

    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    const settingsBtn = document.getElementById('cookie-settings');
    const settingsPanel = document.getElementById('cookie-settings-panel');
    const saveSettingsBtn = document.getElementById('cookie-save-settings');

    function closeBanner(value) {
        banner.classList.remove('cookie-banner-enter');
        banner.classList.add('cookie-banner-exit');
        banner.addEventListener('animationend', () => {
            banner.classList.add('hidden');
            banner.classList.remove('cookie-banner-exit');
        }, { once: true });
        localStorage.setItem('myval_cookie_consent', value);
    }

    if (acceptBtn) {
        acceptBtn.addEventListener('click', () => closeBanner('all'));
    }

    if (declineBtn) {
        declineBtn.addEventListener('click', () => closeBanner('essential'));
    }

    if (settingsBtn && settingsPanel) {
        settingsBtn.addEventListener('click', () => {
            settingsPanel.classList.toggle('hidden');
        });
    }

    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const analytics = document.getElementById('cookie-analytics')?.checked;
            const marketing = document.getElementById('cookie-marketing')?.checked;
            const prefs = { essential: true, analytics: !!analytics, marketing: !!marketing };
            closeBanner(JSON.stringify(prefs));
        });
    }
}
