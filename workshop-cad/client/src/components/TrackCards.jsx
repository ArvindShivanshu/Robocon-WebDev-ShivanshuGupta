import React from 'react';
import { Box, Cpu, Layers, Check, ArrowRight, Award, ShieldCheck } from 'lucide-react';

export default function TrackCards({ onSelectTrack }) {
  const handleSelect = (trackKey) => {
    if (onSelectTrack) onSelectTrack(trackKey);
    const el = document.getElementById('registration-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="tracks" style={{ padding: '90px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container">
        {/* Section Header */}
        <div style={{ marginBottom: '48px', maxWidth: '680px' }}>
          <span className="tag-badge font-mono" style={{ marginBottom: '14px' }}>
            SPECIALIZATION TRACKS // NO TUITION FEE
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: '12px' }}>
            Choose Your Workshop Learning Path.
          </h2>
          <p style={{ color: '#8c96a8', fontSize: '1rem', lineHeight: 1.6 }}>
            Select your discipline based on your current focus. All tracks include hands-on guided software instruction, lab kit materials, and certified accreditation.
          </p>
        </div>

        {/* 3 Track Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          {/* Card 1: SolidWorks Track */}
          <div
            className="pro-panel"
            style={{
              padding: 'clamp(22px, 3.5vw, 34px) clamp(18px, 3vw, 30px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#ff7a50', fontWeight: 600 }}>
                  TRK-01 // 3D MECHANICAL CAD
                </span>
                <span className="tag-badge sw-tag font-mono" style={{ fontSize: '0.72rem' }}>
                  8 LAB SEATS LEFT
                </span>
              </div>

              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                SolidWorks 3D CAD
              </h3>
              <div style={{ fontSize: '0.88rem', color: '#ff7a50', fontWeight: 500, marginBottom: '18px' }}>
                Enclosure Modeling & Thermal FEA
              </div>
              <p style={{ fontSize: '0.88rem', color: '#8c96a8', lineHeight: 1.5, marginBottom: '24px' }}>
                Master complex 3D parametric surfacing, sheet metal bending, plastic injection molding draft analysis, and electronic thermal heat dissipation modeling.
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginBottom: '28px' }}>
                <div style={{ fontSize: '0.78rem', color: '#687385', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px', fontWeight: 600 }}>
                  Curriculum Highlights:
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Parametric curvature-continuous surfacing (G2/G3)',
                    'Sheet metal K-factor allowances & laser cut DXF',
                    'Thermal FEA heat transfer under processor loads',
                    'Exporting STEP 3D assemblies for Altium ECAD',
                    'Accredited Certificate of Technical Completion'
                  ].map((text, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#cbd5e1' }}>
                      <Check size={15} color="#ff5722" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <span className="tag-badge font-mono" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.08)' }}>
                  FREE REGISTRATION • LAB SEAT RESERVED
                </span>
              </div>

              <button
                onClick={() => handleSelect('solidworks')}
                className="btn-secondary-pro"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                <span>Register for SolidWorks Track</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 2: Featured Combined Co-Design Track */}
          <div
            className="pro-panel"
            style={{
              padding: 'clamp(22px, 3.5vw, 34px) clamp(18px, 3vw, 30px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: '1px solid rgba(226, 183, 104, 0.4)',
              background: 'linear-gradient(180deg, rgba(226, 183, 104, 0.05) 0%, rgba(16, 18, 27, 0.95) 100%)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#e2b768', fontWeight: 600 }}>
                  TRK-03 // DUAL MECHATRONICS
                </span>
                <span className="tag-badge enig-tag font-mono" style={{ fontSize: '0.72rem' }}>
                  FULL CO-DESIGN LAB
                </span>
              </div>

              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                Unified ECAD-MCAD Co-Design
              </h3>
              <div style={{ fontSize: '0.88rem', color: '#e2b768', fontWeight: 500, marginBottom: '18px' }}>
                SolidWorks + Altium Synchronized Workflow
              </div>
              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '24px' }}>
                The complete mechatronics workflow. Learn bi-directional IDX push/pull changesets between mechanical and electrical software to eliminate mounting interference.
              </p>

              <div style={{ borderTop: '1px solid rgba(226, 183, 104, 0.2)', paddingTop: '20px', marginBottom: '28px' }}>
                <div style={{ fontSize: '0.78rem', color: '#e2b768', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px', fontWeight: 600 }}>
                  Full Co-Design Includes:
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Full access to BOTH SolidWorks & Altium sessions',
                    'Bi-directional IDX 3.0 push/pull live synchronization',
                    '3D Copper keepouts & automated collision detection',
                    'Physical hardware dev kit (assembled board + milled case)',
                    '1-on-1 Hardware review with Lead Mentors',
                    'Dual Accredited Completion Certificate'
                  ].map((text, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#ffffff' }}>
                      <Check size={15} color="#e2b768" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span style={{ fontWeight: i < 2 ? 600 : 400 }}>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <span className="tag-badge font-mono" style={{ color: '#e2b768', borderColor: 'rgba(226, 183, 104, 0.4)', background: 'rgba(226, 183, 104, 0.08)' }}>
                  RECOMMENDED FOR MECHATRONICS & HARDWARE LABS
                </span>
              </div>

              <button
                onClick={() => handleSelect('both_mechatronics')}
                className="btn-primary-lead"
                style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              >
                <span>Register for Unified Track</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Card 3: Altium Track */}
          <div
            className="pro-panel"
            style={{
              padding: 'clamp(22px, 3.5vw, 34px) clamp(18px, 3vw, 30px)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#00e5ff', fontWeight: 600 }}>
                  TRK-02 // HIGH-SPEED ECAD
                </span>
                <span className="tag-badge alt-tag font-mono" style={{ fontSize: '0.72rem' }}>
                  8 LAB SEATS LEFT
                </span>
              </div>

              <h3 style={{ fontSize: '1.45rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                Altium Designer 24
              </h3>
              <div style={{ fontSize: '0.88rem', color: '#00e5ff', fontWeight: 500, marginBottom: '18px' }}>
                Multi-Layer Routing & Signal Integrity
              </div>
              <p style={{ fontSize: '0.88rem', color: '#8c96a8', lineHeight: 1.5, marginBottom: '24px' }}>
                Dive deep into 12-layer stackups, controlled impedance differential pairs, DDR5 serpentine delay tuning, return path stitching vias, and rigid-flex layout.
              </p>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '20px', marginBottom: '28px' }}>
                <div style={{ fontSize: '0.78rem', color: '#687385', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '12px', fontWeight: 600 }}>
                  Curriculum Highlights:
                </div>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    'Hierarchical multi-sheet schematic capture',
                    'Impedance calculation for stripline & microstrip',
                    'DDR4/5 length-tuning & flight-time skew matching',
                    'PDN decoupling loops and return path via stitching',
                    'Accredited Certificate of Technical Completion'
                  ].map((text, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.86rem', color: '#cbd5e1' }}>
                      <Check size={15} color="#00e5ff" style={{ flexShrink: 0, marginTop: '3px' }} />
                      <span>{text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <span className="tag-badge font-mono" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.08)' }}>
                  FREE REGISTRATION • LAB SEAT RESERVED
                </span>
              </div>

              <button
                onClick={() => handleSelect('altium')}
                className="btn-secondary-pro"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                <span>Register for Altium Track</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
