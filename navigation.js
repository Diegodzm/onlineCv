// Single Page App Navigation
function showSection(sectionId) {
    // Hide all page sections
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Toggle portfolio elements visibility
    const portfolioSection = document.getElementById('portfolio-section');
    const matrixCanvas = document.getElementById('matrix-canvas');
    const isPortfolio = sectionId === 'portfolio';
    
    portfolioSection.style.display = isPortfolio ? 'block' : 'none';
    matrixCanvas.style.display = isPortfolio ? 'block' : 'none';
    document.body.classList.toggle('light-bg', !isPortfolio);
    
    // Show selected section if not portfolio
    if (!isPortfolio) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('active');
        }
    }
}

// Handle navbar link clicks
document.addEventListener('DOMContentLoaded', () => {
    const handleNavClick = (e) => {
        e.preventDefault();
        const section = e.target.getAttribute('data-section');
        showSection(section);
    };

    // Handle navbar links and back buttons
    document.querySelectorAll('[data-section]').forEach(el => {
        el.addEventListener('click', handleNavClick);
    });

    // Show portfolio by default
    showSection('portfolio');
});
