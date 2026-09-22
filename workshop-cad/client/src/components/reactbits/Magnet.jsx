import React, { useRef, useState } from 'react';

export default function Magnet({
  children,
  padding = 40,
  disabled = false,
  magnetStrength = 0.35,
  className = '',
  style = {}
}) {
  const containerRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (disabled || !containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    const distance = Math.hypot(distX, distY);
    const maxDistance = Math.max(width, height) / 2 + padding;

    if (distance < maxDistance) {
      setPosition({
        x: distX * magnetStrength,
        y: distY * magnetStrength
      });
    } else {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnet-wrapper ${className}`}
      style={{
        display: 'inline-block',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 && position.y === 0 ? 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'transform 0.1s ease-out',
        willChange: 'transform',
        ...style
      }}
    >
      {children}
    </div>
  );
}
