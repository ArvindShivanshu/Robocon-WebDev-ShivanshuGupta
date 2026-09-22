import React from 'react';

export default function StarBorder({
  as: Component = 'div',
  className = '',
  color = '#e2b768',
  speed = '4s',
  children,
  style = {},
  ...props
}) {
  return (
    <Component
      className={`star-border-container ${className}`}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        padding: '1.5px',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        boxSizing: 'border-box',
        ...style
      }}
      {...props}
    >
      {/* Animated Traveling Gradient Border */}
      <div
        className="star-border-glow"
        style={{
          position: 'absolute',
          inset: '-100%',
          background: `conic-gradient(from 0deg, transparent 0deg 320deg, ${color} 360deg)`,
          animation: `star-border-spin ${speed} linear infinite`,
          zIndex: 0
        }}
      />
      {/* Inner Content Surface */}
      <div
        style={{
          position: 'relative',
          borderRadius: '14.5px',
          background: '#ffffff',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          zIndex: 1,
          boxSizing: 'border-box'
        }}
      >
        {children}
      </div>
    </Component>
  );
}
