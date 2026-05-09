// Starfield animation for space background
const canvas = document.getElementById('space-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

if (canvas && ctx) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Space scene elements
let stars = [];
let planets = [];
let sun = {};

// Initialize stars
function initStars() {
    stars = [];
    const numStars = Math.floor((canvas.width * canvas.height) / 8000); // Density based on screen size

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            brightness: Math.random(),
            twinkleSpeed: 0.02 + Math.random() * 0.04,
            twinkleOffset: Math.random() * Math.PI * 2
        });
    }
}

// Initialize planets
function initPlanets() {
    planets = [];
    const numPlanets = 3 + Math.floor(Math.random() * 3); // 3-5 planets

    for (let i = 0; i < numPlanets; i++) {
        const semiMajorAxis = 100 + i * 80 + Math.random() * 50; // Increasing distance
        const eccentricity = 0.1 + Math.random() * 0.4; // 0.1 to 0.5
        const angle = Math.random() * Math.PI * 2;
        const angularSpeed = 0.005 + Math.random() * 0.01; // Slower for outer planets

        planets.push({
            semiMajorAxis: semiMajorAxis,
            eccentricity: eccentricity,
            angle: angle,
            angularSpeed: angularSpeed,
            x: 0, // Will be calculated
            y: 0, // Will be calculated
            radius: 20 + Math.random() * 40,
            color: `hsl(${Math.random() * 360}, 70%, 50%)`,
            rotation: 0,
            rotationSpeed: (Math.random() - 0.5) * 0.02
        });
    }
}

// Initialize sun
function initSun() {
    sun = {
        x: canvas.width * 0.1,
        y: canvas.height * 0.2,
        radius: 60,
        glowRadius: 120,
        color: '#FFD700',
        glowColor: '#FFA500'
    };
}



// Initialize space scene
if (canvas && ctx) {
    function initSpaceScene() {
        initStars();
        initPlanets();
        initSun();
    }

    initSpaceScene();

    // Draw stars
    function drawStars() {
        stars.forEach(star => {
            const brightness = 0.3 + 0.7 * Math.sin(Date.now() * star.twinkleSpeed + star.twinkleOffset);
            ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            ctx.fill();
        });
    }



    // Draw planets
    function drawPlanets() {
        planets.forEach(planet => {
            // Planet body
            ctx.fillStyle = planet.color;
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
            ctx.fill();

            // Planet shadow/highlight
            const gradient = ctx.createRadialGradient(
                planet.x - planet.radius * 0.3, planet.y - planet.radius * 0.3, 0,
                planet.x, planet.y, planet.radius
            );
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    }

    // Draw sun
    function drawSun() {
        // Sun glow
        const gradient = ctx.createRadialGradient(
            sun.x, sun.y, 0,
            sun.x, sun.y, sun.glowRadius
        );
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 165, 0, 0.4)');
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Sun body
        ctx.fillStyle = sun.color;
        ctx.beginPath();
        ctx.arc(sun.x, sun.y, sun.radius, 0, Math.PI * 2);
        ctx.fill();

        // Sun rays (animated)
        const time = Date.now() * 0.001;
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2 + time;
            const rayLength = sun.radius + 20 + Math.sin(time * 2 + i) * 10;
            const rayWidth = 3;

            ctx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
            ctx.lineWidth = rayWidth;
            ctx.beginPath();
            ctx.moveTo(
                sun.x + Math.cos(angle) * sun.radius,
                sun.y + Math.sin(angle) * sun.radius
            );
            ctx.lineTo(
                sun.x + Math.cos(angle) * rayLength,
                sun.y + Math.sin(angle) * rayLength
            );
            ctx.stroke();
        }
    }

    // Update planet positions
    function updatePlanets() {
        planets.forEach(planet => {
            // Update orbital angle
            planet.angle += planet.angularSpeed;

            // Calculate elliptical orbit position
            const a = planet.semiMajorAxis;
            const e = planet.eccentricity;
            const theta = planet.angle;

            // Elliptical coordinates
            const r = a * (1 - e * e) / (1 + e * Math.cos(theta));
            planet.x = sun.x + r * Math.cos(theta);
            planet.y = sun.y + r * Math.sin(theta);

            planet.rotation += planet.rotationSpeed;
        });
    }



    // Draw space scene
    function drawSpaceScene() {
        // Clear canvas with space background
        ctx.fillStyle = '#000011';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        drawStars();
        drawSun();
        drawPlanets();
        updatePlanets();
    }

    function animate() {
        drawSpaceScene();
        requestAnimationFrame(animate);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initSpaceScene();
    });
}

