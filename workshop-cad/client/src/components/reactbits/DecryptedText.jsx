import React, { useState, useEffect, useRef } from 'react';

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+-/=?@_~[]{}';

export default function DecryptedText({
  text = '',
  speed = 40,
  maxIterations = 10,
  sequential = true,
  revealDirection = 'start',
  characters = DEFAULT_CHARS,
  animateOn = 'view',
  className = '',
  encryptedClassName = 'font-mono text-cyan-glow',
  parentClassName = '',
  style = {}
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);
  const iterationRef = useRef(0);

  const startAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    iterationRef.current = 0;
    setIsDecrypted(false);

    const length = text.length;
    const splitText = text.split('');

    intervalRef.current = setInterval(() => {
      iterationRef.current += 1;
      const progress = iterationRef.current;

      setDisplayText(() => {
        return splitText
          .map((char, index) => {
            if (char === ' ') return ' ';

            let isRevealed = false;
            if (sequential) {
              const revealIndex =
                revealDirection === 'end'
                  ? length - Math.floor((progress / maxIterations) * length)
                  : Math.floor((progress / maxIterations) * length);

              isRevealed = revealDirection === 'end' ? index >= revealIndex : index <= revealIndex;
            } else {
              isRevealed = progress >= maxIterations;
            }

            if (isRevealed) {
              return char;
            }

            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join('');
      });

      if (iterationRef.current >= maxIterations) {
        clearInterval(intervalRef.current);
        setDisplayText(text);
        setIsDecrypted(true);
      }
    }, speed);
  };

  useEffect(() => {
    if (animateOn === 'view') {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            startAnimation();
          }
        },
        { threshold: 0.2 }
      );

      if (containerRef.current) observer.observe(containerRef.current);

      return () => {
        if (containerRef.current) observer.unobserve(containerRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    } else {
      startAnimation();
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [text, animateOn]);

  return (
    <span
      ref={containerRef}
      onMouseEnter={animateOn === 'hover' ? startAnimation : undefined}
      className={`decrypted-text-wrapper ${parentClassName}`}
      style={{ display: 'inline-block', ...style }}
    >
      <span className={isDecrypted ? className : `${className} ${encryptedClassName}`}>
        {displayText}
      </span>
    </span>
  );
}
