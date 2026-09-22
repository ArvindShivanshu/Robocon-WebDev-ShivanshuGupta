import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, Layers, ShieldCheck, Box, Cpu } from 'lucide-react';
import { SpotlightCard, SpecularButton, BlurText, ScrollCard } from './reactbits';

export default function HeroSection({ workshop, onSelectTrack }) {
  const solidworksSeats = workshop?.solidworks_seats_left ?? 6;
  const altiumSeats = workshop?.altium_seats_left ?? 8;
  const [headlineHover, setHeadlineHover] = useState(false);
  const [hoverCoords, setHoverCoords] = useState({ x: 0, y: 0 });
  const [descHover, setDescHover] = useState(false);
  const [descCoords, setDescCoords] = useState({ x: 0, y: 0 });

  const headlineRef = useRef(null);
  const descRef = useRef(null);

  const [headlineMask, setHeadlineMask] = useState({ reveal: 'none', base: 'none', active: false });
  const [descMask, setDescMask] = useState({ reveal: 'none', base: 'none', active: false });

  // Dynamic RAF loop: couples text illumination to BOTH direct cursor hover AND swirling black-purple fluid vortices
  useEffect(() => {
    let animId = 0;

    const updateMasks = () => {
      const splats = (typeof window !== 'undefined' && window.__FLUID_ACTIVE_SPLATS__) || [];

      // 1. Headline Mask calculation
      if (headlineRef.current) {
        const hRect = headlineRef.current.getBoundingClientRect();
        const hReveal = [];
        const hBase = [];

        if (headlineHover) {
          hReveal.push(`radial-gradient(circle 200px at ${hoverCoords.x}px ${hoverCoords.y}px, black 0%, black 50%, transparent 100%)`);
          hBase.push(`radial-gradient(circle 200px at ${hoverCoords.x}px ${hoverCoords.y}px, transparent 0%, transparent 45%, black 85%)`);
        }

        for (let i = 0; i < splats.length; i++) {
          const s = splats[i];
          const lx = Math.round(s.x - hRect.left);
          const ly = Math.round(s.y - hRect.top);
          if (lx > -s.radius && lx < hRect.width + s.radius && ly > -s.radius && ly < hRect.height + s.radius) {
            const r = Math.round(s.radius);
            const a = Math.min(1, s.opacity * 1.2).toFixed(2);
            hReveal.push(`radial-gradient(circle ${r}px at ${lx}px ${ly}px, rgba(0,0,0,${a}) 0%, rgba(0,0,0,${a}) 45%, transparent 100%)`);
            hBase.push(`radial-gradient(circle ${r}px at ${lx}px ${ly}px, transparent 0%, transparent 40%, black 85%)`);
          }
        }

        if (hReveal.length > 0) {
          setHeadlineMask({ reveal: hReveal.join(', '), base: hBase.join(', '), active: true });
        } else {
          setHeadlineMask((prev) => (prev.active ? { reveal: 'none', base: 'none', active: false } : prev));
        }
      }

      // 2. Description Subtitle Mask calculation
      if (descRef.current) {
        const dRect = descRef.current.getBoundingClientRect();
        const dReveal = [];
        const dBase = [];

        if (descHover) {
          dReveal.push(`radial-gradient(circle 160px at ${descCoords.x}px ${descCoords.y}px, black 0%, black 50%, transparent 100%)`);
          dBase.push(`radial-gradient(circle 160px at ${descCoords.x}px ${descCoords.y}px, transparent 0%, transparent 45%, black 85%)`);
        }

        for (let i = 0; i < splats.length; i++) {
          const s = splats[i];
          const lx = Math.round(s.x - dRect.left);
          const ly = Math.round(s.y - dRect.top);
          if (lx > -s.radius && lx < dRect.width + s.radius && ly > -s.radius && ly < dRect.height + s.radius) {
            const r = Math.round(s.radius);
            const a = Math.min(1, s.opacity * 1.2).toFixed(2);
            dReveal.push(`radial-gradient(circle ${r}px at ${lx}px ${ly}px, rgba(0,0,0,${a}) 0%, rgba(0,0,0,${a}) 45%, transparent 100%)`);
            dBase.push(`radial-gradient(circle ${r}px at ${lx}px ${ly}px, transparent 0%, transparent 40%, black 85%)`);
          }
        }

        if (dReveal.length > 0) {
          setDescMask({ reveal: dReveal.join(', '), base: dBase.join(', '), active: true });
        } else {
          setDescMask((prev) => (prev.active ? { reveal: 'none', base: 'none', active: false } : prev));
        }
      }

      animId = requestAnimationFrame(updateMasks);
    };

    animId = requestAnimationFrame(updateMasks);
    return () => cancelAnimationFrame(animId);
  }, [headlineHover, hoverCoords, descHover, descCoords]);

  const scrollToReg = (trackName) => {
    if (onSelectTrack && trackName) onSelectTrack(trackName);
    const el = document.getElementById('registration-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="hero-section" style={{ paddingTop: '185px', paddingBottom: '85px', position: 'relative', zIndex: 2 }}>
      <div className="page-container" style={{ textAlign: 'center' }}>

        {/* Minimalist Editorial Headline: NEVER light before; illuminates where cursor IS and where black-purple fluid IS */}
        <div
          ref={headlineRef}
          className="hero-headline-wrapper"
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setHoverCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setHeadlineHover(true);
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setHoverCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            if (!headlineHover) setHeadlineHover(true);
          }}
          onMouseLeave={() => setHeadlineHover(false)}
          style={{
            position: 'relative',
            maxWidth: '920px',
            margin: '0 auto 28px',
            cursor: 'default',
            userSelect: 'none'
          }}
        >
          {/* Base Layer: Crisp Obsidian & Muted Slate by default; punches smooth holes under cursor & fluid vortices */}
          <h1
            className="heading-hero"
            style={{
              margin: 0,
              color: '#0f172a',
              WebkitMaskImage: headlineMask.active ? headlineMask.base : 'none',
              maskImage: headlineMask.active ? headlineMask.base : 'none',
              transition: 'WebkitMaskImage 0.08s ease, maskImage 0.08s ease'
            }}
          >
            <span>Where Precision 3D Mechanics</span>
            <br />
            <span style={{ color: '#475569' }}>
              Meets High-Frequency Silicon.
            </span>
          </h1>

          {/* Contrast Reveal Layer: 100% hidden before hover; revealed wherever cursor OR black-purple fluid is */}
          <h1
            className="heading-hero contrast-reveal-layer"
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              margin: 0,
              color: '#ffffff',
              pointerEvents: 'none',
              zIndex: 3,
              opacity: headlineMask.active ? 1 : 0,
              transition: 'opacity 0.15s ease',
              WebkitMaskImage: headlineMask.active ? headlineMask.reveal : 'none',
              maskImage: headlineMask.active ? headlineMask.reveal : 'none'
            }}
          >
            <span>Where Precision 3D Mechanics</span>
            <br />
            <span style={{ color: '#38bdf8' }}>
              Meets High-Frequency Silicon.
            </span>
          </h1>
        </div>

        {/* Restrained Subtitle: NEVER light before; illuminates where cursor IS and where black-purple fluid IS */}
        <div
          ref={descRef}
          className="hero-desc-wrapper"
          onMouseEnter={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setDescCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setDescHover(true);
          }}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setDescCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            if (!descHover) setDescHover(true);
          }}
          onMouseLeave={() => setDescHover(false)}
          style={{
            position: 'relative',
            maxWidth: '680px',
            margin: '0 auto 44px',
            cursor: 'default',
            userSelect: 'none'
          }}
        >
          {/* Base Layer: Crisp Muted Slate (#475569) by default; punches smooth holes under cursor & fluid vortices */}
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--font-main)',
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              color: '#475569',
              fontWeight: 400,
              lineHeight: 1.65,
              letterSpacing: '-0.01em',
              WebkitMaskImage: descMask.active ? descMask.base : 'none',
              maskImage: descMask.active ? descMask.base : 'none',
              transition: 'WebkitMaskImage 0.08s ease, maskImage 0.08s ease'
            }}
          >
            <span>Master the complete hardware lifecycle. Design thermal-tested enclosures in SolidWorks, route high-frequency multi-layer boards in Altium Designer, and synchronize clearance envelopes bi-directionally without friction.</span>
          </p>

          {/* Contrast Reveal Layer: 100% hidden before hover; revealed wherever cursor OR black-purple fluid is */}
          <p
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              margin: 0,
              fontFamily: 'var(--font-main)',
              fontSize: 'clamp(1rem, 1.4vw, 1.15rem)',
              color: '#ffffff',
              fontWeight: 500,
              lineHeight: 1.65,
              letterSpacing: '-0.01em',
              pointerEvents: 'none',
              zIndex: 3,
              opacity: descMask.active ? 1 : 0,
              transition: 'opacity 0.15s ease',
              WebkitMaskImage: descMask.active ? descMask.reveal : 'none',
              maskImage: descMask.active ? descMask.reveal : 'none'
            }}
          >
            <span>Master the complete hardware lifecycle. Design thermal-tested enclosures in SolidWorks, route high-frequency multi-layer boards in Altium Designer, and synchronize clearance envelopes bi-directionally without friction.</span>
          </p>
        </div>

        {/* Specular Buttons (No Jittery Physics) */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '50px' }}>
          <SpecularButton
            variant="primary"
            onClick={() => scrollToReg('both_mechatronics')}
            style={{ padding: '13px 30px', fontSize: '0.94rem' }}
          >
            <span>Reserve Workstation</span>
            <ArrowRight size={15} />
          </SpecularButton>

          <a href="#tracks" style={{ textDecoration: 'none' }}>
            <SpecularButton
              variant="secondary"
              style={{ padding: '13px 26px', fontSize: '0.92rem' }}
            >
              <span>Explore Syllabus & Tracks</span>
            </SpecularButton>
          </a>
        </div>

        {/* Minimal Live Lab Availability Strip */}
        <div
          style={{
            maxWidth: '560px',
            margin: '0 auto 55px',
            padding: '11px 20px',
            borderRadius: '10px',
            background: '#ffffff',
            border: '1px solid var(--border-subtle)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            fontSize: '0.84rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
            <span style={{ color: '#475569', fontWeight: 500 }}>Live Workstations Available:</span>
          </div>
          <div style={{ display: 'flex', gap: '18px' }} className="font-mono">
            <span style={{ color: '#334155' }}>SolidWorks: <strong style={{ color: '#ea580c' }}>{solidworksSeats} seats</strong></span>
            <span style={{ color: '#334155' }}>Altium: <strong style={{ color: '#0284c7' }}>{altiumSeats} seats</strong></span>
          </div>
        </div>

        {/* 4 Architectural Engineering Blocks with ReactBits ScrollCard & SpotlightCard */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            textAlign: 'left'
          }}
        >
          <ScrollCard delay={0} distance={30} scale={0.96} rotateX={4}>
            <SpotlightCard spotlightColor="rgba(234, 88, 12, 0.08)" spotlightSize={280} className="pro-panel" style={{ height: '100%' }}>
              <div style={{ padding: '24px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
                  <span className="font-mono" style={{ fontSize: '0.74rem', color: '#ea580c', fontWeight: 600 }}>01 // MCAD</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 650, color: '#0f172a', marginBottom: '5px' }}>Parametric Surfacing & DFM</h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                  Sheet metal bend allowances, mold draft angles, and steady-state thermal FEA under high compute loads.
                </p>
              </div>
            </SpotlightCard>
          </ScrollCard>

          <ScrollCard delay={90} distance={30} scale={0.96} rotateX={4}>
            <SpotlightCard spotlightColor="rgba(2, 132, 199, 0.08)" spotlightSize={280} className="pro-panel" style={{ height: '100%' }}>
              <div style={{ padding: '24px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
                  <span className="font-mono" style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 600 }}>02 // ECAD</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 650, color: '#0f172a', marginBottom: '5px' }}>High-Speed Signal Integrity</h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                  Controlled impedance stackup, DDR5 serpentine delay tuning, return-path vias, and 56Gbps SerDes routing.
                </p>
              </div>
            </SpotlightCard>
          </ScrollCard>

          <ScrollCard delay={180} distance={30} scale={0.96} rotateX={4}>
            <SpotlightCard spotlightColor="rgba(124, 58, 237, 0.08)" spotlightSize={280} className="pro-panel" style={{ height: '100%' }}>
              <div style={{ padding: '24px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
                  <span className="font-mono" style={{ fontSize: '0.74rem', color: '#7c3aed', fontWeight: 600 }}>03 // CO-DESIGN</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 650, color: '#0f172a', marginBottom: '5px' }}>Bi-Directional IDX 3.0</h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                  Real-time push/pull changesets between mechanical and electrical CAD with automated 3D collision prevention.
                </p>
              </div>
            </SpotlightCard>
          </ScrollCard>

          <ScrollCard delay={270} distance={30} scale={0.96} rotateX={4}>
            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.08)" spotlightSize={280} className="pro-panel" style={{ height: '100%' }}>
              <div style={{ padding: '24px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
                  <span className="font-mono" style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 600 }}>04 // FABRICATION</span>
                </div>
                <h3 style={{ fontSize: '1rem', fontWeight: 650, color: '#0f172a', marginBottom: '5px' }}>Physical Hardware Kit</h3>
                <p style={{ fontSize: '0.84rem', color: '#64748b', lineHeight: 1.5 }}>
                  Every participant receives an assembled custom board, CNC-machined anodized aluminum housing, and verified templates.
                </p>
              </div>
            </SpotlightCard>
          </ScrollCard>
        </div>
      </div>
    </section>
  );
}
