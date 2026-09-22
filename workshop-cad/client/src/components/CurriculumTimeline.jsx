import React, { useState } from 'react';
import { Clock } from 'lucide-react';
import { SpotlightCard, DecryptedText } from './reactbits';

export default function CurriculumTimeline() {
  const [activeDay, setActiveDay] = useState(1);

  const SCHEDULE = {
    1: {
      date: 'October 24, 2026',
      title: 'Day 1: Architectural Foundations & High-Speed Constraints',
      theme: '#8893a7',
      solidworks: [
        { time: '09:00 - 10:30', topic: 'SolidWorks Master Modeling & GD&T Setup', desc: 'Custom drafting standards, standard fastener hardware toolboxes, and multi-body master modeling.' },
        { time: '11:00 - 12:30', topic: 'Complex Parametric 3D Surfacing', desc: 'Curvature-continuous (G2/G3) lofting, boundary surfaces, and zebra stripe curvature inspection.' },
        { time: '14:00 - 16:30', topic: 'Sheet Metal Tooling & DFM Flat Patterns', desc: 'K-factor bend allowances, corner reliefs, and exporting laser-cut DXF profiles with zero distortion.' }
      ],
      altium: [
        { time: '09:00 - 10:30', topic: 'Altium 24 Project Architecture & Unified Cloud Library', desc: 'Hierarchical multi-sheet schematics, component parameter standards, and linking 3D STEP models to footprints.' },
        { time: '11:00 - 12:30', topic: '12-Layer Stackup & Controlled Impedance Calculation', desc: 'Utilizing Altium Layer Stack Manager to compute single-ended 50Ω and differential 90Ω/100Ω stripline.' },
        { time: '14:00 - 16:30', topic: 'High-Density BGA Fanout & Escape Strategies', desc: '0.8mm and 0.5mm pitch BGA dog-bone vs via-in-pad plated over (VIPPO) microvia technology.' }
      ]
    },
    2: {
      date: 'October 25, 2026',
      title: 'Day 2: Signal Integrity Analysis & Mold Tooling Simulation',
      theme: '#8893a7',
      solidworks: [
        { time: '09:00 - 10:30', topic: 'Plastic Injection Molding DFM & Tooling Analysis', desc: 'Draft angle analysis, uniform nominal wall thickness, rib-to-wall ratios, and snap-fit stress limits.' },
        { time: '11:00 - 12:30', topic: 'Convective Thermal FEA Simulation', desc: 'Simulating heat dissipation from high-power ICs, sizing chassis vents, and modeling heat pipe interfaces.' },
        { time: '14:00 - 16:30', topic: 'Mechanical Drop & Dynamic Shock Testing', desc: 'Non-linear dynamic simulation under 50G shock loads to prevent standoff boss fractures.' }
      ],
      altium: [
        { time: '09:00 - 10:30', topic: '56Gbps PAM4 & DDR5 Length-Matching Delay Tuning', desc: 'Accordion delay tuning, flight-time skew compensation, and phase matching across differential pairs.' },
        { time: '11:00 - 12:30', topic: 'Power Distribution Network (PDN) Impedance', desc: 'Capacitor loop inductance minimization, power ground plane cavities, and return path via stitching.' },
        { time: '14:00 - 16:30', topic: 'Rigid-Flex PCB Layout & 3D Dynamic Folding', desc: 'Defining polyimide flex zones, stiffeners, and checking bend radius limits inside the 3D enclosure.' }
      ]
    },
    3: {
      date: 'October 26, 2026',
      title: 'Day 3: The ECAD-MCAD Co-Design Capstone & Live Lab Fab',
      theme: '#e2b768',
      solidworks: [
        { time: '09:00 - 11:00', topic: 'Bi-Directional CoDesigner Push/Pull Workflow', desc: 'Pulling Altium component placements into SolidWorks, aligning screw bosses, and pushing copper keepouts.' },
        { time: '11:30 - 13:00', topic: '3D Clearance & Interference Verification', desc: 'Detecting 0.05mm collisions between inductor packages and top aluminum housing with automated reporting.' },
        { time: '14:00 - 17:00', topic: '5-Axis CNC Mill Live Cutting Showcase', desc: 'Milling the finalized anodized enclosure while attendees assemble and solder their custom development board.' }
      ],
      altium: [
        { time: '09:00 - 11:00', topic: 'Real-Time Mechanical Placement Synchronization', desc: 'Accepting mechanical boss shifts from SolidWorks and re-routing affected differential signal corridors.' },
        { time: '11:30 - 13:00', topic: 'Manufacturing Release & Production CAM Outputs', desc: 'Generating ODB++, IPC-2581, and pick-and-place centroid data for turnkey assembly.' },
        { time: '14:00 - 17:00', topic: 'SMT Assembly Line Bring-Up & Eye Diagram Testing', desc: 'Populating components on the SMT line, optical inspection, and measuring signal eye margins with 50GHz scopes.' }
      ]
    }
  };

  const current = SCHEDULE[activeDay];

  return (
    <section id="curriculum" style={{ padding: '80px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: '38px', maxWidth: '640px' }}>
          <span className="tag-badge font-mono" style={{ marginBottom: '12px' }}>
            <DecryptedText text="SYLLABUS // THREE-DAY SCHEDULE" speed={25} maxIterations={10} animateOn="view" />
          </span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', fontWeight: 750, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '10px' }}>
            Curriculum Built for Real-World Production.
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Three intensive days combining deep theoretical constraints, guided CAD/ECAD design, and hardware laboratory bring-up.
          </p>
        </div>

        {/* Minimal Day Selector Segment */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
          {[1, 2, 3].map((dayNum) => (
            <button
              key={dayNum}
              onClick={() => setActiveDay(dayNum)}
              style={{
                padding: '8px 18px',
                borderRadius: '7px',
                border: activeDay === dayNum ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
                background: activeDay === dayNum ? '#ffffff' : 'transparent',
                color: activeDay === dayNum ? '#0f172a' : '#64748b',
                boxShadow: activeDay === dayNum ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                fontSize: '0.84rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Day 0{dayNum}: {dayNum === 1 ? 'Architecture & Setup' : dayNum === 2 ? 'Signal & Tooling' : 'Co-Design & SMT Fab'}
            </button>
          ))}
        </div>

        {/* Minimal Day Content Panel */}
        <SpotlightCard
          spotlightColor="rgba(15, 23, 42, 0.04)"
          spotlightSize={450}
          className="pro-panel"
        >
          <div style={{ padding: 'clamp(20px, 3.5vw, 32px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
              <div>
                <span className="font-mono" style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600 }}>
                  {current.date}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginTop: '3px' }}>
                  {current.title}
                </h3>
              </div>
              <span className="tag-badge font-mono" style={{ fontSize: '0.7rem' }}>
                <Clock size={11} />
                <span>09:00 - 17:30 PST</span>
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '22px' }}>
              {/* SolidWorks Column */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 650, color: '#0f172a' }}>SolidWorks 3D CAD Track</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {current.solidworks.map((item, idx) => (
                    <div key={idx} style={{ padding: '12px 14px', borderRadius: '7px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                      <span className="font-mono" style={{ fontSize: '0.7rem', color: '#ea580c', fontWeight: 600 }}>
                        {item.time}
                      </span>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 650, color: '#0f172a', margin: '3px 0' }}>
                        {item.topic}
                      </h5>
                      <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.45 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Altium Column */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <h4 style={{ fontSize: '0.94rem', fontWeight: 650, color: '#0f172a' }}>Altium Designer ECAD Track</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {current.altium.map((item, idx) => (
                    <div key={idx} style={{ padding: '12px 14px', borderRadius: '7px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                      <span className="font-mono" style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 600 }}>
                        {item.time}
                      </span>
                      <h5 style={{ fontSize: '0.88rem', fontWeight: 650, color: '#0f172a', margin: '3px 0' }}>
                        {item.topic}
                      </h5>
                      <p style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.45 }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
