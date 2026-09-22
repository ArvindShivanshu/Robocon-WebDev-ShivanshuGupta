import React, { useEffect, useState, useRef } from 'react';

export default function BlurText({
  text = '',
  delay = 50,
  className = '',
  animateBy = 'words',
  style = {}
}) {
  const [inView, setInView] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    // Immediate fallback so text is always rendered even if IntersectionObserver is delayed
    const timer = setTimeout(() => setInView(true), 100);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const elements = animateBy === 'words' ? text.split(' ') : text.split('');

  return (
    <span
      ref={containerRef}
      className={`blur-text-wrapper ${className}`}
      style={{ display: 'inline', ...style }}
    >
      {elements.map((el, i) => (
        <span
          key={i}
          style={{
            display: 'inline-block',
            filter: inView ? 'blur(0px)' : 'blur(8px)',
            opacity: inView ? 1 : 0,
            transform: inView ? 'translateY(0)' : 'translateY(8px)',
            transition: `filter 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * delay}ms, opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * delay}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * delay}ms`,
            marginRight: animateBy === 'words' ? '0.28em' : '0'
          }}
        >
          {el}
        </span>
      ))}
    </span>
  );
}
