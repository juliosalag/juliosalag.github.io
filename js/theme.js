window.addEventListener("DOMContentLoaded", () => {
    const Theme = (() => {

        const STORAGE_KEY = 'theme';
        const DEFAULT_THEME = 'dark';

        const themes = {

            dark: {
                '--bg': '#252446',
                '--surface': '#201533',
                '--text': '#0098db',
                '--muted': '#908e8b',
                '--accent': '#0098db',
                '--on-surface': '#ffffff'
            },

            light: {
                '--bg': '#eddbc4',
                '--surface': '#333333',
                '--text': '#333333',
                '--muted': '#908e8b',
                '--accent': '#bd5a63',
                '--on-surface': '#ffffff'
            }
        };

        let current = localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME;

        function apply(themeName) {
            const theme = themes[themeName];
            if (!theme) return;

            Object.entries(theme).forEach(([key, value]) => {
                document.documentElement.style.setProperty(key, value);
            });
            const btn = document.getElementById('theme-current');

            if (btn) {
                const labels = {
                    dark: 'DARK',
                    light: 'LIGHT'
                };
                btn.textContent = labels[themeName] || themeName.toUpperCase();
            }

            current = themeName;
            localStorage.setItem(STORAGE_KEY, themeName);
        }

        function load(themeName) {
            apply(themeName);
        }

        function init() {
            apply(current);
        }

        return { init, load };

    })();

    window.Theme = Theme;

    Theme.init();
});