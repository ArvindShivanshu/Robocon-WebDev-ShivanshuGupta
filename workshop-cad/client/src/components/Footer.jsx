import React from 'react';
import { Box } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(5, 5, 12, 0.95)',
        padding: '50px 0 30px',
        position: 'relative',
        zIndex: 2
      }}
    >
      <div className="page-container">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '32px'
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '7px',
                  background: '#12141e',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Box size={15} color="#ff5722" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#fff' }}>
                <span className="desktop-text">SOLIDWORKS <span style={{ color: '#626d82' }}>✕</span> ALTIUM</span>
                <span className="mobile-text">SW ✕ ALT</span>
              </span>
            </div>
            <p style={{ color: '#8e96aa', fontSize: '0.84rem', maxWidth: '480px' }}>
              The definitive hardware co-design fellowship for mechanical and electronic engineers.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.8rem',
            color: '#64748b'
          }}
        >
          <div>
            © 2026 SolidWorks ✕ Altium Co-Design Academy. All rights reserved.
          </div>
          <div>
            Silicon Valley, CA • Hardware Engineering Residency
          </div>
        </div>
      </div>
    </footer>
  );
}
