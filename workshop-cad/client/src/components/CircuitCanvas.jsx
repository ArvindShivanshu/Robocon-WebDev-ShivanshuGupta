import React, { useEffect, useRef } from 'react';

export default function CircuitCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates for subtle CAD inspection crosshair
    let mouse = { x: -100, y: -100 };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Authentic PCB Differential Pair Traces
    const traces = [];
    const traceCount = 14;

    for (let i = 0; i < traceCount; i++) {
      const startX = Math.random() * width;
      const startY = Math.random() * height;
      const length = Math.random() * 260 + 140;
      const angleChoice = [0, 45, 90, 135, 180, 225, 270, 315][Math.floor(Math.random() * 8)];
      const rad = (angleChoice * Math.PI) / 180;
      const endX = startX + Math.cos(rad) * length;
      const endY = startY + Math.sin(rad) * length;

      traces.push({
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
        isAltium: i % 2 === 0, // cyan vs warm amber/gold
        viaRadius: Math.random() > 0.4 ? 3.5 : 2,
        pulseOffset: Math.random() * 100
      });
    }

    let frame = 0;
    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // 1. Crisp EDA / CAD Dot Grid (Millimeter spacing)
      const dotSpacing = 36;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (let x = 0; x < width; x += dotSpacing) {
        for (let y = 0; y < height; y += dotSpacing) {
          ctx.fillRect(x, y, 1.2, 1.2);
        }
      }

      // 2. Render Precise Orthogonal & 45° PCB Traces
      traces.forEach((t) => {
        const traceColor = t.isAltium
          ? 'rgba(0, 229, 255, 0.16)'
          : 'rgba(226, 183, 104, 0.16)';
        const viaColor = t.isAltium
          ? 'rgba(0, 229, 255, 0.35)'
          : 'rgba(226, 183, 104, 0.35)';

        // Trace line
        ctx.strokeStyle = traceColor;
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(t.x1, t.y1);

        // 45-degree dog-leg intermediate point
        const midX = (t.x1 + t.x2) / 2;
        ctx.lineTo(midX, t.y1);
        ctx.lineTo(t.x2, t.y2);
        ctx.stroke();

        // Terminal Plated Vias (Through-hole / ENIG pad)
        ctx.fillStyle = viaColor;
        ctx.beginPath();
        ctx.arc(t.x1, t.y1, t.viaRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(t.x2, t.y2, t.viaRadius, 0, Math.PI * 2);
        ctx.fill();

        // High-speed signal pulse packet
        const progress = ((frame * 0.8 + t.pulseOffset) % 150) / 150;
        if (progress < 1) {
          const px = t.x1 + (t.x2 - t.x1) * progress;
          const py = t.y1 + (t.y2 - t.y1) * progress;
          ctx.fillStyle = t.isAltium ? '#00e5ff' : '#e2b768';
          ctx.shadowBlur = 6;
          ctx.shadowColor = t.isAltium ? '#00e5ff' : '#e2b768';
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      // 3. Subtle CAD Coordinate Inspection Cursor (Non-intrusive)
      if (mouse.x > 0 && mouse.y > 0) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;

        ctx.beginPath();
        ctx.moveTo(mouse.x - 18, mouse.y);
        ctx.lineTo(mouse.x + 18, mouse.y);
        ctx.moveTo(mouse.x, mouse.y - 18);
        ctx.lineTo(mouse.x, mouse.y + 18);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas id="circuit-canvas" ref={canvasRef} />;
}
