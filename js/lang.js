window.addEventListener("DOMContentLoaded", () => {

    const Lang = (() => {
        const STORAGE_KEY = 'lang';
        const DEFAULT_LANG = 'es';
        const SUPPORTED = ['es', 'cat', 'en', 'fr'];

        let current = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
        let translations = {};

        async function load(lang) {
            if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
            const res = await fetch(`../translations/${lang}.json`);
            translations = await res.json();
            current = lang;
            localStorage.setItem(STORAGE_KEY, lang);
            apply();
        }

        function apply() {
            // innerHTML
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (translations[key] !== undefined) {
                    // <option> usa textContent para evitar HTML en el valor
                    if (el.tagName === 'OPTION') {
                        el.textContent = translations[key];
                    } else {
                        el.innerHTML = translations[key];
                    }
                }
            });

            // Placeholders
            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.dataset.i18nPlaceholder;
                if (translations[key] !== undefined) {
                    el.placeholder = translations[key];
                }
            });

            // Active language
            const btn = document.getElementById('lang-current');
            if (btn) {
                const labels = { es: 'ES', cat: 'CAT', en: 'ENG', fr: 'FR' };
                btn.textContent = labels[current] || current.toUpperCase();
            }
        }

        function init() {
            const params = new URLSearchParams(window.location.search);
            const urlLang = params.get('lang');
            if (urlLang && SUPPORTED.includes(urlLang)) {
                current = urlLang;
            }
            load(current);
        }

        return { init, load };
    })();

    window.Lang = Lang;

    Lang.init();
});