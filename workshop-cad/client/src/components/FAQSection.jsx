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
    <section id="faq" style={{ padding: '80px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container" style={{ maxWidth: '800px' }}>
        <div style={{ marginBottom: '36px' }}>
          <span className="tag-badge font-mono" style={{ marginBottom: '12px' }}>
            FAQ // ACCREDITATION & ACCESS
          </span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3vw, 2.5rem)', fontWeight: 750, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '10px' }}>
            Frequently Asked Questions.
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
                  background: '#ffffff',
                  boxShadow: isOpen ? '0 3px 12px rgba(0, 0, 0, 0.05)' : '0 1px 3px rgba(0, 0, 0, 0.03)',
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
                    color: '#0f172a',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={18}
                    color={isOpen ? '#0284c7' : '#64748b'}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      flexShrink: 0
                    }}
                  />
                </button>

                {isOpen && (
                  <div style={{ padding: '0 22px 20px', color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
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
