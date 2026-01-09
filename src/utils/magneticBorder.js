const cards = new Set();
const mouse = { x: 0, y: 0 };
let rafId = null;

function onMouseMove(e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
}

function animate() {
    const max = 800;

    for (const el of cards) {
        if (!el || !el.isConnected) {
            cards.delete(el);
            continue;
        }
        const rect = el.getBoundingClientRect();
        const cx = mouse.x - rect.left;
        const cy = mouse.y - rect.top;

        const dx = Math.max(rect.left - mouse.x, 0, mouse.x - rect.right);
        const dy = Math.max(rect.top - mouse.y, 0, mouse.y - rect.bottom);
        const distance = Math.sqrt(dx * dx + dy * dy);

        const intensity = Math.max(0, 1 - distance / max);

        el.style.setProperty("--mx", `${cx}px`);
        el.style.setProperty("--my", `${cy}px`);
        el.style.setProperty("--i", intensity.toFixed(3));
    }

    if (cards.size === 0) {
        stopMagneticBorder();
        return;
    }

    rafId = requestAnimationFrame(animate);
}

export function startMagneticBorder() {
    if (rafId) return;

    window.addEventListener("mousemove", onMouseMove);
    rafId = requestAnimationFrame(animate);
}

export function stopMagneticBorder() {
    if (!rafId) return;
    cancelAnimationFrame(rafId);
    rafId = null;
    window.removeEventListener("mousemove", onMouseMove);
}

export function registerCard(el) {
    if (el) cards.add(el);
    startMagneticBorder();
}

export function unregisterCard(el) {
    cards.delete(el);
    if (cards.size === 0) stopMagneticBorder();
}
