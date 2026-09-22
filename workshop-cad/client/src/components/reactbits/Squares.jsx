import React, { useRef, useEffect } from 'react';

export default function Squares({
  direction = 'diagonal',
  speed = 0.5,
  borderColor = 'rgba(255, 255, 255, 0.05)',
  squareSize = 44,
  hoverFillColor = 'rgba(0, 229, 255, 0.08)',
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);
  const gridOffset = useRef({ x: 0, y: 0 });
  const mousePos = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const resize = () => {
      canvas.width = canvas.parentElement ? canvas.parentElement.clientWidth : window.innerWidth;
      canvas.height = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: -1000, y: -1000 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Animate drift
      const moveSpeed = speed * 0.4;
      if (direction === 'diagonal') {
        gridOffset.current.x = (gridOffset.current.x + moveSpeed) % squareSize;
        gridOffset.current.y = (gridOffset.current.y + moveSpeed) % squareSize;
      } else if (direction === 'right') {
        gridOffset.current.x = (gridOffset.current.x + moveSpeed) % squareSize;
      } else if (direction === 'left') {
        gridOffset.current.x = (gridOffset.current.x - moveSpeed) % squareSize;
      } else if (direction === 'down') {
        gridOffset.current.y = (gridOffset.current.y + moveSpeed) % squareSize;
      } else if (direction === 'up') {
        gridOffset.current.y = (gridOffset.current.y - moveSpeed) % squareSize;
      }

      const numCols = Math.ceil(canvas.width / squareSize) + 2;
      const numRows = Math.ceil(canvas.height / squareSize) + 2;

      const offX = gridOffset.current.x - squareSize;
      const offY = gridOffset.current.y - squareSize;

      // Draw squares
      for (let col = 0; col < numCols; col++) {
        for (let row = 0; row < numRows; row++) {
          const x = col * squareSize + offX;
          const y = row * squareSize + offY;

          // Check mouse proximity
          const cx = x + squareSize / 2;
          const cy = y + squareSize / 2;
          const dist = Math.hypot(mousePos.current.x - cx, mousePos.current.y - cy);

          if (dist < squareSize * 2.2) {
            const alphaFactor = Math.max(0, 1 - dist / (squareSize * 2.2));
            ctx.fillStyle = hoverFillColor;
            ctx.globalAlpha = alphaFactor;
            ctx.fillRect(x, y, squareSize, squareSize);

            // Subtle highlight crosshairs
            ctx.strokeStyle = 'rgba(0, 229, 255, 0.25)';
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, squareSize, squareSize);
            ctx.globalAlpha = 1.0;
          }

          // Subtle grid line
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, squareSize, squareSize);
        }
      }

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, [direction, speed, borderColor, squareSize, hoverFillColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`squares-canvas ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style
      }}
    />
  );
}
