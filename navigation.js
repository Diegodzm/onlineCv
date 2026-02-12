function showSection(sectionId = 'portfolio') {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));

    const isPortfolio = sectionId === 'portfolio';
    const portfolio = document.getElementById('portfolio-section');
    const space = document.getElementById('space-canvas');
    const lang = document.querySelector('.lang-container');
    if (portfolio) portfolio.style.display = isPortfolio ? 'block' : 'none';
    if (space) space.style.display = isPortfolio ? 'block' : 'none';
    if (lang) lang.style.display = isPortfolio ? 'block' : 'none';

    document.body.classList.toggle('light-bg', !isPortfolio);

    if (!isPortfolio) {
        const target = document.getElementById(sectionId);
        if (target) target.classList.add('active');
    }
}

document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-section]');
    if (!btn) return;
    e.preventDefault();
    showSection(btn.getAttribute('data-section'));

    // close mobile nav automatically after selection
    const nav = document.querySelector('.nav');
    if (nav && nav.classList.contains('nav-open')) {
        nav.classList.remove('nav-open');
        nav.setAttribute('aria-hidden', 'true');
        const toggle = document.getElementById('navToggle');
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
    }
});

// mobile nav toggle
const navToggle = document.getElementById('navToggle');
if (navToggle) {
    const nav = document.querySelector('.nav');
    if (nav) {
        nav.setAttribute('aria-hidden', 'true');
        navToggle.setAttribute('aria-expanded', 'false');
    }

    navToggle.addEventListener('click', () => {
        const nav = document.querySelector('.nav');
        if (!nav) return;
        const open = nav.classList.toggle('nav-open');
        nav.setAttribute('aria-hidden', open ? 'false' : 'true');
        navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
}

// show portfolio on load
showSection();
