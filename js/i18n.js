/* ============================================
   I18N.JS — Internationalization Engine
   ============================================ */

class I18n {
    constructor() {
        this.translations = {};
        this.currentLang = localStorage.getItem('lang') || 'sk';
        this.fallbackLang = 'sk';
    }

    async loadLanguage(lang) {
        if (this.translations[lang]) return this.translations[lang];

        try {
            const response = await fetch(`/locales/${lang}.json`);
            if (!response.ok) throw new Error(`Failed to load ${lang}`);
            this.translations[lang] = await response.json();
            return this.translations[lang];
        } catch (err) {
            console.warn(`i18n: Could not load ${lang}, falling back to ${this.fallbackLang}`);
            if (lang !== this.fallbackLang) {
                return this.loadLanguage(this.fallbackLang);
            }
            return {};
        }
    }

    async setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
        const data = await this.loadLanguage(lang);
        this.applyTranslations(data);
        document.documentElement.lang = lang;

        // Update meta tags
        if (data.meta) {
            const titleEl = document.querySelector('title');
            const path = window.location.pathname;
            const pageKey = this.getPageKey(path);
            if (data.meta[pageKey]?.title && titleEl) {
                titleEl.textContent = data.meta[pageKey].title;
            }
            const descEl = document.querySelector('meta[name="description"]');
            if (data.meta[pageKey]?.description && descEl) {
                descEl.setAttribute('content', data.meta[pageKey].description);
            }
        }
    }

    getPageKey(path) {
        const map = {
            '/': 'home',
            '/riadenie-projektov/': 'riadenie',
            '/internetove-riesenia/': 'internet',
            '/grafika/': 'grafika',
            '/marketing/': 'marketing',
            '/aplikacie/': 'aplikacie',
            '/preco-my/': 'preco',
            '/kontakt/': 'kontakt',
        };
        return map[path] || 'home';
    }

    applyTranslations(data) {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const value = this.getNestedValue(data, key);
            if (value) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = value;
                } else {
                    el.innerHTML = value;
                }
            }
        });

        // Handle data-i18n-attr for attributes
        document.querySelectorAll('[data-i18n-title]').forEach(el => {
            const key = el.dataset.i18nTitle;
            const value = this.getNestedValue(data, key);
            if (value) el.title = value;
        });
    }

    getNestedValue(obj, path) {
        return path.split('.').reduce((acc, key) => acc?.[key], obj);
    }

    t(key) {
        const data = this.translations[this.currentLang] || {};
        return this.getNestedValue(data, key) || key;
    }

    async init() {
        await this.setLanguage(this.currentLang);

        // Update lang button text
        const btn = document.querySelector('.header__lang-btn');
        if (btn) btn.textContent = this.currentLang.toUpperCase() + ' ▾';

        // Set active option
        document.querySelectorAll('.header__lang-option').forEach(opt => {
            opt.classList.toggle('active', opt.dataset.lang === this.currentLang);
        });
    }
}

// Global instance
window.i18n = new I18n();
document.addEventListener('DOMContentLoaded', () => {
    window.i18n.init();
});

export default I18n;
