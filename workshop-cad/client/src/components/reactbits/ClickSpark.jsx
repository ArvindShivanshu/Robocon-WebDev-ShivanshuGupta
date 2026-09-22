import React, { useRef, useEffect, useCallback } from 'react';

export default function ClickSpark({
  sparkColor = '#00e5ff',
  sparkSize = 10,
  sparkRadius = 20,
  sparkCount = 8,
  duration = 450,
  extraScale = 1.2,
  children,
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);
  const sparksRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = (timestamp) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();

      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = now - spark.startTime;
        if (elapsed >= duration) return false;

        const progress = elapsed / duration;
        // Ease out quadratic
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentRadius = spark.radius * easeProgress;
        const currentLength = spark.size * (1 - easeProgress);

        const x1 = spark.x + Math.cos(spark.angle) * currentRadius;
        const y1 = spark.y + Math.sin(spark.angle) * currentRadius;
        const x2 = spark.x + Math.cos(spark.angle) * (currentRadius + currentLength);
        const y2 = spark.y + Math.sin(spark.angle) * (currentRadius + currentLength);

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = spark.color;
        ctx.lineWidth = Math.max(1, 2 * (1 - progress));
        ctx.lineCap = 'round';
        ctx.shadowColor = spark.color;
        ctx.shadowBlur = 6;
        ctx.stroke();
        ctx.restore();

        return true;
      });

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [duration]);

  const handleClick = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // With fixed viewport-sized canvas, clientX and clientY match canvas pixel coordinates 1:1
    const x = e.clientX;
    const y = e.clientY;
    const now = performance.now();

    const colors = Array.isArray(sparkColor) ? sparkColor : [sparkColor, '#ff5722', '#e2b768', '#ffffff'];

    for (let i = 0; i < sparkCount; i++) {
      const baseAngle = (i * 2 * Math.PI) / sparkCount;
      const angle = baseAngle + (Math.random() - 0.5) * 0.4;
      const color = colors[Math.floor(Math.random() * colors.length)];
      sparksRef.current.push({
        x,
        y,
        angle,
        startTime: now,
        size: sparkSize * (0.8 + Math.random() * 0.4) * extraScale,
        radius: sparkRadius * (0.8 + Math.random() * 0.4) * extraScale,
        color
      });
    }
  }, [sparkColor, sparkCount, sparkSize, sparkRadius, extraScale]);

  useEffect(() => {
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [handleClick]);

  return (
    <div
      className={`click-spark-container ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100%',
        margin: 0,
        padding: 0,
        border: 'none',
        outline: 'none',
        ...style
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 99999,
          border: 'none',
          outline: 'none'
        }}
      />
      {children}
    </div>
  );
}
