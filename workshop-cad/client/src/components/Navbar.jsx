import React from 'react';
import { Box, Cpu, Layers, Home, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Navbar({ activeMode, setActiveMode, seatsLeft, onGoToRegister }) {
  const handleRegisterClick = (e) => {
    e.preventDefault();
    if (activeMode !== 'portal') {
      setActiveMode('portal');
      setTimeout(() => {
        const el = document.getElementById('registration-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('registration-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(7, 8, 12, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '10px 0',
        transition: 'all 0.2s ease'
      }}
    >
      <div
        className="page-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        {/* Brand Logo & Route Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setActiveMode('portal')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              textDecoration: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: '#141722',
                border: '1px solid var(--border-medium)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0,0,0,0.4)'
              }}
            >
              <Box size={16} color="#ff5722" />
            </div>
            <span style={{ fontWeight: 800, fontSize: '0.98rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
              <span className="desktop-text">SOLIDWORKS <span style={{ color: '#626d82' }}>✕</span> ALTIUM</span>
              <span className="mobile-text">SW ✕ ALT</span>
            </span>
          </button>
        </div>

        {/* Center: Integrated Studio Mode Switcher */}
        <nav
          className="nav-mode-switcher"
          style={{
            display: 'flex',
            alignItems: 'center',
            background: '#0e1017',
            padding: '3px',
            borderRadius: '9px',
            border: '1px solid var(--border-subtle)',
            gap: '2px'
          }}
        >
          <button
            onClick={() => setActiveMode('portal')}
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              border: 'none',
              background: activeMode === 'portal' ? '#1c202e' : 'transparent',
              color: activeMode === 'portal' ? '#fff' : '#8c96a8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Home size={13} />
            <span className="desktop-text">Workshop Portal</span>
            <span className="mobile-text">Portal</span>
          </button>

          <button
            onClick={() => setActiveMode('solidworks')}
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              border: 'none',
              background: activeMode === 'solidworks' ? 'rgba(255, 87, 34, 0.15)' : 'transparent',
              color: activeMode === 'solidworks' ? '#ff7a50' : '#8c96a8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Box size={13} color="#ff5722" />
            <span className="desktop-text">SolidWorks 3D CAD</span>
            <span className="mobile-text">SolidWorks</span>
          </button>

          <button
            onClick={() => setActiveMode('altium')}
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              border: 'none',
              background: activeMode === 'altium' ? 'rgba(0, 229, 255, 0.15)' : 'transparent',
              color: activeMode === 'altium' ? '#00e5ff' : '#8c96a8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Cpu size={13} color="#00e5ff" />
            <span className="desktop-text">Altium ECAD</span>
            <span className="mobile-text">Altium</span>
          </button>

          <button
            onClick={() => setActiveMode('codesign')}
            style={{
              padding: '6px 12px',
              borderRadius: '7px',
              border: 'none',
              background: activeMode === 'codesign' ? 'rgba(226, 183, 104, 0.15)' : 'transparent',
              color: activeMode === 'codesign' ? '#e2b768' : '#8c96a8',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease'
            }}
          >
            <Layers size={13} color="#e2b768" />
            <span className="desktop-text">CoDesigner Sync</span>
            <span className="mobile-text">CoDesign</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
