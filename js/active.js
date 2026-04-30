// Mobile sidebar toggle
const sidebar = document.getElementById('sidebar');
const menuBtn = document.getElementById('menuBtn');
menuBtn.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    menuBtn.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
});

// Active nav link on scroll
const sections = document.querySelectorAll('.doc-section');
const navLinks = document.querySelectorAll('.sidebar nav a');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('active'));
            const active = document.querySelector(`.sidebar nav a[href="#${entry.target.id}"]`);
            if (active) active.classList.add('active');
        }
    });
}, { rootMargin: '-20% 0px -75% 0px' });

// Copy code form <code>
function copyCode(btn) {
    const code = btn.closest('pre').querySelector('code');
    navigator.clipboard.writeText(code.textContent.trim()).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => btn.textContent = 'Copy', 2000);
    });
}

sections.forEach(s => observer.observe(s));