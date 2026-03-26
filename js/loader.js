window.addEventListener("DOMContentLoaded", () => {

    const Lang = (() => {
        const STORAGE_KEY = 'lang';
        const DEFAULT_LANG = 'es';
        const SUPPORTED = ['es', 'cat', 'en', 'fr'];

        let current = localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
        let translations = {};

        async function load(lang) {
            if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
            const res = await fetch(`./translations/${lang}.json`);
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

            /*
            const activeLink = document.querySelector('#header nav a.active');
            if (activeLink) {
                const key = activeLink.dataset.i18n;
                if (key === "nav_inicio") {
                    document.title = "Vincero Gestión S.L.";
                } else if (translations[key] !== undefined) {
                    document.title = translations[key];
                }
            }else{
                document.title = translations["nav_contacto"];
            }
            */

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

    Promise.all([
        fetch("./components/header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;

            /*
            const path = window.location.pathname.split("/").pop() || "index.html";

            const links = document.querySelectorAll("#header nav ul li a");
            links.forEach(link => {
            if (link.getAttribute("href") === path) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
            });
            */
        }),
        fetch("./components/footer.html")
        .then(res => res.text())
        .then(data => document.getElementById("footer").innerHTML = data)
    ])
    .then(() => {
        Lang.init();
    })
    .catch(err => {
        console.error("Error cargando header/footer:", err);
    });
});