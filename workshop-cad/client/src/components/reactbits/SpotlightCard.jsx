import React, { useRef, useState } from 'react';

export default function SpotlightCard({
  children,
  className = '',
  spotlightColor = 'rgba(0, 229, 255, 0.15)',
  spotlightSize = 350,
  style = {},
  onClick
}) {
  const cardRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={`spotlight-card ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        ...style
      }}
    >
      {/* Radial Spotlight Beam */}
      <div
        className="spotlight-layer"
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          opacity: isHovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
          background: `radial-gradient(${spotlightSize}px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 80%)`,
          zIndex: 1
        }}
      />
      {/* Content wrapper */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          boxSizing: 'border-box'
        }}
      >
        {children}
      </div>
    </div>
  );
}
