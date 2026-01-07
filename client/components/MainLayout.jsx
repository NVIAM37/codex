import React, { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom"; // IMPORTANT for rendering child routes
import { createNoise3D } from "simplex-noise";

// Import shared components
import Navbar from './Navbar';
import EnhancedFooter from './EnhancedFooter';

// Import the layout's specific CSS
import './MainLayout.css';
const MainLayout = () => {
  const canvasRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ULTRA OPTIMIZED: Reduced particle count to 50 for zero-lag
    const particleCount = 50, baseHue = 195, rangeHue = 40, backgroundColor = "#000000";
    const particlePropCount = 9, particlePropsLength = particleCount * particlePropCount;
    const rangeY = 100, baseTTL = 50, rangeTTL = 150, baseSpeed = 0.1, rangeSpeed = 1.5;
    const baseRadius = 1, rangeRadius = 2, noiseSteps = 3, xOff = 0.00125, yOff = 0.00125, zOff = 0.0005;
    let tick = 0, particleProps = new Float32Array(particlePropsLength), center = [0, 0];
    const noise3D = createNoise3D();

    const rand = (n) => n * Math.random();
    const randRange = (n) => n - rand(2 * n);
    const fadeInOut = (t, m) => { let hm = 0.5 * m; return Math.abs(((t + hm) % m) - hm) / hm; };
    const lerp = (n1, n2, speed) => (1 - speed) * n1 + speed * n2;

    const setup = () => {
      const ctx = canvas.getContext("2d", { alpha: false });
      if (ctx) {
        resize(canvas);
        initParticles();
        draw(canvas, ctx);
      }
    };

    const initParticles = () => { tick = 0; for (let i = 0; i < particlePropsLength; i += particlePropCount) { initParticle(i); } };

    const initParticle = (i) => {
      let x, y, life, ttl, speed, radius, hue;
      x = rand(canvas.width);
      y = center[1] + randRange(rangeY);
      life = 0;
      ttl = baseTTL + rand(rangeTTL);
      speed = baseSpeed + rand(rangeSpeed);
      radius = baseRadius + rand(rangeRadius);
      hue = baseHue + rand(rangeHue);
      particleProps.set([x, y, 0, 0, life, ttl, speed, radius, hue], i);
    };

    const draw = (canvas, ctx) => {
      tick++;
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawParticles(ctx);
      // Removed light glow/blur for performance
      renderToScreen(canvas, ctx);
      window.requestAnimationFrame(() => draw(canvas, ctx));
    };

    const drawParticles = (ctx) => { for (let i = 0; i < particlePropsLength; i += particlePropCount) { updateParticle(i, ctx); } };

    const updateParticle = (i, ctx) => {
      let i2 = 1 + i, i3 = 2 + i, i4 = 3 + i, i5 = 4 + i, i6 = 5 + i, i7 = 6 + i, i8 = 7 + i, i9 = 8 + i;
      let n, x, y, vx, vy, life, ttl, speed, x2, y2, radius, hue;
      x = particleProps[i]; y = particleProps[i2];
      n = noise3D(x * xOff, y * yOff, tick * zOff) * noiseSteps * (2 * Math.PI);
      vx = lerp(particleProps[i3], Math.cos(n), 0.5);
      vy = lerp(particleProps[i4], Math.sin(n), 0.5);
      life = particleProps[i5]; ttl = particleProps[i6]; speed = particleProps[i7];
      x2 = x + vx * speed; y2 = y + vy * speed;
      radius = particleProps[i8]; hue = particleProps[i9];
      drawParticle(x, y, x2, y2, life, ttl, radius, hue, ctx);
      life++;
      particleProps[i] = x2; particleProps[i2] = y2; particleProps[i3] = vx; particleProps[i4] = vy; particleProps[i5] = life;
      (checkBounds(x, y, canvas) || life > ttl) && initParticle(i);
    };

    const drawParticle = (x, y, x2, y2, life, ttl, radius, hue, ctx) => {
      ctx.beginPath();
      ctx.strokeStyle = `hsla(${hue},100%,60%,${fadeInOut(life, ttl)})`;
      ctx.lineWidth = radius;
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    };

    const checkBounds = (x, y, canvas) => x > canvas.width || x < 0 || y > canvas.height || y < 0;

    const resize = (canvas) => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      center[0] = 0.5 * canvas.width;
      center[1] = 0.5 * canvas.height;
    };

    const renderToScreen = (canvas, ctx) => { ctx.drawImage(canvas, 0, 0); };

    setup();
    const handleResize = () => resize(canvas);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="main-layout-container">
      <canvas className="background-canvas" ref={canvasRef}></canvas>

      {/* The content wrapper holds everything that appears over the background */}
      <div className="content-wrapper">
        <Navbar />
        <main className="main-content">
          <Outlet />
        </main>
        <EnhancedFooter hideBg={location.pathname === '/login'} />

      </div>
    </div>
  );
};

export default MainLayout;