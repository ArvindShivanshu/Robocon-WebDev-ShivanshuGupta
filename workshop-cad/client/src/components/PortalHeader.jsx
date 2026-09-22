import React from 'react';
import { Box, Cpu, Layers, Ticket, Terminal, Activity, ArrowRight, ShieldCheck } from 'lucide-react';
import { ShinyText, Magnet, DecryptedText } from './reactbits';

export default function PortalHeader({
  activeWorkspace,
  onSelectWorkspace,
  seatsLeft = 14,
  onGoToRegister
}) {
  const getWorkspaceTitle = () => {
    switch (activeWorkspace) {
      case 'solidworks': return 'SOLIDWORKS 3D MCAD STUDIO';
      case 'altium': return 'ALTIUM DESIGNER 24 ECAD STUDIO';
      case 'codesign': return 'IDX 3.0 CO-DESIGN BRIDGE';
      case 'curriculum': return 'ENGINEERING TIMETABLE & SYLLABUS';
      case 'register': return 'WORKSTATION ENROLLMENT TERMINAL';
      case 'faculty': return 'LAB INSTRUCTORS & MENTORS';
      default: return 'WORKSTATION HUB // OVERVIEW';
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 800,
        background: 'rgba(9, 11, 16, 0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
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
        {/* Left: System Node Identity & Current Workspace Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => onSelectWorkspace('dashboard')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
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
                background: '#121520',
                border: '1px solid rgba(255, 255, 255, 0.14)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
              }}
            >
              <Box size={16} color="#ff5722" />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: '#ffffff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>SW ✕ ALTIUM</span>
                <span style={{ fontSize: '0.68rem', color: '#687385', fontWeight: 600 }}>// PORTAL</span>
              </div>
              <div className="font-mono" style={{ fontSize: '0.64rem', color: '#00e5ff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                <span>{getWorkspaceTitle()}</span>
              </div>
            </div>
          </button>
        </div>

        {/* Center: Live Engineering Telemetry Chips */}
        <div
          className="desktop-text font-mono"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '0.72rem',
            color: '#7b8798',
            background: 'rgba(255, 255, 255, 0.03)',
            padding: '5px 14px',
            borderRadius: '999px',
            border: '1px solid rgba(255, 255, 255, 0.06)'
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff5722' }} />
            <span>SOLIDWORKS SP2</span>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00e5ff' }} />
            <span>ALTIUM 24.3</span>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e2b768' }} />
            <span>IDX 3.0 LIVE</span>
          </span>
          <span style={{ color: 'rgba(255, 255, 255, 0.15)' }}>•</span>
          <span style={{ color: '#10b981', fontWeight: 600 }}>
            {seatsLeft} LAB BENCHES LEFT
          </span>
        </div>

        {/* Right: Quick Workspace Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeWorkspace !== 'register' && (
            <Magnet magnetStrength={0.25} padding={30}>
              <button
                onClick={() => onSelectWorkspace('register')}
                className="btn-primary-lead"
                style={{
                  padding: '7px 16px',
                  fontSize: '0.82rem',
                  borderRadius: '8px'
                }}
              >
                <Ticket size={13} />
                <ShinyText speed={3}>
                  <span>Reserve Workstation</span>
                </ShinyText>
              </button>
            </Magnet>
          )}

          {activeWorkspace !== 'dashboard' && (
            <button
              onClick={() => onSelectWorkspace('dashboard')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#cbd5e1',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Dashboard Hub
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
