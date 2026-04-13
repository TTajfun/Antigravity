/* ============================================
   PARTICLES.JS — Interactive Particle Network with Icons (A2)
   ============================================ */

const ICONS = [
    // Gear/Cog
    (ctx, x, y, size, color) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        const r = size * 0.35;
        const teeth = 6;
        ctx.beginPath();
        ctx.arc(0, 0, r * 0.4, 0, Math.PI * 2);
        ctx.stroke();
        for (let i = 0; i < teeth; i++) {
            const angle = (i / teeth) * Math.PI * 2;
            const inner = r * 0.6;
            const outer = r;
            ctx.beginPath();
            ctx.moveTo(Math.cos(angle - 0.15) * inner, Math.sin(angle - 0.15) * inner);
            ctx.lineTo(Math.cos(angle - 0.15) * outer, Math.sin(angle - 0.15) * outer);
            ctx.lineTo(Math.cos(angle + 0.15) * outer, Math.sin(angle + 0.15) * outer);
            ctx.lineTo(Math.cos(angle + 0.15) * inner, Math.sin(angle + 0.15) * inner);
            ctx.stroke();
        }
        ctx.restore();
    },
    // Rocket
    (ctx, x, y, size, color) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        const s = size * 0.35;
        ctx.beginPath();
        ctx.moveTo(0, -s);
        ctx.lineTo(s * 0.4, s * 0.3);
        ctx.lineTo(s * 0.2, s * 0.5);
        ctx.lineTo(0, s * 0.35);
        ctx.lineTo(-s * 0.2, s * 0.5);
        ctx.lineTo(-s * 0.4, s * 0.3);
        ctx.closePath();
        ctx.stroke();
        // flame
        ctx.beginPath();
        ctx.moveTo(-s * 0.15, s * 0.5);
        ctx.lineTo(0, s * 0.8);
        ctx.lineTo(s * 0.15, s * 0.5);
        ctx.stroke();
        ctx.restore();
    },
    // Person/User
    (ctx, x, y, size, color) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        const s = size * 0.3;
        ctx.beginPath();
        ctx.arc(0, -s * 0.3, s * 0.35, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-s * 0.6, s * 0.7);
        ctx.quadraticCurveTo(-s * 0.6, s * 0.05, 0, s * 0.05);
        ctx.quadraticCurveTo(s * 0.6, s * 0.05, s * 0.6, s * 0.7);
        ctx.stroke();
        ctx.restore();
    },
    // Speech Bubble
    (ctx, x, y, size, color) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        const s = size * 0.35;
        ctx.beginPath();
        ctx.moveTo(-s, -s * 0.3);
        ctx.quadraticCurveTo(-s, -s * 0.8, 0, -s * 0.8);
        ctx.quadraticCurveTo(s, -s * 0.8, s, -s * 0.3);
        ctx.quadraticCurveTo(s, s * 0.2, 0, s * 0.2);
        ctx.lineTo(-s * 0.2, s * 0.2);
        ctx.lineTo(-s * 0.4, s * 0.6);
        ctx.lineTo(-s * 0.4, s * 0.2);
        ctx.quadraticCurveTo(-s, s * 0.2, -s, -s * 0.3);
        ctx.stroke();
        ctx.restore();
    },
    // Lightbulb
    (ctx, x, y, size, color) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5;
        const s = size * 0.35;
        ctx.beginPath();
        ctx.arc(0, -s * 0.15, s * 0.5, Math.PI * 1.2, Math.PI * 1.8);
        ctx.quadraticCurveTo(s * 0.5, s * 0.2, s * 0.2, s * 0.4);
        ctx.lineTo(-s * 0.2, s * 0.4);
        ctx.quadraticCurveTo(-s * 0.5, s * 0.2, -s * 0.5, -s * 0.15);
        ctx.stroke();
        // base lines
        ctx.beginPath();
        ctx.moveTo(-s * 0.15, s * 0.5);
        ctx.lineTo(s * 0.15, s * 0.5);
        ctx.moveTo(-s * 0.12, s * 0.6);
        ctx.lineTo(s * 0.12, s * 0.6);
        ctx.stroke();
        ctx.restore();
    }
];

class ParticleNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 120 };
        this.color = '#f7d100';
        this.particleCount = 40;
        this.connectionDistance = 200;
        this.animationId = null;

        this.resize();
        this.init();
        this.bindEvents();
        this.animate();
    }

    resize() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = this.canvas.offsetWidth * dpr;
        this.canvas.height = this.canvas.offsetHeight * dpr;
        this.ctx.scale(dpr, dpr);
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;

        // Adjust particle count for mobile
        this.particleCount = this.width < 768 ? 20 : 40;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                icon: Math.floor(Math.random() * ICONS.length),
                size: 22 + Math.random() * 8,
            });
        }
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update and draw particles
        this.particles.forEach(p => {
            // Mouse repulsion
            if (this.mouse.x !== null) {
                const dx = p.x - this.mouse.x;
                const dy = p.y - this.mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.mouse.radius) {
                    const force = (this.mouse.radius - dist) / this.mouse.radius;
                    p.x += (dx / dist) * force * 3;
                    p.y += (dy / dist) * force * 3;
                }
            }

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > this.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.height) p.vy *= -1;
            p.x = Math.max(0, Math.min(this.width, p.x));
            p.y = Math.max(0, Math.min(this.height, p.y));

            // Draw icon box
            const half = p.size / 2;
            this.ctx.strokeStyle = `rgba(247, 209, 0, 0.4)`;
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(p.x - half, p.y - half, p.size, p.size);

            // Draw icon
            ICONS[p.icon](this.ctx, p.x, p.y, p.size, this.color);
        });

        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.connectionDistance) {
                    const opacity = 1 - dist / this.connectionDistance;
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(247, 209, 0, ${opacity * 0.25})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    destroy() {
        cancelAnimationFrame(this.animationId);
    }
}

// Auto-init
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        new ParticleNetwork(canvas);
    }
}

document.addEventListener('DOMContentLoaded', initParticles);

export { ParticleNetwork, initParticles };
