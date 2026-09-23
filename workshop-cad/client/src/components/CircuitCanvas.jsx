import React, { useEffect, useRef } from 'react';

/**
 * Interactive High-Speed Silicon Circuit Traces Background
 * Replaces the static/square grid with authentic high-frequency PCB differential pairs,
 * SerDes serpentine delay lines, annular-ring vias, and glowing electrical signal pulses.
 * Styled with an elite light-mode palette (cyan SerDes + ENIG gold copper micro-accents).
 */
export default function CircuitCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // Mouse position for interactive trace illumination
    const mouse = { x: -1000, y: -1000, active: false };
    const pings = []; // Interactive test-point radar ripples

    const handleResize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.min(window.innerWidth || 1440, 2560);
      height = Math.min(window.innerHeight || 900, 1440);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      generateTraces();
    };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const handleClick = (e) => {
      pings.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 75,
        opacity: 0.7
      });
      if (pings.length > 8) pings.shift();
    };

    // Authentic High-Speed ECAD Route Generator
    let traces = [];
    const generateTraces = () => {
      traces = [];
      const traceCount = Math.max(12, Math.floor(width / 110));

      for (let i = 0; i < traceCount; i++) {
        const isCyan = i % 2 === 0;
        const isDiffPair = i % 3 === 0;
        const speed = 0.5 + Math.random() * 0.7;

        // Spread start anchors across the viewport perimeter or internal nodes
        const startX = (i / traceCount) * width + (Math.random() - 0.5) * 80;
        const startY = Math.random() * height;

        // Length and directional routing segments (45-degree chamfers)
        const seg1Len = 60 + Math.random() * 120;
        const angleDeg = [0, 45, -45, 90, -90, 135, -135, 180][Math.floor(Math.random() * 8)];
        const rad = (angleDeg * Math.PI) / 180;

        const p1 = { x: startX, y: startY };
        const p2 = {
          x: p1.x + Math.cos(rad) * seg1Len,
          y: p1.y + Math.sin(rad) * seg1Len
        };

        // 45° dog-leg turn to second waypoint
        const turnAngle = (angleDeg + (Math.random() > 0.5 ? 45 : -45)) * (Math.PI / 180);
        const seg2Len = 80 + Math.random() * 160;
        const p3 = {
          x: p2.x + Math.cos(turnAngle) * seg2Len,
          y: p2.y + Math.sin(turnAngle) * seg2Len
        };

        // Final run
        const finalAngle = (Math.random() > 0.5 ? 0 : turnAngle) * (Math.PI / 180);
        const seg3Len = 60 + Math.random() * 140;
        const p4 = {
          x: p3.x + Math.cos(finalAngle) * seg3Len,
          y: p3.y + Math.sin(finalAngle) * seg3Len
        };

        const pts = [p1, p2, p3, p4];

        // Calculate cumulative lengths for smooth signal packet travel
        let totalLength = 0;
        const lengths = [];
        for (let j = 0; j < pts.length - 1; j++) {
          const dist = Math.hypot(pts[j + 1].x - pts[j].x, pts[j + 1].y - pts[j].y);
          lengths.push(dist);
          totalLength += dist;
        }

        traces.push({
          pts,
          lengths,
          totalLength,
          isCyan,
          isDiffPair,
          speed,
          pulseProgress: Math.random(),
          viaStartR: 3.5,
          viaEndR: 3.0,
          color: isCyan ? 'rgba(8, 145, 178, ' : 'rgba(217, 119, 6, ',
          glowColor: isCyan ? '#06b6d4' : '#f59e0b'
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('click', handleClick);

    // Get point along polyline at distance
    const getPointAtDistance = (t, dist) => {
      let d = dist;
      for (let i = 0; i < t.lengths.length; i++) {
        const segLen = t.lengths[i];
        if (d <= segLen) {
          const ratio = segLen > 0 ? d / segLen : 0;
          return {
            x: t.pts[i].x + (t.pts[i + 1].x - t.pts[i].x) * ratio,
            y: t.pts[i].y + (t.pts[i + 1].y - t.pts[i].y) * ratio
          };
        }
        d -= segLen;
      }
      return t.pts[t.pts.length - 1];
    };

    let lastTime = performance.now();

    const render = (now) => {
      const dt = Math.min((now - lastTime) * 0.001, 0.05);
      lastTime = now;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Passive Precision PCB Traces & Vias
      traces.forEach((t) => {
        // Check cursor proximity to illuminate trace
        let minMouseDist = 9999;
        if (mouse.active) {
          for (let p of t.pts) {
            const d = Math.hypot(mouse.x - p.x, mouse.y - p.y);
            if (d < minMouseDist) minMouseDist = d;
          }
        }
        const hoverBoost = mouse.active && minMouseDist < 160 ? Math.max(0, 1 - minMouseDist / 160) : 0;

        const baseAlpha = 0.14 + hoverBoost * 0.35;
        const viaAlpha = 0.35 + hoverBoost * 0.45;

        // Primary trace line
        ctx.strokeStyle = `${t.color}${baseAlpha})`;
        ctx.lineWidth = hoverBoost > 0 ? 1.6 : 1.2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(t.pts[0].x, t.pts[0].y);
        for (let j = 1; j < t.pts.length; j++) {
          ctx.lineTo(t.pts[j].x, t.pts[j].y);
        }
        ctx.stroke();

        // If differential pair, draw matching companion trace with 6px offset
        if (t.isDiffPair) {
          ctx.strokeStyle = `${t.color}${baseAlpha * 0.8})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.moveTo(t.pts[0].x + 5, t.pts[0].y + 5);
          for (let j = 1; j < t.pts.length; j++) {
            ctx.lineTo(t.pts[j].x + 5, t.pts[j].y + 5);
          }
          ctx.stroke();
        }

        // Terminal Plated Vias with annular copper rings & central drill
        const startP = t.pts[0];
        const endP = t.pts[t.pts.length - 1];

        // Start via
        ctx.fillStyle = `${t.color}${viaAlpha})`;
        ctx.beginPath();
        ctx.arc(startP.x, startP.y, t.viaStartR + hoverBoost * 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc'; // drill hole matching core bg
        ctx.beginPath();
        ctx.arc(startP.x, startP.y, 1.2, 0, Math.PI * 2);
        ctx.fill();

        // End via
        ctx.fillStyle = `${t.color}${viaAlpha})`;
        ctx.beginPath();
        ctx.arc(endP.x, endP.y, t.viaEndR + hoverBoost * 1.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(endP.x, endP.y, 1.0, 0, Math.PI * 2);
        ctx.fill();

        // 2. High-Speed Signal Packet (Gliding Photons / SerDes Pulses)
        t.pulseProgress += (t.speed * (1 + hoverBoost * 0.8) * dt * 45) / t.totalLength;
        if (t.pulseProgress > 1) t.pulseProgress -= 1;

        const currentDist = t.pulseProgress * t.totalLength;
        const pulsePt = getPointAtDistance(t, currentDist);

        if (pulsePt) {
          // Packet head
          ctx.save();
          ctx.fillStyle = t.glowColor;
          ctx.shadowColor = t.glowColor;
          ctx.shadowBlur = hoverBoost > 0 ? 10 : 6;
          ctx.beginPath();
          ctx.arc(pulsePt.x, pulsePt.y, 1.8 + hoverBoost * 0.8, 0, Math.PI * 2);
          ctx.fill();

          // Packet trailing comet tail
          const tailDist = Math.max(0, currentDist - 16);
          const tailPt = getPointAtDistance(t, tailDist);
          if (tailPt) {
            ctx.strokeStyle = `${t.color}${0.35 + hoverBoost * 0.4})`;
            ctx.lineWidth = 2.2;
            ctx.beginPath();
            ctx.moveTo(tailPt.x, tailPt.y);
            ctx.lineTo(pulsePt.x, pulsePt.y);
            ctx.stroke();
          }
          ctx.restore();
        }
      });

      // 3. User Click Pings / Radar Wavefronts
      for (let k = pings.length - 1; k >= 0; k--) {
        const p = pings[k];
        p.radius += 55 * dt;
        p.opacity *= 0.94;

        ctx.strokeStyle = `rgba(8, 145, 178, ${p.opacity * 0.45})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (p.opacity < 0.03 || p.radius >= p.maxRadius) {
          pings.splice(k, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="circuit-canvas"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity: 0.9
      }}
      aria-hidden="true"
    />
  );
}
