import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const FAQS = [
    {
      q: 'Is there any registration fee or tuition cost for this workshop?',
      a: 'No, this workshop is 100% free of cost. Workstation benches and laboratory materials are fully funded by the Engineering Research Group. Seats are allocated on a verified first-come, first-served basis.'
    },
    {
      q: 'Who is eligible to register for the workshop?',
      a: 'Registration is open to undergraduate and postgraduate engineering students (Mechatronics, Mechanical, ECE, EEE, Robotics, etc.), academic researchers, faculty members, and early-career hardware engineers.'
    },
    {
      q: 'Will software licenses be provided for SolidWorks and Altium Designer?',
      a: 'Yes! All registered attendees receive guided assistance to activate 60-day full-feature educational licenses for both SolidWorks 2024 and Altium Designer 24, along with verified DRC rules and 3D CAD template libraries.'
    },
    {
      q: 'What is the difference between In-Person Lab and Virtual Stream attendance?',
      a: 'In-person delegates work directly at our Silicon Valley hardware lab with dedicated dual-monitor CAD stations, soldering equipment, and take-home physical dev kits. Virtual attendees participate via a low-latency 4K multi-camera stream with live Discord mentor Q&A.'
    },
    {
      q: 'Will I receive an official certificate upon completion?',
      a: 'Yes. Attendees who complete the 3-day lab and capstone project will be awarded an official Accredited Certificate of Technical Completion in ECAD-MCAD Co-Design.'
    }
  ];

  const toggle = (idx) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section id="faq" style={{ padding: '90px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container" style={{ maxWidth: '820px' }}>
        <div style={{ marginBottom: '45px' }}>
          <span className="tag-badge font-mono" style={{ marginBottom: '14px' }}>
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 3.2vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginBottom: '12px' }}>
            Workshop Details & Accreditation.
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="pro-panel"
                style={{
                  borderRadius: '12px',
                  border: isOpen ? '1px solid var(--border-medium)' : '1px solid var(--border-subtle)',
                  background: isOpen ? '#10131d' : '#0a0b10',
                  overflow: 'hidden',
                  transition: 'all 0.2s ease'
                }}
              >
                <button
                  onClick={() => toggle(idx)}
                  style={{
                    width: '100%',
                    padding: '18px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    color={isOpen ? '#00e5ff' : '#687385'}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 22px 20px', color: '#8c96a8', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
