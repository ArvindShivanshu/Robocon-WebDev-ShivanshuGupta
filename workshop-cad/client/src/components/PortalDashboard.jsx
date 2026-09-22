import React, { useState, useEffect } from 'react';
import {
  Box,
  Cpu,
  Layers,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Terminal,
  Activity,
  Award,
  Sparkles,
  ExternalLink,
  Zap,
  HardDrive
} from 'lucide-react';
import { SpotlightCard, CountUp, DecryptedText, ShinyText, Magnet, TiltedCard } from './reactbits';

export default function PortalDashboard({
  workshop,
  onSelectWorkspace,
  onSelectTrack
}) {
  const solidworksSeats = workshop?.solidworks_seats_left ?? 6;
  const altiumSeats = workshop?.altium_seats_left ?? 8;
  const bookedSeats = workshop?.booked_lab_seats ?? 6;
  const totalSeats = 20;

  // Live countdown to October 24, 2026 Residency
  const [timeLeft, setTimeLeft] = useState({ days: 32, hours: 14, minutes: 22, seconds: 40 });

  useEffect(() => {
    const targetDate = new Date('2026-10-24T09:00:00Z').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTrackEnroll = (trackId) => {
    if (onSelectTrack) onSelectTrack(trackId);
    onSelectWorkspace('register');
  };

  return (
    <div style={{ padding: '32px 0 100px', position: 'relative', zIndex: 2 }}>
      <div className="page-container">
        {/* Top Control Strip */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            marginBottom: '28px',
            padding: '14px 20px',
            borderRadius: '12px',
            background: 'rgba(16, 18, 26, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
            <span className="font-mono" style={{ fontSize: '0.82rem', color: '#c3cad9', fontWeight: 600 }}>
              <DecryptedText text="NODE APEX-01 // SILICON VALLEY LAB WORKSTATION ACTIVE" speed={24} maxIterations={12} animateOn="view" />
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }} className="font-mono">
            <span style={{ fontSize: '0.78rem', color: '#8b96a8' }}>
              RESIDENCY DATES: <strong style={{ color: '#fff' }}>OCT 24 - 26, 2026</strong>
            </span>
            <span style={{ fontSize: '0.78rem', color: '#8b96a8' }}>
              TUITION: <strong style={{ color: '#10b981' }}>100% RESEARCH SPONSORED (FREE)</strong>
            </span>
          </div>
        </div>

        {/* =========================================================================
            BENTO GRID WORKSTATION HUB
            ========================================================================= */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '20px'
          }}
        >
          {/* TILE 1: Primary Editorial Node (Span 8) */}
          <div style={{ gridColumn: 'span 8' }} className="bento-span-8">
            <SpotlightCard
              spotlightColor="rgba(226, 183, 104, 0.18)"
              spotlightSize={500}
              className="pro-panel"
              style={{ height: '100%', padding: 'clamp(24px, 4vw, 40px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <span className="tag-badge enig-tag font-mono">
                    <Zap size={12} color="#e2b768" />
                    <span>OCTOBER 2026 RESIDENCY</span>
                  </span>
                  <span className="tag-badge font-mono" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                    DUAL CERTIFIED
                  </span>
                </div>

                <h1 style={{ fontSize: 'clamp(2rem, 3.4vw, 2.9rem)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.1, color: '#ffffff', marginBottom: '14px' }}>
                  Where Precision <span style={{ color: '#ff5722' }}>3D Mechanics</span>
                  <br />
                  Meets High-Frequency <span style={{ color: '#00e5ff' }}>Silicon</span>.
                </h1>

                <p style={{ color: '#9aa5b8', fontSize: '0.98rem', lineHeight: 1.6, maxWidth: '640px', marginBottom: '28px' }}>
                  Master the unified mechatronics lifecycle. Design thermal-tested CNC enclosures in <strong>SolidWorks</strong>, route 12-layer impedance-controlled boards in <strong>Altium Designer</strong>, and sync clearance models bi-directionally without mounting interference.
                </p>
              </div>

              {/* Action Buttons & Countdown */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', marginBottom: '24px' }}>
                  <Magnet magnetStrength={0.28} padding={40}>
                    <button
                      onClick={() => onSelectWorkspace('register')}
                      className="btn-primary-lead"
                      style={{ padding: '12px 28px', fontSize: '0.95rem' }}
                    >
                      <ShinyText speed={3}>
                        <span>Reserve Workstation Seat</span>
                      </ShinyText>
                      <ArrowRight size={15} />
                    </button>
                  </Magnet>

                  <button
                    onClick={() => onSelectWorkspace('curriculum')}
                    className="btn-secondary-pro"
                    style={{ padding: '12px 22px', fontSize: '0.9rem' }}
                  >
                    <span>View Engineering Timetable</span>
                  </button>

                  <button
                    onClick={() => onSelectWorkspace('codesign')}
                    className="btn-secondary-pro"
                    style={{ padding: '12px 20px', fontSize: '0.9rem', color: '#e2b768' }}
                  >
                    <Layers size={14} color="#e2b768" />
                    <span>IDX 3.0 Clearance Radar</span>
                  </button>
                </div>

                {/* Countdown Timer Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px',
                    padding: '14px 20px',
                    borderRadius: '10px',
                    background: '#090b10',
                    border: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                  className="font-mono"
                >
                  <span style={{ fontSize: '0.75rem', color: '#687385', letterSpacing: '0.04em' }}>
                    T-MINUS TO HARDWARE SMT BRING-UP:
                  </span>
                  <div style={{ display: 'flex', gap: '14px', color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>
                    <span><strong style={{ color: '#00e5ff' }}>{timeLeft.days}</strong>d</span>
                    <span><strong style={{ color: '#00e5ff' }}>{timeLeft.hours}</strong>h</span>
                    <span><strong style={{ color: '#00e5ff' }}>{timeLeft.minutes}</strong>m</span>
                    <span><strong style={{ color: '#00e5ff' }}>{timeLeft.seconds}</strong>s</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* TILE 2: Workstation Bench Allocation (Span 4) */}
          <div style={{ gridColumn: 'span 4' }} className="bento-span-4">
            <SpotlightCard
              spotlightColor="rgba(0, 229, 255, 0.18)"
              spotlightSize={350}
              className="pro-panel"
              style={{ height: '100%', padding: '26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                  <span className="font-mono" style={{ fontSize: '0.78rem', color: '#00e5ff', fontWeight: 600 }}>
                    BENCH ALLOCATION
                  </span>
                  <span className="tag-badge font-mono" style={{ fontSize: '0.68rem', color: '#10b981' }}>
                    LIVE COUNTER
                  </span>
                </div>

                <div style={{ marginBottom: '22px' }}>
                  <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>
                    <CountUp to={solidworksSeats + altiumSeats} from={0} duration={1.5} />
                    <span style={{ fontSize: '1rem', color: '#687385', fontWeight: 500, marginLeft: '6px' }}>/ {totalSeats} seats</span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#8893a7', marginTop: '6px' }}>
                    Verified physical laboratory workstations remaining
                  </div>
                </div>

                {/* SolidWorks Allocation Bar */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                    <span style={{ color: '#ff7a50', fontWeight: 600 }}>SolidWorks 3D MCAD</span>
                    <span className="font-mono" style={{ color: '#fff' }}>{solidworksSeats} seats left</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(solidworksSeats / 10) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #ff5722, #ff8a65)',
                        borderRadius: '999px'
                      }}
                    />
                  </div>
                </div>

                {/* Altium Allocation Bar */}
                <div style={{ marginBottom: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '6px' }}>
                    <span style={{ color: '#00e5ff', fontWeight: 600 }}>Altium Designer ECAD</span>
                    <span className="font-mono" style={{ color: '#fff' }}>{altiumSeats} seats left</span>
                  </div>
                  <div style={{ height: '7px', borderRadius: '999px', background: 'rgba(255, 255, 255, 0.08)', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${(altiumSeats / 10) * 100}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #00e5ff, #80deea)',
                        borderRadius: '999px'
                      }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ padding: '12px 14px', borderRadius: '8px', background: '#090a0f', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                  <ShieldCheck size={16} color="#10b981" />
                  <span>Workstation kits reserved upon enrollment verification.</span>
                </div>
              </div>
            </SpotlightCard>
          </div>

          {/* TILE 3: CAD/ECAD Studios Launchpad (Span 6) */}
          <div style={{ gridColumn: 'span 6' }} className="bento-span-6">
            <SpotlightCard
              spotlightColor="rgba(255, 87, 34, 0.16)"
              spotlightSize={400}
              className="pro-panel"
              style={{ padding: '26px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#ff7a50', fontWeight: 600 }}>
                  01 // IN-BROWSER MCAD WORKSTATION
                </span>
                <span className="tag-badge sw-tag font-mono" style={{ fontSize: '0.68rem' }}>
                  GPU ACCELERATED
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                SolidWorks 3D Parametric Studio
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#8c96a8', lineHeight: 1.5, marginBottom: '20px' }}>
                Interactive 3D viewport with curvature-continuous G2 lofts, sheet metal flat pattern folding, and thermal finite element heat dissipation.
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => onSelectWorkspace('solidworks')}
                  className="btn-secondary-pro"
                  style={{ flex: 1, justifyContent: 'center', padding: '11px', borderColor: 'rgba(255, 87, 34, 0.4)', color: '#ff7a50' }}
                >
                  <Box size={14} color="#ff5722" />
                  <span>Launch SolidWorks 3D Viewport</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </SpotlightCard>
          </div>

          {/* TILE 4: Altium ECAD Studio Launchpad (Span 6) */}
          <div style={{ gridColumn: 'span 6' }} className="bento-span-6">
            <SpotlightCard
              spotlightColor="rgba(0, 229, 255, 0.16)"
              spotlightSize={400}
              className="pro-panel"
              style={{ padding: '26px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#00e5ff', fontWeight: 600 }}>
                  02 // IN-BROWSER ECAD WORKSTATION
                </span>
                <span className="tag-badge alt-tag font-mono" style={{ fontSize: '0.68rem' }}>
                  REAL-TIME ROUTER
                </span>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>
                Altium Designer 24 PCB Canvas
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#8c96a8', lineHeight: 1.5, marginBottom: '20px' }}>
                Interactive PCB layout with component drag-and-drop, dynamic rubberbanding traces, 45° dog-leg routing, and real-time geometric DRC collision stripes.
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => onSelectWorkspace('altium')}
                  className="btn-secondary-pro"
                  style={{ flex: 1, justifyContent: 'center', padding: '11px', borderColor: 'rgba(0, 229, 255, 0.4)', color: '#00e5ff' }}
                >
                  <Cpu size={14} color="#00e5ff" />
                  <span>Launch Altium ECAD Canvas</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </SpotlightCard>
          </div>

          {/* TILE 5: Hardware Kit Technical BOM Specifications (Span 7) */}
          <div style={{ gridColumn: 'span 7' }} className="bento-span-7">
            <SpotlightCard
              spotlightColor="rgba(226, 183, 104, 0.22)"
              spotlightSize={450}
              className="pro-panel"
              style={{ height: '100%', padding: '28px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: '#e2b768', fontWeight: 600 }}>
                  PHYSICAL HARDWARE DEV KIT // BOM SPECIFICATION
                </span>
                <span className="tag-badge enig-tag font-mono" style={{ fontSize: '0.68rem' }}>
                  SHIPPED TO LAB BENCH
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>
                What Every Participant Receives & Fabricates
              </h3>
              <p style={{ fontSize: '0.86rem', color: '#8c96a8', lineHeight: 1.5, marginBottom: '20px' }}>
                All participants receive the complete physical hardware kit to assemble during the live Day 3 SMT and 5-axis CNC machining laboratory.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { title: 'Chassis', desc: '6061-T6 Billet Aluminum CNC Case, Type III Anodized', code: 'MCAD-01' },
                  { title: 'Substrate', desc: '12-Layer Megtron-6 Dielectric, ENIG Gold contact fingers', code: 'ECAD-02' },
                  { title: 'Compute', desc: 'STM32H753 480MHz Cortex-M7 + Xilinx Artix-7 FPGA', code: 'SIL-03' },
                  { title: 'Fasteners', desc: 'Custom M2.5 Torx stainless steel precision standoffs', code: 'HDW-04' }
                ].map((spec, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: '#090a10',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff' }}>{spec.title}</span>
                      <span className="font-mono" style={{ fontSize: '0.68rem', color: '#e2b768' }}>{spec.code}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#8c96a8', lineHeight: 1.4 }}>{spec.desc}</div>
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </div>

          {/* TILE 6: Live System Telemetry Stream (Span 5) */}
          <div style={{ gridColumn: 'span 5' }} className="bento-span-5">
            <div
              className="pro-panel"
              style={{
                height: '100%',
                padding: '24px',
                background: '#07080d',
                fontFamily: 'var(--font-mono)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Terminal size={14} color="#00e5ff" />
                    <span style={{ fontSize: '0.75rem', color: '#00e5ff', fontWeight: 700 }}>LIVE ACTIVITY STREAM</span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#10b981' }}>● RECORDING</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', fontSize: '0.72rem' }}>
                  <div style={{ color: '#687385' }}>
                    <span style={{ color: '#00e5ff' }}>[05:01:44]</span> SOLIDWORKS SP2: Kinematic motion engine initialized.
                  </div>
                  <div style={{ color: '#687385' }}>
                    <span style={{ color: '#ff5722' }}>[05:01:12]</span> IDX 3.0: 6.5mm standoff boss height synchronized.
                  </div>
                  <div style={{ color: '#687385' }}>
                    <span style={{ color: '#10b981' }}>[05:00:28]</span> ALTIUM: Controlled impedance 50Ω microstrip locked.
                  </div>
                  <div style={{ color: '#c4cad9' }}>
                    <span style={{ color: '#e2b768' }}>[04:58:19]</span> Workstation reserved: B.Tech Mechatronics (Track 03).
                  </div>
                  <div style={{ color: '#c4cad9' }}>
                    <span style={{ color: '#e2b768' }}>[04:52:05]</span> Workstation reserved: Electrical & Computer Eng (Track 02).
                  </div>
                  <div style={{ color: '#10b981' }}>
                    <span style={{ color: '#10b981' }}>[ONLINE]</span> 0 DRC Violations. Mechanical-Electrical clearance verified.
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '16px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#687385' }}>
                <span>PROTOCOL: IDX 3.0 / IPC-2581</span>
                <span>STATUS: NOMINAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            TRACK SELECTION MATRIX STRIP
            ========================================================================= */}
        <div style={{ marginTop: '40px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff' }}>
              Specialization Track Paths (No Tuition Fee)
            </h3>
            <span className="font-mono" style={{ fontSize: '0.78rem', color: '#8c96a8' }}>
              Select a discipline to begin enrollment
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Track 1 */}
            <div
              className="pro-panel"
              style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleTrackEnroll('solidworks')}
            >
              <div>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#ff7a50', fontWeight: 600 }}>TRK-01</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>SolidWorks 3D CAD</h4>
                <div style={{ fontSize: '0.78rem', color: '#8c96a8', marginTop: '2px' }}>Enclosure Modeling & Thermal FEA</div>
              </div>
              <button className="btn-secondary-pro" style={{ padding: '8px 14px', fontSize: '0.8rem', color: '#ff7a50' }}>
                <span>Enroll</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Track 2 */}
            <div
              className="pro-panel"
              style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                border: '1px solid rgba(226, 183, 104, 0.4)',
                background: 'linear-gradient(180deg, rgba(226, 183, 104, 0.08) 0%, rgba(16, 18, 26, 0.95) 100%)'
              }}
              onClick={() => handleTrackEnroll('both_mechatronics')}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="font-mono" style={{ fontSize: '0.72rem', color: '#e2b768', fontWeight: 700 }}>TRK-03</span>
                  <span className="tag-badge enig-tag font-mono" style={{ fontSize: '0.62rem', padding: '1px 6px' }}>FEATURED</span>
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>Unified Mechatronics Co-Design</h4>
                <div style={{ fontSize: '0.78rem', color: '#e2b768', marginTop: '2px' }}>SolidWorks + Altium Synchronized</div>
              </div>
              <button className="btn-primary-lead" style={{ padding: '8px 16px', fontSize: '0.8rem' }}>
                <span>Enroll</span>
                <ArrowRight size={12} />
              </button>
            </div>

            {/* Track 3 */}
            <div
              className="pro-panel"
              style={{
                padding: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => handleTrackEnroll('altium')}
            >
              <div>
                <span className="font-mono" style={{ fontSize: '0.72rem', color: '#00e5ff', fontWeight: 600 }}>TRK-02</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff', marginTop: '2px' }}>Altium Designer 24</h4>
                <div style={{ fontSize: '0.78rem', color: '#8c96a8', marginTop: '2px' }}>Multi-Layer Routing & Signal Integrity</div>
              </div>
              <button className="btn-secondary-pro" style={{ padding: '8px 14px', fontSize: '0.8rem', color: '#00e5ff' }}>
                <span>Enroll</span>
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