// Language Manager - Sistema de multiidioma dinámico sin recargar la página
class LanguageManager {
    constructor() {
        this.currentLang = this.loadLanguage();
        this.contentMap = {
            'subtitle': {
                'en': 'Programming Portfolio',
                'es': 'Portafolio de Programación'
            },
            'nav-home': { 'en': 'Home', 'es': 'Inicio' },
            'nav-about': { 'en': 'About', 'es': 'Acerca de' },
            'nav-projects': { 'en': 'Projects', 'es': 'Proyectos' },
            'nav-contact': { 'en': 'Contact', 'es': 'Contacto' },
            'back-to-portfolio': { 'en': '← Back to Portfolio', 'es': '← Volver al Portafolio' },
            'about-title': { 'en': 'About Me', 'es': 'Acerca de Mí' },
            'about-text': {
                'en': 'Full-stack developer with a background in engineering and specialized full-stack programming certifications. I am a technology enthusiast and a self-taught learner, driven by a strong desire to keep evolving and growing within the software development field. I enjoy implementing new technologies and transforming ideas into functional, real-world projects.<br><br>I am responsible, proactive, team-oriented, and focused on achieving goals. Currently open to new professional opportunities.',
                'es': 'Desarrollador full-stack con formación en ingeniería y certificaciones especializadas en programación full-stack. Soy un entusiasta de la tecnología y un aprendiz autodidacta, impulsado por un fuerte deseo de seguir evolucionando y creciendo dentro del campo del desarrollo de software. Disfruto implementar nuevas tecnologías y transformar ideas en proyectos funcionales del mundo real.<br><br>Soy responsable, proactivo, orientado al trabajo en equipo y enfocado en lograr objetivos. Abierto a nuevas oportunidades profesionales.'
            },
            'projects-title': { 'en': 'Projects', 'es': 'Proyectos' },
            'react-landing-title': { 'en': 'React LandingPage', 'es': 'Página de Aterrizaje React' },
            'react-landing-desc': {
                'en': 'Basic React JS landing page, repository for useful react code. Right now working in implementing different apis and backend functionality.',
                'es': 'Página de aterrizaje básica con React JS, repositorio de código útil de React. Actualmente trabajando en implementar diferentes APIs y funcionalidad de backend.'
            },
            'ecommerce-title': { 'en': 'Ecommerce template', 'es': 'Plantilla de E-commerce' },
            'ecommerce-desc': {
                'en': 'Ecommerce basic web page with cart functionality',
                'es': 'Página web básica de e-commerce'
            },
            'go-to-project': { 'en': 'Go to Project', 'es': 'Ir al Proyecto' },
            'contact-title': { 'en': 'Contact Me', 'es': 'Contactar' },
            'contact-desc': { 'en': "Get in touch! I'd love to hear from you.", 'es': '¡Ponte en contacto! Me encantaría saber de ti.' },
            'form-name': { 'en': 'Name', 'es': 'Nombre' },
            'form-email': { 'en': 'Email', 'es': 'Correo' },
            'form-message': { 'en': 'Message', 'es': 'Mensaje' },
            'form-submit': { 'en': 'Send Message', 'es': 'Enviar Mensaje' },
            'download-cv-es': { 'en': 'Download CV', 'es': 'Descargar CV' },
            'download-cv-en': { 'en': 'Download CV', 'es': 'Download CV' }
        };
        this.init();
    }

    loadLanguage() {
        const stored = localStorage.getItem('language');
        if (stored && ['en', 'es'].includes(stored)) return stored;
        
        const htmlLang = document.documentElement.lang;
        if (htmlLang === 'es' || htmlLang === 'en') return htmlLang;
        
        return 'en';
    }

    saveLanguage(lang) {
        localStorage.setItem('language', lang);
    }

    init() {
        this.setLanguage(this.currentLang);
        this.setupListeners();
    }

