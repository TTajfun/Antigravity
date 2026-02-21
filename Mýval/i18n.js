/**
 * MÝVAL – Lightweight i18n Translation Engine
 * Supports: sk, en, de, cs, pl
 */
(function () {
    'use strict';

    const SUPPORTED_LANGS = ['sk', 'en', 'de', 'cs', 'pl'];
    const DEFAULT_LANG = 'sk';
    const STORAGE_KEY = 'myval_lang';
    let currentLang = DEFAULT_LANG;
    let translations = {};

    // Detect initial language
    function detectLanguage() {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED_LANGS.includes(stored)) return stored;

        const browserLang = (navigator.language || navigator.userLanguage || '').substring(0, 2).toLowerCase();
        if (SUPPORTED_LANGS.includes(browserLang)) return browserLang;

        return DEFAULT_LANG;
    }

    // Load translations from JSON file
    async function loadTranslations(lang) {
        if (translations[lang]) return translations[lang];
        try {
            const resp = await fetch('lang/' + lang + '.json');
            if (!resp.ok) throw new Error('HTTP ' + resp.status);
            translations[lang] = await resp.json();
            return translations[lang];
        } catch (e) {
            console.warn('[i18n] Could not load lang/' + lang + '.json:', e.message);
            return null;
        }
    }

    // Resolve a nested key like "common.nav.home" from an object
    function resolve(obj, key) {
        return key.split('.').reduce(function (o, k) { return o && o[k]; }, obj);
    }

    // Apply translations to all elements with data-i18n attributes
    function applyTranslations(dict) {
        if (!dict) return;

        // data-i18n → textContent
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            var val = resolve(dict, key);
            if (val !== undefined && val !== null) {
                // If element has child elements with data-i18n, only set text of this node
                if (el.querySelector('[data-i18n]')) return;
                el.textContent = val;
            }
        });

        // data-i18n-html → innerHTML (for strings with <strong>, <br>, etc.)
        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-html');
            var val = resolve(dict, key);
            if (val !== undefined && val !== null) el.innerHTML = val;
        });

        // data-i18n-placeholder → placeholder attribute
        document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
            var key = el.getAttribute('data-i18n-placeholder');
            var val = resolve(dict, key);
            if (val !== undefined && val !== null) el.placeholder = val;
        });

        // data-i18n-title → document title
        var titleEl = document.querySelector('[data-i18n-title]');
        if (titleEl) {
            var titleKey = titleEl.getAttribute('data-i18n-title');
            var titleVal = resolve(dict, titleKey);
            if (titleVal) document.title = titleVal;
        }

        // Update <html lang> attribute
        document.documentElement.lang = currentLang;

        // Update the lang switcher label
        var langLabel = document.getElementById('current-lang');
        if (langLabel) langLabel.textContent = currentLang.toUpperCase();

        // Highlight active language in dropdown
        document.querySelectorAll('[data-lang-option]').forEach(function (btn) {
            btn.classList.toggle('bg-blue-50', btn.getAttribute('data-lang-option') === currentLang);
            btn.classList.toggle('text-myval-blue', btn.getAttribute('data-lang-option') === currentLang);
            btn.classList.toggle('font-semibold', btn.getAttribute('data-lang-option') === currentLang);
        });
    }

    // Public: set language
    window.setLanguage = async function (lang) {
        if (!SUPPORTED_LANGS.includes(lang)) return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        var dict = await loadTranslations(lang);
        applyTranslations(dict);
    };

    // Initialize on DOM ready
    function init() {
        currentLang = detectLanguage();

        // Setup lang switcher toggle
        var switcher = document.getElementById('lang-switcher');
        var toggleBtn = document.getElementById('lang-toggle');
        var dropdown = document.getElementById('lang-dropdown');

        if (toggleBtn && dropdown) {
            toggleBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                dropdown.classList.toggle('hidden');
            });
            document.addEventListener('click', function () {
                dropdown.classList.add('hidden');
            });
            dropdown.addEventListener('click', function (e) {
                e.stopPropagation();
            });
        }

        // Load and apply initial language
        loadTranslations(currentLang).then(function (dict) {
            applyTranslations(dict);
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
