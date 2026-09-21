import React from 'react';
import { ArrowRight, Layers, ShieldCheck, Box, Cpu, Sparkles } from 'lucide-react';

export default function HeroSection({ workshop, onSelectTrack }) {
  const solidworksSeats = workshop?.solidworks_seats_left ?? 6;
  const altiumSeats = workshop?.altium_seats_left ?? 8;

  const scrollToReg = (trackName) => {
    if (onSelectTrack && trackName) onSelectTrack(trackName);
    const el = document.getElementById('registration-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-section" style={{ paddingTop: '140px', paddingBottom: '80px', position: 'relative', zIndex: 2 }}>
      <div className="page-container" style={{ textAlign: 'center' }}>
        {/* Pill Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '28px' }}>
          <span className="tag-badge enig-tag font-mono">
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#e2b768', display: 'inline-block' }} />
            FALL 2026 MECHATRONICS RESIDENCY • SILICON VALLEY & 4K STREAM
          </span>
        </div>

        {/* Hero Editorial Headline */}
        <h1 className="heading-hero" style={{ maxWidth: '980px', margin: '0 auto 24px' }}>
          Where Precision <span style={{ color: '#ff5722' }}>3D Mechanics</span>
          <br />
          Meets High-Frequency <span style={{ color: '#00e5ff' }}>Silicon</span>.
        </h1>

        {/* Subtitle */}
        <p
          style={{
            maxWidth: '720px',
            margin: '0 auto 40px',
            fontSize: 'clamp(1.05rem, 1.6vw, 1.25rem)',
            color: '#9aa5b8',
            fontWeight: 400,
            lineHeight: 1.6
          }}
        >
          Master the complete hardware lifecycle. Design thermal-tested CNC enclosures in <strong style={{ color: '#f3f4f8' }}>SolidWorks</strong>, route 12-layer impedance-controlled boards in <strong style={{ color: '#f3f4f8' }}>Altium Designer</strong>, and sync clearance models bi-directionally without friction.
        </p>

        {/* CTAs */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '60px' }}>
          <button
            onClick={() => scrollToReg('both_mechatronics')}
            className="btn-primary-lead"
            style={{ padding: '14px 32px', fontSize: '1rem' }}
          >
            <span>Reserve Workstation</span>
            <ArrowRight size={16} />
          </button>

          <a href="#tracks" className="btn-secondary-pro" style={{ padding: '14px 26px', fontSize: '0.95rem' }}>
            <span>Explore Syllabus & Tracks</span>
          </a>
        </div>

        {/* Live Lab Availability Strip */}
        <div
          style={{
            maxWidth: '620px',
            margin: '0 auto 60px',
            padding: '12px 20px',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 8px #10b981' }} />
            <span style={{ color: '#c4cad9', fontWeight: 500 }}>Live Workstation Availability:</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }} className="font-mono">
            <span style={{ color: '#ff7a50' }}>SolidWorks: <strong>{solidworksSeats} seats</strong></span>
            <span style={{ color: '#67eeff' }}>Altium: <strong>{altiumSeats} seats</strong></span>
          </div>
        </div>

        {/* 4 Architectural Engineering Metric Blocks */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}
        >
          <div className="pro-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--sw-subtle)', border: '1px solid var(--sw-border)' }}>
                <Box size={18} color="#ff5722" />
              </div>
              <span className="font-mono" style={{ fontSize: '0.78rem', color: '#ff7a50', fontWeight: 600 }}>01 // MCAD</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Parametric Surfacing & DFM</h3>
            <p style={{ fontSize: '0.86rem', color: '#8c96a8', lineHeight: 1.5 }}>
              Sheet metal bending allowances, injection-molding draft angles, and thermal FEA under high compute loads.
            </p>
          </div>

          <div className="pro-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'var(--alt-subtle)', border: '1px solid var(--alt-border)' }}>
                <Cpu size={18} color="#00e5ff" />
              </div>
              <span className="font-mono" style={{ fontSize: '0.78rem', color: '#00e5ff', fontWeight: 600 }}>02 // ECAD</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>High-Speed Signal Integrity</h3>
            <p style={{ fontSize: '0.86rem', color: '#8c96a8', lineHeight: 1.5 }}>
              Controlled impedance stackup, DDR5 serpentine delay tuning, return-path vias, and 56Gbps SerDes routing.
            </p>
          </div>

          <div className="pro-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(124, 58, 237, 0.12)', border: '1px solid rgba(124, 58, 237, 0.35)' }}>
                <Layers size={18} color="#a78bfa" />
              </div>
              <span className="font-mono" style={{ fontSize: '0.78rem', color: '#a78bfa', fontWeight: 600 }}>03 // CO-DESIGN</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Bi-Directional IDX 3.0</h3>
            <p style={{ fontSize: '0.86rem', color: '#8c96a8', lineHeight: 1.5 }}>
              Real-time push/pull changesets between mechanical and electrical CAD with automated 3D collision prevention.
            </p>
          </div>

          <div className="pro-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
              <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.35)' }}>
                <ShieldCheck size={18} color="#10b981" />
              </div>
              <span className="font-mono" style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600 }}>04 // FABRICATION</span>
            </div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Physical Hardware Kit</h3>
            <p style={{ fontSize: '0.86rem', color: '#8c96a8', lineHeight: 1.5 }}>
              Every participant receives an assembled custom board, CNC-machined anodized aluminum housing, and verified templates.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
