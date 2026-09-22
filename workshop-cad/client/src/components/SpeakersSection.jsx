import React from 'react';
import { SpotlightCard, DecryptedText } from './reactbits';

export default function SpeakersSection({ speakers }) {
  const defaultSpeakers = [
    {
      name: 'Dr. Aris Thorne',
      title: 'Principal Hardware Architect',
      company: 'ExoDynamics Mechatronics',
      expertise: 'SolidWorks Certified Professional, FEA & Mold Tooling specialist with 15+ years delivering autonomous robotic platforms.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      tags: ['SolidWorks 2024', 'Topology Optimization', 'DFM Tooling']
    },
    {
      name: 'Vivian Chen',
      title: 'Senior Signal Integrity Lead',
      company: 'NextGen Silicon & ECAD Labs',
      expertise: 'Altium Elite Specialist with deep expertise in 56Gbps PAM4 SerDes, DDR5 flight-time skew compensation, and rigid-flex designs.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      tags: ['Altium 24', 'High-Speed SerDes', 'Rigid-Flex PCB']
    },
    {
      name: 'Kaelen Vance',
      title: 'VP of Robotics Engineering',
      company: 'Apex Autonomous Systems',
      expertise: 'Pioneered automated bi-directional IDX 3.0 MCAD-ECAD co-design workflows across flight-certified satellite avionics.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      tags: ['MCAD-ECAD Sync', 'Thermal Modeling', 'Robotic Actuators']
    }
  ];

  const mentors = speakers && speakers.length > 0 ? speakers : defaultSpeakers;

  return (
    <section id="faculty" style={{ padding: '80px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: '38px', maxWidth: '640px' }}>
          <span className="tag-badge font-mono" style={{ marginBottom: '12px' }}>
            <DecryptedText text="FACULTY // LAB MENTORS" speed={25} maxIterations={10} animateOn="view" />
          </span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', fontWeight: 750, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '10px' }}>
            Learn from Practitioners Building Flight-Grade Hardware.
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Our instructors design satellite avionics, autonomous robotic platforms, and high-frequency radar enclosures.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '20px' }}>
          {mentors.map((speaker, idx) => (
            <SpotlightCard
              key={idx}
              spotlightColor="rgba(15, 23, 42, 0.04)"
              spotlightSize={300}
              className="pro-panel"
            >
              <div style={{ padding: '24px 22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                  <img
                    src={speaker.avatar}
                    alt={speaker.name}
                    style={{
                      width: '54px',
                      height: '54px',
                      objectFit: 'cover',
                      borderRadius: '50%',
                      border: '1px solid var(--border-subtle)'
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 650, color: '#0f172a' }}>{speaker.name}</h3>
                    <div style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 500 }}>
                      {speaker.title}
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                      {speaker.company}
                    </div>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: '#475569', lineHeight: 1.5, marginBottom: '18px' }}>
                  {speaker.expertise}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {speaker.tags && speaker.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="font-mono"
                      style={{
                        fontSize: '0.68rem',
                        padding: '3px 7px',
                        borderRadius: '4px',
                        background: '#f1f5f9',
                        color: '#475569',
                        border: '1px solid var(--border-subtle)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
}
