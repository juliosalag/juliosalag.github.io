window.addEventListener("DOMContentLoaded", () => {

    const Lang = (() => {
        const STORAGE_KEY = 'lang';
        const DEFAULT_LANG = 'es';
        const SUPPORTED = ['es', 'cat', 'en', 'fr'];

        let current = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
        let translations = {};

        function refreshAnchor() {
            if (window.location.hash) {
                const element = document.querySelector(window.location.hash);

                if (element) {
                    element.scrollIntoView({
                        behavior: "instant",
                        block: "start"
                    });
                }
            }
        }

        async function load(lang) {
            if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;

            const res = await fetch(`../translations/${lang}.json`);
            translations = await res.json();

            current = lang;
            localStorage.setItem(STORAGE_KEY, lang);

            apply();

            // Espera a que el navegador repinte el contenido traducido
            requestAnimationFrame(() => {
                refreshAnchor();
            });
        }

        function apply() {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.dataset.i18n;
                if (translations[key] !== undefined) {
                    if (el.tagName === 'OPTION') {
                        el.textContent = translations[key];
                    } else {
                        el.innerHTML = translations[key];
                    }
                }
            });

            document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
                const key = el.dataset.i18nPlaceholder;
                if (translations[key] !== undefined) {
                    el.placeholder = translations[key];
                }
            });

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