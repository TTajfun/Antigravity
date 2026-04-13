/* ============================================
   MAIN.JS — Navigation, Preloader, Back-to-top
   ============================================ */

// ---- Preloader (A1) ----
function initPreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 600);
        }, 800);
    });
}

// ---- Sticky Header (A3) ----
function initHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // Set active nav link
    const currentPath = window.location.pathname;
    document.querySelectorAll('.header__nav-link, .header__dropdown-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '/' && href === '/')) {
            link.classList.add('active');
        }
    });
}

// ---- Mobile Menu (A15) ----
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (!hamburger || !mobileMenu) return;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Sub-menu accordion for "služby"
    const subToggle = mobileMenu.querySelector('.mobile-menu__sub-toggle');
    if (subToggle) {
        subToggle.addEventListener('click', (e) => {
            e.preventDefault();
            const sub = mobileMenu.querySelector('.mobile-menu__sub');
            if (sub) sub.classList.toggle('open');
        });
    }

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-menu__link:not(.mobile-menu__sub-toggle), .mobile-menu__sub-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// ---- Back to Top (A6) ----
function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---- Smooth Scroll for Anchor Links (A16) ----
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}

// ---- Language Switcher ----
function initLangSwitcher() {
    const btn = document.querySelector('.header__lang-btn');
    const dropdown = document.querySelector('.header__lang-dropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', () => {
        dropdown.classList.toggle('open');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.header__lang')) {
            dropdown.classList.remove('open');
        }
    });

    dropdown.querySelectorAll('.header__lang-option').forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.dataset.lang;
            if (window.i18n) {
                window.i18n.setLanguage(lang);
            }
            dropdown.classList.remove('open');
            btn.textContent = lang.toUpperCase() + ' ▾';
            dropdown.querySelectorAll('.header__lang-option').forEach(o => o.classList.remove('active'));
            option.classList.add('active');
        });
    });
}

// ---- Init All ----
document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initHeader();
    initMobileMenu();
    initBackToTop();
    initSmoothScroll();
    initLangSwitcher();
});

export { initPreloader, initHeader, initMobileMenu, initBackToTop };