    setupListeners() {
        // Listener directo en el botón principal
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                const newLang = this.currentLang === 'en' ? 'es' : 'en';
                this.setLanguage(newLang);
            });
        }

        // Listeners en las opciones individuales
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                const lang = option.getAttribute('data-lang');
                if (lang && lang !== this.currentLang) {
                    this.setLanguage(lang);
                }
            });
        });
    }

    setLanguage(lang) {
        if (!['en', 'es'].includes(lang)) return;

        this.currentLang = lang;
        this.saveLanguage(lang);

        // Only redirect if not already on the correct page
        const currentPageLang = document.documentElement.lang;
        if (currentPageLang !== lang) {
            if (lang === 'en') {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'index-es.html';
            }
        } else {
            // Already on correct page, just update content if needed
            document.documentElement.lang = lang;
            this.updateContent();
            this.updateLanguageIndicator();
        }
    }

    updateContent() {
        // Actualiza elementos con data-translate
        const elements = document.querySelectorAll('[data-translate]');
        
        elements.forEach(el => {
            const key = el.getAttribute('data-translate');
            if (this.contentMap[key]) {
                const content = this.contentMap[key][this.currentLang];
                if (content) {
                    // Si el contenido contiene HTML, usa innerHTML; si no, usa textContent
                    if (content.includes('<')) {
                        el.innerHTML = content;
                    } else {
                        el.textContent = content;
                    }
                }
            }
        });

        // Actualiza atributos placeholder
        document.querySelectorAll('[data-placeholder]').forEach(el => {
            const key = el.getAttribute('data-placeholder');
            if (this.contentMap[key] && this.contentMap[key][this.currentLang]) {
                el.placeholder = this.contentMap[key][this.currentLang];
            }
        });
    }

    updateLanguageIndicator() {
        const langOptions = document.querySelectorAll('.lang-option');
        langOptions.forEach(option => {
            const lang = option.getAttribute('data-lang');
            if (lang === this.currentLang) {
                option.classList.add('lang-active');
            } else {
                option.classList.remove('lang-active');
            }
        });
    }
}

// Inicializa el gestor de idiomas
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        window.languageManager = new LanguageManager();
    });
} else {
    // Si el DOM ya está listo
    window.languageManager = new LanguageManager();
}

// Typing + deleting animation for portfolio title
(function titleTyping() {
    const h1 = document.querySelector('.portfolio-title h1');
    const p = document.querySelector('.portfolio-title p');
    if (!h1 || !p) return;

    class TitleTyping {
        constructor() {
            this.typeSpeed = 100;
            this.deleteSpeed = 150;
            this.pauseAfterType = 1500;
            this.isAnimating = false;
            this.shouldStop = false;
            this.init();
        }

        init() {
            const h1Span = document.createElement('span');
            h1Span.className = 'typing-text';
            const pSpan = document.createElement('span');
            pSpan.className = 'typing-text';
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';

            h1.innerHTML = '';
            h1.appendChild(h1Span);
            h1.appendChild(cursor);
            p.innerHTML = '';
            p.appendChild(pSpan);

            this.h1Span = h1Span;
            this.pSpan = pSpan;
            this.shouldStop = false;
            this.start();
        }

        getTexts() {
            const lang = window.languageManager?.currentLang || 'en';
            const titles = {
                'en': { h1: 'Welcome!', p: 'To my Programming Portfolio' },
                'es': { h1: '¡Bienvenido!', p: 'A mi Portafolio de Programación' }
            };
            return titles[lang];
        }

        wait(ms) {
            return new Promise(r => setTimeout(r, ms));
        }

        async typeInto(span, text) {
            for (let i = 1; i <= text.length; i++) {
                if (this.shouldStop) return false;
                span.textContent = text.slice(0, i);
                await this.wait(this.typeSpeed);
            }
            return true;
        }

        async deleteFrom(span, text) {
            for (let i = text.length; i >= 0; i--) {
                if (this.shouldStop) {
                    span.textContent = '';
                    return false;
                }
                span.textContent = text.slice(0, i);
                await this.wait(this.deleteSpeed);
            }
            return true;
        }

        async start() {
            if (this.isAnimating) return;
            this.isAnimating = true;

            const { h1: h1Text, p: pText } = this.getTexts();

            await this.typeInto(this.h1Span, h1Text);
            if (this.shouldStop) { this.isAnimating = false; return; }
            
            await this.typeInto(this.pSpan, pText);
            if (this.shouldStop) { this.isAnimating = false; return; }
            
            await this.wait(this.pauseAfterType);
            if (this.shouldStop) { this.isAnimating = false; return; }
            
            await this.deleteFrom(this.pSpan, pText);
            if (this.shouldStop) { this.isAnimating = false; return; }
            
            await this.deleteFrom(this.h1Span, h1Text);
            if (this.shouldStop) { this.isAnimating = false; return; }
            
            await this.wait(500);

            this.isAnimating = false;
            this.start(); // Loop
        }

        interrupt() {
            this.shouldStop = true;
            // Esperar a que termine la animación actual
            const checkInterval = setInterval(() => {
                if (!this.isAnimating) {
                    clearInterval(checkInterval);
                    this.init();
                }
            }, 100);
        }
    }

    window.titleTypingInstance = new TitleTyping();
})();
