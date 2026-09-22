import React, { useRef, useState, useEffect } from 'react';

export default function Dock({
  items = [],
  baseItemSize = 44,
  maxItemSize = 64,
  distance = 120,
  activeId,
  onSelect,
  className = '',
  style = {}
}) {
  const dockRef = useRef(null);
  const [mouseX, setMouseX] = useState(null);
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const handleMouseMove = (e) => {
    if (!dockRef.current) return;
    const rect = dockRef.current.getBoundingClientRect();
    setMouseX(e.clientX - rect.left);
  };

  const handleMouseLeave = () => {
    setMouseX(null);
    setHoveredIdx(null);
  };

  // Keyboard shortcut listener (1-7)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if typing in an input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= items.length) {
        e.preventDefault();
        const targetItem = items[num - 1];
        if (targetItem && onSelect) {
          onSelect(targetItem.id);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [items, onSelect]);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '22px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        pointerEvents: 'auto',
        ...style
      }}
      className={`dock-outer-wrapper ${className}`}
    >
      <nav
        ref={dockRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        aria-label="Workshop Workspaces Dock"
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '24px',
          background: 'rgba(13, 15, 22, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 16px 40px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
          transition: 'all 0.2s ease'
        }}
      >
        {items.map((item, idx) => {
          const isActive = activeId === item.id;
          let size = baseItemSize;

          if (mouseX !== null && dockRef.current) {
            const itemElements = dockRef.current.children;
            if (itemElements[idx]) {
              const rect = itemElements[idx].getBoundingClientRect();
              const dockRect = dockRef.current.getBoundingClientRect();
              const itemCenterX = rect.left - dockRect.left + rect.width / 2;
              const dist = Math.abs(mouseX - itemCenterX);

              if (dist < distance) {
                const factor = 1 - dist / distance;
                size = baseItemSize + (maxItemSize - baseItemSize) * Math.sin((factor * Math.PI) / 2);
              }
            }
          }

          return (
            <div
              key={item.id}
              style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Tooltip on hover */}
              {hoveredIdx === idx && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: 'calc(100% + 10px)',
                    padding: '4px 9px',
                    borderRadius: '6px',
                    background: '#090a0f',
                    border: '1px solid rgba(255, 255, 255, 0.16)',
                    color: '#ffffff',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.6)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    pointerEvents: 'none',
                    zIndex: 999
                  }}
                >
                  <span>{item.label}</span>
                  <span
                    className="font-mono"
                    style={{
                      fontSize: '0.62rem',
                      padding: '1px 4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '3px',
                      color: '#8b98ac'
                    }}
                  >
                    {idx + 1}
                  </span>
                </div>
              )}

              {/* Dock Icon Button */}
              <button
                onClick={() => onSelect && onSelect(item.id)}
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isActive
                    ? item.accentBg || 'rgba(255, 255, 255, 0.12)'
                    : 'rgba(255, 255, 255, 0.04)',
                  border: isActive
                    ? `1px solid ${item.accentColor || '#ffffff'}`
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isActive ? item.accentColor || '#ffffff' : '#94a0b2',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 0.2s ease, border-color 0.2s ease, color 0.2s ease',
                  boxShadow: isActive
                    ? `0 0 16px ${item.accentColor ? `${item.accentColor}33` : 'rgba(255, 255, 255, 0.2)'}`
                    : 'none'
                }}
                title={item.label}
              >
                {item.icon}
              </button>

              {/* Active Dot Indicator */}
              <div
                style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: isActive ? (item.accentColor || '#ffffff') : 'transparent',
                  marginTop: '4px',
                  transition: 'background 0.2s ease'
                }}
              />
            </div>
          );
        })}
      </nav>
    </div>
  );
}
