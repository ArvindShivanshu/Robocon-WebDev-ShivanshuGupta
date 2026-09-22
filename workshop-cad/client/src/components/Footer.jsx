import React from 'react';
import { Box } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: '#ffffff',
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
                  background: '#ffffff',
                  border: '1px solid var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                }}
              >
                <Box size={15} color="#ea580c" />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>
                <span className="desktop-text">SOLIDWORKS <span style={{ color: '#94a3b8' }}>✕</span> ALTIUM</span>
                <span className="mobile-text">SW ✕ ALT</span>
              </span>
            </div>
            <p style={{ color: '#475569', fontSize: '0.84rem', maxWidth: '480px' }}>
              The definitive hardware co-design fellowship for mechanical and electronic engineers.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            borderTop: '1px solid var(--border-subtle)',
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
