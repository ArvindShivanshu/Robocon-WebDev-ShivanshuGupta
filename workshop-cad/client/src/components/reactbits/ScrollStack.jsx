import React, { useRef, useEffect, useState, useCallback } from 'react';

/**
 * ScrollStack from reactbits.dev
 * Pinned cards that stack, turn, and dissolve with depth as the user scrolls down the page.
 */
export const ScrollStackItem = ({ children, className = '', style = {} }) => (
  <div
    className={`scroll-stack-item ${className}`.trim()}
    style={{
      position: 'relative',
      width: '100%',
      transformOrigin: 'top center',
      willChange: 'transform, opacity, filter',
      backfaceVisibility: 'hidden',
      ...style
    }}
  >
    {children}
  </div>
);

export default function ScrollStack({
  children,
  className = '',
  itemDistance = 30, // vertical distance between stacked cards
  itemScale = 0.04, // scale reduction per stacked card depth
  baseScale = 0.92,
  blurAmount = 2,
  style = {}
}) {
  const containerRef = useRef(null);
  const [activeCards, setActiveCards] = useState([]);

  const updateTransforms = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const cards = Array.from(container.querySelectorAll('.scroll-stack-item'));
    if (!cards.length) return;

    const viewportHeight = window.innerHeight || 800;
    const triggerOffset = viewportHeight * 0.25;

    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cardTop = rect.top;

      // Calculate if card has reached the sticky stack position
      const isPinned = cardTop <= triggerOffset;
      const progress = Math.min(1, Math.max(0, (triggerOffset - cardTop) / (viewportHeight * 0.4)));

      if (isPinned && i < cards.length - 1) {
        const targetScale = 1 - progress * (itemScale * (cards.length - i));
        const translateY = Math.min(0, (cardTop - triggerOffset) * 0.3);
        const blur = progress * blurAmount;

        card.style.transform = `translate3d(0, ${translateY}px, 0) scale(${targetScale})`;
        card.style.filter = blur > 0.5 ? `blur(${blur}px)` : 'none';
        card.style.opacity = `${Math.max(0.65, 1 - progress * 0.35)}`;
      } else {
        card.style.transform = 'translate3d(0, 0, 0) scale(1)';
        card.style.filter = 'none';
        card.style.opacity = '1';
      }
    });
  }, [itemDistance, itemScale, baseScale, blurAmount]);

  useEffect(() => {
    let animFrame = 0;
    const onScroll = () => {
      animFrame = requestAnimationFrame(updateTransforms);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    updateTransforms();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(animFrame);
    };
  }, [updateTransforms]);

  return (
    <div
      ref={containerRef}
      className={`scroll-stack-container ${className}`.trim()}
      style={{
        position: 'relative',
        width: '100%',
        ...style
      }}
    >
      {children}
    </div>
  );
}
