const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Matrix characters - mix of katakana and symbols
const katakana = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const nums = '0123456789';
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const chars = katakana + nums + alphabet;

const fontSize = 16;
const charHeight = 22;

// Column data: single object array replaces 9 parallel arrays
let columns = [];
const percentWide = 0.12; // ~12% of columns will be wider
const columnGap = 4; // pixels between columns to avoid overlap

// Helper: get character count based on column width
function getCharCount(isWide) {
    return isWide ? (28 + Math.floor(Math.random() * 18)) : (18 + Math.floor(Math.random() * 12));
}

// Helper: generate random character array
function generateCharArray(count) {
    const arr = [];
    for (let i = 0; i < count; i++) {
        arr.push(chars[Math.floor(Math.random() * chars.length)]);
    }
    return arr;
}

function initColumns() {
    const avgWidth = fontSize * (1 + percentWide * 0.2) + columnGap;
    const numColumns = Math.floor(canvas.width / avgWidth) || 1;
    columns = [];

    let x = 0;
    for (let i = 0; i < numColumns; i++) {
        const isWide = Math.random() < percentWide;
        const fontMul = (isWide ? 1.2 : 1.0) * (0.9 + Math.random() * 0.6);
        const width = Math.round(fontSize * fontMul);
        const charHeight_scaled = Math.max(14, Math.round(charHeight * (width / fontSize)));
        const charCount = getCharCount(isWide);

        columns.push({
            drop: Math.random() * canvas.height,
            speed: 0.2 + Math.random() * 0.6,
            chars: generateCharArray(charCount),
            x: x,
            width: width,
            charHeight: charHeight_scaled,
            isWide: isWide,
            updateProb: 0.01 + Math.random() * 0.08
        });
        x += width + columnGap;
    }
}

// initialize columns
initColumns();

function drawMatrixStacked() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < columns.length; i++) {
        const col = columns[i];

        // occasionally update a random character in the column
        if (Math.random() < col.updateProb) {
            const idx = Math.floor(Math.random() * col.chars.length);
            col.chars[idx] = chars[Math.floor(Math.random() * chars.length)];
        }

        for (let j = 0; j < col.chars.length; j++) {
            const yPos = col.drop - j * col.charHeight;
            const base = 1 - (j / col.chars.length);
            const opacity = Math.max(0.08, base * 0.5);
            const drawX = col.x + Math.floor(Math.max(0, (col.width - col.width) / 2));

            ctx.fillStyle = `rgba(0,255,0,${opacity})`;
            ctx.font = col.width + 'px monospace';
            ctx.fillText(col.chars[j], drawX, yPos);
        }

        // Reset column when past bottom
        if (col.drop - (col.chars.length * col.charHeight) > canvas.height) {
            col.drop = -Math.random() * 200;
            col.chars = generateCharArray(getCharCount(col.isWide));
        }

        col.drop += col.speed;
    }
}

function animate() {
    drawMatrixStacked();
    requestAnimationFrame(animate);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initColumns();
});

// Typing + deleting animation for portfolio title
(function titleTyping() {
    const h1 = document.querySelector('.portfolio-title h1');
    const p = document.querySelector('.portfolio-title p');
    if (!h1 || !p) return;

    const h1Text = 'Diego Diaz Medina';
    const pText = 'Portfolio';
    const typeSpeed = 220; // ms per char (slower)
    const deleteSpeed = 120; // ms per char (slower)
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
