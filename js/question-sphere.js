/* ============================================
   QUESTION MARK SPHERE (A11)
   ============================================ */

function initSphere() {
    const container = document.getElementById('sphere');
    if (!container) return;

    const count = 40;
    const radius = 150;

    for (let i = 0; i < count; i++) {
        const mark = document.createElement('span');
        mark.className = 'sphere__mark';
        mark.textContent = '?';

        // Fibonacci sphere distribution
        const phi = Math.acos(1 - 2 * (i + 0.5) / count);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;

        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        mark.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        mark.style.opacity = (0.3 + (z + radius) / (2 * radius) * 0.7).toFixed(2);
        mark.style.fontSize = `${1 + (z + radius) / (2 * radius) * 0.8}rem`;

        container.appendChild(mark);
    }
}

document.addEventListener('DOMContentLoaded', initSphere);

export { initSphere };
