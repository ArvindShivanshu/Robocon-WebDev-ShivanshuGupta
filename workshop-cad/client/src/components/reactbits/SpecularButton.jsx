import React, { useRef, useState } from 'react';

export default function SpecularButton({
  children,
  onClick,
  variant = 'primary', // 'primary', 'secondary', 'ghost'
  className = '',
  style = {},
  disabled = false,
  type = 'button'
}) {
  const buttonRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    if (!buttonRef.current || disabled) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const isPrimary = variant === 'primary';

  const baseStyle = isPrimary
    ? {
        background: isHovered
          ? 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)'
          : 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
        color: '#ffffff',
        border: isHovered ? '1px solid rgba(56, 189, 248, 0.55)' : '1px solid rgba(15, 23, 42, 0.9)',
        boxShadow: isHovered
          ? '0 0 24px -2px rgba(2, 132, 199, 0.42), 0 6px 20px rgba(15, 23, 42, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.25)'
          : '0 2px 8px rgba(15, 23, 42, 0.18), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
      }
    : {
        background: isHovered ? '#f1f5f9' : '#ffffff',
        color: isHovered ? '#0284c7' : '#0f172a',
        border: isHovered ? '1px solid #0284c7' : '1px solid var(--border-medium)',
        boxShadow: isHovered
          ? '0 0 18px -2px rgba(2, 132, 199, 0.2), 0 2px 8px rgba(0, 0, 0, 0.05)'
          : '0 1px 3px rgba(0, 0, 0, 0.04)'
      };

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`specular-button ${variant} ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '9px',
        padding: '12px 24px',
        borderRadius: '10px',
        fontFamily: 'var(--font-main)',
        fontSize: '0.92rem',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        cursor: disabled ? 'not-allowed' : 'pointer',
        overflow: 'hidden',
        transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        transform: 'none',
        ...baseStyle,
        ...style
      }}
    >
      {/* Specular Radial Glare Overlay */}
      {isHovered && !disabled && (
        <span
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: isPrimary
              ? `radial-gradient(130px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 229, 255, 0.25), transparent 75%)`
              : `radial-gradient(120px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 255, 255, 0.16), transparent 70%)`,
            zIndex: 1,
            transition: 'opacity 0.2s ease'
          }}
        />
      )}

      {/* Button Content */}
      <span
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}
      >
        {children}
      </span>
    </button>
  );
}
