import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle } from 'lucide-react';

export default function CurriculumTimeline() {
  const [activeDay, setActiveDay] = useState(1);

  const SCHEDULE = {
    1: {
      date: 'October 24, 2026',
      title: 'Day 1: Architectural Foundations & High-Speed Constraints',
      theme: '#ff5722',
      solidworks: [
        { time: '09:00 - 10:30', topic: 'SolidWorks Master Modeling & GD&T Setup', desc: 'Establishing custom drafting standards, standard fastener hardware toolboxes, and multi-body master modeling.' },
        { time: '11:00 - 12:30', topic: 'Complex Parametric 3D Surfacing', desc: 'Curvature-continuous (G2/G3) lofting, boundary surfaces, and zebra stripe inspection for ergonomic handheld enclosures.' },
        { time: '14:00 - 16:30', topic: 'Sheet Metal Tooling & DFM Flat Patterns', desc: 'K-factor bend allowances, corner reliefs, and exporting laser-cut DXF profiles with zero fabrication distortion.' }
      ],
      altium: [
        { time: '09:00 - 10:30', topic: 'Altium 24 Project Architecture & Unified Cloud Library', desc: 'Hierarchical multi-sheet schematics, component parameter standards, and linking 3D STEP models to PCB footprints.' },
        { time: '11:00 - 12:30', topic: '12-Layer Stackup & Controlled Impedance Calculation', desc: 'Utilizing Altium Layer Stack Manager to compute single-ended 50Ω and differential 90Ω/100Ω stripline geometries.' },
        { time: '14:00 - 16:30', topic: 'High-Density BGA Fanout & Escape Strategies', desc: '0.8mm and 0.5mm pitch BGA dog-bone vs via-in-pad plated over (VIPPO) microvia technology.' }
      ]
    },
    2: {
      date: 'October 25, 2026',
      title: 'Day 2: Signal Integrity Analysis & Mold Tooling Simulation',
      theme: '#00e5ff',
      solidworks: [
        { time: '09:00 - 10:30', topic: 'Plastic Injection Molding DFM & Tooling Analysis', desc: 'Draft angle analysis, uniform nominal wall thickness, rib-to-wall ratios, and snap-fit cantilever stress limits.' },
        { time: '11:00 - 12:30', topic: 'Convective Thermal FEA Simulation', desc: 'Simulating heat transfer from high-power ICs, sizing chassis vent cross-sections, and modeling heat pipe thermal interfaces.' },
        { time: '14:00 - 16:30', topic: 'Mechanical Drop & Dynamic Shock Testing', desc: 'Non-linear dynamic simulation under 50G shock loads to prevent standoff boss fractures and PCB flexure.' }
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
        { time: '09:00 - 11:00', topic: 'Bi-Directional CoDesigner Push/Pull Workflow', desc: 'Pulling Altium component placements into SolidWorks, aligning screw bosses, and pushing copper keepouts back.' },
        { time: '11:30 - 13:00', topic: '3D Clearance & Interference Verification', desc: 'Detecting 0.05mm collisions between inductor packages and top aluminum housing with automated reporting.' },
        { time: '14:00 - 17:00', topic: '5-Axis CNC Mill Live Cutting Showcase', desc: 'Milling the finalized anodized enclosure while attendees assemble and solder their custom development board.' }
      ],
      altium: [
        { time: '09:00 - 11:00', topic: 'Real-Time Mechanical Placement Synchronization', desc: 'Accepting mechanical boss shifts from SolidWorks and re-routing affected differential signal corridors.' },
        { time: '11:30 - 13:00', topic: 'Manufacturing Release & Production CAM Outputs', desc: 'Generating ODB++, IPC-2581, and pick-and-place centroid data for high-volume turnkey assembly.' },
        { time: '14:00 - 17:00', topic: 'SMT Assembly Line Bring-Up & Eye Diagram Testing', desc: 'Populating components on the SMT line, optical inspection, and measuring signal eye margins with 50GHz oscilloscopes.' }
      ]
    }
  };

  const current = SCHEDULE[activeDay];

  return (
    <section id="curriculum" style={{ padding: '90px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: '45px', maxWidth: '640px' }}>
          <span className="tag-badge font-mono" style={{ marginBottom: '14px' }}>
            SYLLABUS SPECIFICATION
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: '12px' }}>
            Curriculum Built for Real-World Production.
          </h2>
          <p style={{ color: '#8c96a8', fontSize: '1rem', lineHeight: 1.6 }}>
            Three intensive days combining deep theoretical constraints, guided CAD/ECAD design, and hardware laboratory bring-up.
          </p>
        </div>

        {/* Day Selector Segment */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', flexWrap: 'wrap' }}>
          {[1, 2, 3].map((dayNum) => (
            <button
              key={dayNum}
              onClick={() => setActiveDay(dayNum)}
              style={{
                padding: '10px 22px',
                borderRadius: '8px',
                border: activeDay === dayNum ? '1px solid rgba(255, 255, 255, 0.4)' : '1px solid var(--border-subtle)',
                background: activeDay === dayNum ? '#181b26' : '#0a0b10',
                color: activeDay === dayNum ? '#ffffff' : '#7d889b',
                fontSize: '0.88rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Day 0{dayNum}: {dayNum === 1 ? 'Architecture & Setup' : dayNum === 2 ? 'Signal & Tooling' : 'Co-Design & SMT Fab'}
            </button>
          ))}
        </div>

        {/* Day Content Panel */}
        <div className="pro-panel" style={{ padding: 'clamp(18px, 4vw, 36px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <span className="font-mono" style={{ fontSize: '0.78rem', color: current.theme, fontWeight: 600 }}>
                {current.date}
              </span>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#fff', marginTop: '4px' }}>
                {current.title}
              </h3>
            </div>
            <span className="tag-badge font-mono">
              <Clock size={12} />
              <span>09:00 - 17:30 PST</span>
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '24px' }}>
            {/* SolidWorks Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5722' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ff7a50' }}>SolidWorks 3D CAD Track</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {current.solidworks.map((item, idx) => (
                  <div key={idx} style={{ padding: '14px', borderRadius: '8px', background: '#0a0b10', borderLeft: '2px solid #ff5722' }}>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: '#ff7a50', fontWeight: 600 }}>
                      {item.time}
                    </span>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', margin: '4px 0' }}>
                      {item.topic}
                    </h5>
                    <p style={{ fontSize: '0.82rem', color: '#8893a7', lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Altium Column */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00e5ff' }} />
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#00e5ff' }}>Altium Designer ECAD Track</h4>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {current.altium.map((item, idx) => (
                  <div key={idx} style={{ padding: '14px', borderRadius: '8px', background: '#0a0b10', borderLeft: '2px solid #00e5ff' }}>
                    <span className="font-mono" style={{ fontSize: '0.72rem', color: '#00e5ff', fontWeight: 600 }}>
                      {item.time}
                    </span>
                    <h5 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#fff', margin: '4px 0' }}>
                      {item.topic}
                    </h5>
                    <p style={{ fontSize: '0.82rem', color: '#8893a7', lineHeight: 1.4 }}>
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
