import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { SpotlightCard, DecryptedText, SpecularButton, StarBorder, ScrollCard } from './reactbits';

export default function TrackCards({ onSelectTrack }) {
  const handleSelect = (trackKey) => {
    if (onSelectTrack) onSelectTrack(trackKey);
    const el = document.getElementById('registration-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="tracks" style={{ padding: '80px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container">
        {/* Section Header */}
        <div style={{ marginBottom: '40px', maxWidth: '640px' }}>
          <span className="tag-badge font-mono" style={{ marginBottom: '12px' }}>
            <DecryptedText text="SPECIALIZATION TRACKS // NO TUITION FEE" speed={25} maxIterations={10} animateOn="view" />
          </span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', fontWeight: 750, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '10px' }}>
            Choose Your Workshop Learning Path.
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Select your discipline based on your current engineering focus. All tracks include hands-on guided software instruction, lab kit materials, and certified accreditation.
          </p>
        </div>

        {/* 3 Minimal Track Grid with ReactBits ScrollCard Animated Blocks */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
            gap: '24px',
            alignItems: 'stretch'
          }}
        >
          {/* Card 1: SolidWorks Track */}
          <ScrollCard delay={0} distance={45} scale={0.93} style={{ height: '100%' }}>
            <SpotlightCard
              spotlightColor="rgba(234, 88, 12, 0.08)"
              spotlightSize={360}
              className="pro-panel"
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
            <div
              style={{
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                height: '100%'
              }}
            >
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span className="font-mono" style={{ fontSize: '0.74rem', color: '#ea580c', fontWeight: 600 }}>
                    <DecryptedText text="TRK-01 // 3D MCAD" speed={25} maxIterations={8} animateOn="view" />
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: '#64748b' }}>
                    8 seats left
                  </span>
                </div>

                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                  SolidWorks 3D CAD
                </h3>
                <div style={{ fontSize: '0.84rem', color: '#ea580c', fontWeight: 600, marginBottom: '14px' }}>
                  Enclosure Modeling & Thermal FEA
                </div>
                <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, marginBottom: '20px' }}>
                  Master complex 3D parametric surfacing, sheet metal bending, plastic injection molding draft analysis, and steady-state thermal modeling.
                </p>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '18px', marginBottom: '20px' }}>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {[
                      'Parametric curvature-continuous surfacing (G2/G3)',
                      'Sheet metal K-factor allowances & laser cut DXF',
                      'Thermal FEA heat transfer under processor loads',
                      'Exporting STEP 3D assemblies for Altium ECAD',
                      'Accredited Certificate of Technical Completion'
                    ].map((text, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.82rem', color: '#334155' }}>
                        <Check size={14} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0, width: '100%' }}>
                <SpecularButton
                  variant="secondary"
                  onClick={() => handleSelect('solidworks')}
                  style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: '0.88rem' }}
                >
                  <span>Register for SolidWorks</span>
                  <ArrowRight size={14} />
                </SpecularButton>
              </div>
            </div>
          </SpotlightCard>
          </ScrollCard>

          {/* Card 2: Featured Combined Co-Design Track with StarBorder & ScrollCard */}
          <ScrollCard delay={120} distance={45} scale={0.93} style={{ height: '100%' }}>
            <StarBorder color="#f59e0b" speed="4.5s" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <SpotlightCard
                spotlightColor="rgba(245, 158, 11, 0.1)"
                spotlightSize={380}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  height: '100%',
                  background: '#ffffff'
                }}
              >
                <div
                  style={{
                    padding: '28px 24px',
                    display: 'flex',
                    flexDirection: 'column',
                    flex: 1,
                    height: '100%'
                  }}
                >
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span className="font-mono" style={{ fontSize: '0.74rem', color: '#b45309', fontWeight: 600 }}>
                        <DecryptedText text="TRK-03 // DUAL MECHATRONICS" speed={25} maxIterations={8} animateOn="view" />
                      </span>
                      <span className="tag-badge enig-tag font-mono" style={{ fontSize: '0.7rem' }}>
                        RECOMMENDED
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                      Unified ECAD-MCAD
                    </h3>
                    <div style={{ fontSize: '0.84rem', color: '#b45309', fontWeight: 600, marginBottom: '14px' }}>
                      SolidWorks + Altium Synchronized Workflow
                    </div>
                    <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, marginBottom: '20px' }}>
                      The complete hardware engineering cycle. Learn bi-directional IDX push/pull changesets between mechanical and electrical software to eliminate mounting interference.
                    </p>

                    <div style={{ borderTop: '1px solid rgba(245, 158, 11, 0.25)', paddingTop: '18px', marginBottom: '20px' }}>
                      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                        {[
                          'Full access to BOTH SolidWorks & Altium sessions',
                          'Bi-directional IDX 3.0 push/pull live synchronization',
                          '3D Copper keepouts & automated collision detection',
                          'Physical hardware dev kit (assembled board + milled case)',
                          '1-on-1 Hardware review with Lead Mentors',
                          'Dual Accredited Completion Certificate'
                        ].map((text, i) => (
                          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.82rem', color: '#1e293b' }}>
                            <Check size={14} color="#d97706" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span style={{ fontWeight: i < 2 ? 600 : 400 }}>{text}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div style={{ marginTop: 'auto', paddingTop: '18px', borderTop: '1px solid rgba(245, 158, 11, 0.25)', flexShrink: 0, width: '100%' }}>
                    <SpecularButton
                      variant="primary"
                      onClick={() => handleSelect('both_mechatronics')}
                      style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: '0.9rem' }}
                    >
                      <span>Register for Unified Track</span>
                      <ArrowRight size={14} />
                    </SpecularButton>
                  </div>
                </div>
              </SpotlightCard>
            </StarBorder>
          </ScrollCard>

          {/* Card 3: Altium Track with ScrollCard */}
          <ScrollCard delay={240} distance={45} scale={0.93} style={{ height: '100%' }}>
            <SpotlightCard
              spotlightColor="rgba(2, 132, 199, 0.08)"
              spotlightSize={360}
              className="pro-panel"
              style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <div
                style={{
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  height: '100%'
                }}
              >
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="font-mono" style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 600 }}>
                      <DecryptedText text="TRK-02 // HIGH-SPEED ECAD" speed={25} maxIterations={8} animateOn="view" />
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: '#64748b' }}>
                      10 seats left
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px', letterSpacing: '-0.02em' }}>
                    Altium ECAD
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: '#0284c7', fontWeight: 600, marginBottom: '14px' }}>
                    High-Speed Signal Integrity & Layer Stackup
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.55, marginBottom: '20px' }}>
                    Route controlled-impedance differential pairs, tune DDR4/5 serpentine delay paths, and establish low-inductance power distribution networks.
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '18px', marginBottom: '20px' }}>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '9px' }}>
                      {[
                        'Microstrip & stripline stackup impedance modeling',
                        'DDR4/5 serpentine trace flight-time delay tuning',
                        'Low-inductance PDN decoupling capacitor loops',
                        'STEP 3D model bidirectional import & export',
                        'Accredited Certificate of Technical Completion'
                      ].map((text, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '9px', fontSize: '0.82rem', color: '#334155' }}>
                          <Check size={14} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span>{text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '18px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0, width: '100%' }}>
                  <SpecularButton
                    variant="secondary"
                    onClick={() => handleSelect('altium')}
                    style={{ width: '100%', justifyContent: 'center', padding: '12px 16px', fontSize: '0.88rem' }}
                  >
                    <span>Register for Altium</span>
                    <ArrowRight size={14} />
                  </SpecularButton>
                </div>
              </div>
            </SpotlightCard>
          </ScrollCard>
        </div>
      </div>
    </section>
  );
}
