import React, { useState, useEffect } from 'react';
import { Box, Cpu, Layers, Ticket } from 'lucide-react';

export default function Navbar({ activeMode, setActiveMode, seatsLeft, onGoToRegister }) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (activeMode !== 'portal') {
      setActiveMode('portal');
      setTimeout(() => {
        const el = document.getElementById('registration-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      const el = document.getElementById('registration-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToSection = (id) => {
    if (activeMode !== 'portal') {
      setActiveMode('portal');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 120);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`floating-capsule-navbar ${isScrolled ? 'scrolled' : ''}`}
      style={{
        position: 'fixed',
        top: isScrolled ? '12px' : '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: isScrolled ? 'min(94%, 1240px)' : 'min(95%, 1300px)',
        padding: isScrolled ? '10px 24px' : '13px 28px',
        borderRadius: '9999px',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(226, 232, 240, 0.95)',
        boxShadow: isScrolled
          ? '0 12px 30px -6px rgba(15, 23, 42, 0.10), 0 4px 12px rgba(15, 23, 42, 0.04)'
          : '0 16px 42px -10px rgba(15, 23, 42, 0.08), 0 6px 18px rgba(15, 23, 42, 0.03)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        boxSizing: 'border-box'
      }}
    >
      {/* Left: Brand Logo */}
      <button
        onClick={() => {
          setActiveMode('portal');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          textDecoration: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: 0,
          flexShrink: 0
        }}
      >
        <div
          style={{
            width: isScrolled ? '30px' : '34px',
            height: isScrolled ? '30px' : '34px',
            borderRadius: '9px',
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(37, 99, 235, 0.30)',
            transition: 'all 0.3s ease'
          }}
        >
          <svg width={isScrolled ? 16 : 18} height={isScrolled ? 16 : 18} viewBox="0 0 24 24" fill="none">
            <path
              d="M7 7.5C7 5.567 8.567 4 10.5 4H15.5C17.433 4 19 5.567 19 7.5C19 9.433 17.433 11 15.5 11H10.5C8.567 11 7 12.567 7 14.5C7 16.433 8.567 18 10.5 18H15.5C17.433 18 19 16.433 19 14.5"
              stroke="#ffffff"
              strokeWidth="2.7"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <span
          style={{
            fontWeight: 750,
            fontSize: isScrolled ? '0.96rem' : '1.02rem',
            color: '#0f172a',
            letterSpacing: '-0.025em',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap'
          }}
        >
          SolidWorks <span style={{ color: '#94a3b8', fontWeight: 400 }}>✕</span> Altium
        </span>
      </button>

      {/* Center 1: Studio Page Navigation (SolidWorks 3D, Altium ECAD, CoDesigner) */}
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          background: '#f1f5f9',
          padding: '3px',
          borderRadius: '9999px',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          gap: '2px',
          flexShrink: 0
        }}
      >
        <button
          onClick={() => setActiveMode(activeMode === 'solidworks' ? 'portal' : 'solidworks')}
          style={{
            padding: isScrolled ? '5px 11px' : '6px 13px',
            borderRadius: '9999px',
            border: 'none',
            background: activeMode === 'solidworks' ? '#fff2ed' : 'transparent',
            color: activeMode === 'solidworks' ? '#ea580c' : '#64748b',
            boxShadow: activeMode === 'solidworks' ? '0 1px 3px rgba(234, 88, 12, 0.15)' : 'none',
            fontSize: isScrolled ? '0.76rem' : '0.80rem',
            fontWeight: 650,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <Box size={13} color="#ea580c" />
          <span>SolidWorks 3D</span>
        </button>

        <button
          onClick={() => setActiveMode(activeMode === 'altium' ? 'portal' : 'altium')}
          style={{
            padding: isScrolled ? '5px 11px' : '6px 13px',
            borderRadius: '9999px',
            border: 'none',
            background: activeMode === 'altium' ? '#e0f2fe' : 'transparent',
            color: activeMode === 'altium' ? '#0284c7' : '#64748b',
            boxShadow: activeMode === 'altium' ? '0 1px 3px rgba(2, 132, 199, 0.15)' : 'none',
            fontSize: isScrolled ? '0.76rem' : '0.80rem',
            fontWeight: 650,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <Cpu size={13} color="#0284c7" />
          <span>Altium ECAD</span>
        </button>

        <button
          onClick={() => setActiveMode(activeMode === 'codesign' ? 'portal' : 'codesign')}
          style={{
            padding: isScrolled ? '5px 11px' : '6px 13px',
            borderRadius: '9999px',
            border: 'none',
            background: activeMode === 'codesign' ? '#fef3c7' : 'transparent',
            color: activeMode === 'codesign' ? '#b45309' : '#64748b',
            boxShadow: activeMode === 'codesign' ? '0 1px 3px rgba(180, 83, 9, 0.15)' : 'none',
            fontSize: isScrolled ? '0.76rem' : '0.80rem',
            fontWeight: 650,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease',
            whiteSpace: 'nowrap'
          }}
        >
          <Layers size={13} color="#b45309" />
          <span>CoDesigner</span>
        </button>
      </nav>

      {/* Center 2: Section Jump Links (Tracks, Syllabus, Simulator FIXED) */}
      <nav
        className="desktop-text"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isScrolled ? '18px' : '22px',
          transition: 'gap 0.3s ease'
        }}
      >
        {[
          { label: 'TRACKS', id: 'tracks' },
          { label: 'SYLLABUS', id: 'curriculum' },
          { label: 'SIMULATOR', id: 'simulator' } // Correct ID for interactive simulator section!
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => scrollToSection(item.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '6px 0',
              fontFamily: 'var(--font-main)',
              fontSize: isScrolled ? '0.76rem' : '0.80rem',
              fontWeight: 650,
              letterSpacing: '0.05em',
              color: '#475569',
              cursor: 'pointer',
              transition: 'color 0.15s ease',
              textTransform: 'uppercase',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#0f172a')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right Action: Single clean primary pill button */}
      <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <button
          onClick={handleRegisterClick}
          style={{
            background: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: isScrolled ? '8px 18px' : '10px 22px',
            fontSize: isScrolled ? '0.82rem' : '0.86rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.28)',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1d4ed8';
            e.currentTarget.style.boxShadow = '0 0 22px rgba(37, 99, 235, 0.55), 0 4px 14px rgba(37, 99, 235, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#2563eb';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.28)';
          }}
        >
          <Ticket size={13} />
          <span>Reserve Free Seat</span>
        </button>
      </div>
    </header>
  );
}
