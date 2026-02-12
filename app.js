// Starfield animation for space background
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

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

// Language toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        // set active display based on current path
        const esSpan = langToggle.querySelector('.lang-option[data-lang="es"]');
        const enSpan = langToggle.querySelector('.lang-option[data-lang="en"]');
        const currentPath = window.location.pathname;
        if (currentPath.includes('index-es.html')) {
            esSpan?.classList.add('lang-active');
            enSpan?.classList.remove('lang-active');
        } else {
            enSpan?.classList.add('lang-active');
            esSpan?.classList.remove('lang-active');
        }

        langToggle.addEventListener('click', function() {
            const currentPath = window.location.pathname;
            if (currentPath.includes('index-es.html')) {
                window.location.href = 'index.html';
            } else {
                window.location.href = 'index-es.html';
            }
        });
    }
});

// Typing + deleting animation for portfolio title
(function titleTyping() {
    const h1 = document.querySelector('.portfolio-title h1');
    const p = document.querySelector('.portfolio-title p');
    if (!h1 || !p) return;

    // Check if we're on Spanish version
    const isSpanish = window.location.pathname.includes('index-es.html');
    const h1Text = isSpanish ? '¡Bienvenido!' : 'Welcome!';
    const pText = isSpanish ? 'A mi Portafolio de Programación' : 'To my Programming Portfolio';
    const typeSpeed = 100; // ms per char (slower)
    const deleteSpeed = 150; // ms per char (slower)
    const pauseAfterType = 1500;

    // prepare text and cursor spans
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

    function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

    async function typeInto(span, text) {
        for (let i = 1; i <= text.length; i++) {
            span.textContent = text.slice(0, i);
            await wait(typeSpeed);
        }
    }

    async function deleteFrom(span, text) {
        for (let i = text.length; i >= 0; i--) {
            span.textContent = text.slice(0, i);
            await wait(deleteSpeed);
        }
    }

    (async function loop() {
        while (true) {
            // type h1 then p
            await typeInto(h1Span, h1Text);
            await typeInto(pSpan, pText);
            await wait(pauseAfterType);
            // delete p then h1
            await deleteFrom(pSpan, pText);
            await deleteFrom(h1Span, h1Text);
            await wait(500);
        }
    })();
})();
