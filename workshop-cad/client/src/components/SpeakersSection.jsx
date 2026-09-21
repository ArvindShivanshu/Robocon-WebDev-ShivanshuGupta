import React from 'react';
import { Award, ArrowUpRight } from 'lucide-react';

export default function SpeakersSection({ speakers }) {
  const defaultSpeakers = [
    {
      name: 'Dr. Aris Thorne',
      title: 'Principal Hardware Architect',
      company: 'ExoDynamics Mechatronics',
      expertise: 'SolidWorks Certified Professional, FEA & Mold Tooling specialist with 15+ years delivering autonomous robotic platforms.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      tags: ['SolidWorks 2024', 'Topology Optimization', 'DFM Tooling'],
      accent: '#ff5722'
    },
    {
      name: 'Vivian Chen',
      title: 'Senior Signal Integrity Lead',
      company: 'NextGen Silicon & ECAD Labs',
      expertise: 'Altium Elite Specialist with deep expertise in 56Gbps PAM4 SerDes, DDR5 flight-time skew compensation, and rigid-flex designs.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      tags: ['Altium 24', 'High-Speed SerDes', 'Rigid-Flex PCB'],
      accent: '#00e5ff'
    },
    {
      name: 'Kaelen Vance',
      title: 'VP of Robotics Engineering',
      company: 'Apex Autonomous Systems',
      expertise: 'Pioneered automated bi-directional IDX 3.0 MCAD-ECAD co-design workflows across flight-certified satellite avionics.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      tags: ['MCAD-ECAD Sync', 'Thermal Modeling', 'Robotic Actuators'],
      accent: '#e2b768'
    }
  ];

  const mentors = speakers && speakers.length > 0 ? speakers : defaultSpeakers;

  return (
    <section id="faculty" style={{ padding: '90px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container">
        {/* Header */}
        <div style={{ marginBottom: '45px', maxWidth: '640px' }}>
          <span className="tag-badge font-mono" style={{ marginBottom: '14px' }}>
            LAB INSTRUCTORS & MENTORS
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: '12px' }}>
            Learn from Practitioners Building Flight-Grade Hardware.
          </h2>
          <p style={{ color: '#8c96a8', fontSize: '1rem', lineHeight: 1.6 }}>
            Our instructors design satellite avionics, autonomous robotic systems, and high-frequency radar enclosures.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '22px' }}>
          {mentors.map((speaker, idx) => (
            <div key={idx} className="pro-panel" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
                <img
                  src={speaker.avatar}
                  alt={speaker.name}
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '1.5px solid var(--border-medium)'
                  }}
                />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff' }}>{speaker.name}</h3>
                  <div style={{ fontSize: '0.82rem', color: speaker.accent || '#00e5ff', fontWeight: 500 }}>
                    {speaker.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#687385' }}>
                    {speaker.company}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#9ba4b8', lineHeight: 1.5, marginBottom: '20px' }}>
                {speaker.expertise}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {speaker.tags && speaker.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="font-mono"
                    style={{
                      fontSize: '0.7rem',
                      padding: '3px 8px',
                      borderRadius: '5px',
                      background: '#0a0b10',
                      color: '#8c96a8',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
