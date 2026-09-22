import React from 'react';

export default function ShinyText({
  text,
  disabled = false,
  speed = 4,
  className = '',
  style = {},
  children
}) {
  const content = text || children;
  const animationDuration = `${speed}s`;

  return (
    <span
      className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}
      style={{
        display: 'inline-block',
        backgroundImage: 'linear-gradient(120deg, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.4) 100%)',
        backgroundSize: '200% 100%',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        animation: disabled ? 'none' : `shiny-sweep ${animationDuration} linear infinite`,
        ...style
      }}
    >
      {content}
    </span>
  );
}
