import React, { useEffect, useRef } from 'react';

export const ParticleField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const mouse = { x: width / 2, y: height / 2, active: false };
    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', onLeave);

    const COUNT = Math.min(Math.floor((width * height) / 18000), 75);
    const particles = Array.from({ length: COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.6,
      alpha: Math.random() * 0.4 + 0.3,
    }));

    let rafId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep dark canvas background
      ctx.fillStyle = '#0b0813';
      ctx.fillRect(0, 0, width, height);

      // Ambient subtle gradient glow
      const bgGlow = ctx.createRadialGradient(width * 0.5, height * 0.15, 50, width * 0.5, height * 0.15, width * 0.7);
      bgGlow.addColorStop(0, 'rgba(124, 58, 237, 0.07)');
      bgGlow.addColorStop(0.6, 'rgba(56, 189, 248, 0.03)');
      bgGlow.addColorStop(1, 'rgba(11, 8, 19, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Mouse subtle aura
      if (mouse.active) {
        const pointerGlow = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 220);
        pointerGlow.addColorStop(0, 'rgba(167, 139, 250, 0.09)');
        pointerGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.03)');
        pointerGlow.addColorStop(1, 'rgba(11, 8, 19, 0)');
        ctx.fillStyle = pointerGlow;
        ctx.fillRect(mouse.x - 220, mouse.y - 220, 440, 440);
      }

      // Update & render particles
      for (const p of particles) {
        if (!reduceMotion) {
          if (mouse.active) {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            if (dist < 200) {
              const force = (1 - dist / 200) * 0.015;
              p.vx += (dx / dist) * force;
              p.vy += (dy / dist) * force;
            }
          }

          p.vx *= 0.98;
          p.vy *= 0.98;
          p.x += p.vx;
          p.y += p.vy;

          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(196, 181, 253, ${p.alpha})`;
        ctx.fill();
      }

      // Connect near particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d = Math.sqrt(dx * dx + dy * dy);

          if (d < 120) {
            ctx.strokeStyle = `rgba(167, 139, 250, ${0.12 * (1 - d / 120)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }

        // Pointer tether lines
        if (mouse.active) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 160) {
            ctx.strokeStyle = `rgba(56, 189, 248, ${0.2 * (1 - d / 160)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
