import React from 'react';
import { Box, Cpu, Sparkles, Wifi, ShieldCheck } from 'lucide-react';

export default function LivePassPreview({ formData }) {
  const track = formData.track || 'both_mechatronics';
  const name = (formData.fullName || 'DELEGATE NAME').toUpperCase();
  const institution = (formData.institution || 'INSTITUTION / UNIVERSITY').toUpperCase();
  const department = (formData.department || 'DEPARTMENT OF ENGINEERING').toUpperCase();
  const regNumber = formData.regNumber ? `ROLL/ID: ${formData.regNumber.toUpperCase()}` : 'DELEGATE PASS';
  const attendanceMode = formData.attendanceMode === 'virtual' ? 'VIRTUAL INTERACTIVE 4K STREAM' : 'IN-PERSON HARDWARE LAB BENCH';

  const isSolidworks = track === 'solidworks';
  const isAltium = track === 'altium';

  const accentColor = isSolidworks ? '#ff5722' : isAltium ? '#00e5ff' : '#e2b768';
  const trackTitle = isSolidworks
    ? 'TRACK 01 // SOLIDWORKS 3D CAD'
    : isAltium
    ? 'TRACK 02 // ALTIUM HIGH-SPEED ECAD'
    : 'TRACK 03 // UNIFIED CO-DESIGN FELLOW';

  return (
    <div style={{ width: '100%', maxWidth: '380px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span className="font-mono" style={{ fontSize: '0.72rem', color: '#687385', letterSpacing: '0.04em' }}>
          DELEGATE ACCREDITATION BADGE // FR4
        </span>
        <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600 }}>
          Live Generated
        </span>
      </div>

      {/* The Physical Matte Black FR4 PCB Badge */}
      <div
        style={{
          borderRadius: '16px',
          background: '#090a0f',
          border: '1.5px solid var(--border-medium)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          padding: '24px 22px 0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Precision Laser Lanyard Slot */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
          <span className="font-mono" style={{ fontSize: '0.62rem', color: '#3f4757' }}>+ FID-01</span>
          <div
            style={{
              width: '54px',
              height: '8px',
              borderRadius: '999px',
              background: '#040407',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.9)'
            }}
          />
          <span className="font-mono" style={{ fontSize: '0.62rem', color: '#3f4757' }}>+ FID-02</span>
        </div>

        {/* Badge Header with Silk-screen Logos */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: '#121520',
                border: `1px solid ${accentColor}60`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isSolidworks ? <Box size={14} color="#ff5722" /> : isAltium ? <Cpu size={14} color="#00e5ff" /> : <Sparkles size={14} color="#e2b768" />}
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#fff', letterSpacing: '0.04em' }}>
                SW ✕ ALTIUM
              </div>
              <div className="font-mono" style={{ fontSize: '0.62rem', color: '#687385' }}>
                WORKSHOP // 2026
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Wifi size={13} color={accentColor} />
            <span className="font-mono" style={{ fontSize: '0.65rem', color: accentColor, fontWeight: 700 }}>
              VERIFIED // SEAT
            </span>
          </div>
        </div>

        {/* Delegate Information */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '0.64rem', color: '#626d82', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '3px' }}>
            {regNumber}
          </div>
          <div
            style={{
              fontSize: '1.3rem',
              fontWeight: 800,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
              marginBottom: '4px',
              wordBreak: 'break-word'
            }}
          >
            {name}
          </div>
          <div style={{ fontSize: '0.84rem', color: accentColor, fontWeight: 600 }}>
            {institution}
          </div>
          <div className="font-mono" style={{ fontSize: '0.7rem', color: '#8893a7', marginTop: '2px' }}>
            {department}
          </div>
        </div>

        {/* Track Access Pill */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            marginBottom: '18px'
          }}
        >
          <div className="font-mono" style={{ fontSize: '0.72rem', fontWeight: 700, color: '#ffffff' }}>
            {trackTitle}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
            <span className="font-mono" style={{ fontSize: '0.66rem', color: '#7e8b9b' }}>{attendanceMode}</span>
            <span className="font-mono" style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>CONFIRMED</span>
          </div>
        </div>

        {/* Silkscreen Barcode */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', gap: '2px', height: '22px', alignItems: 'center' }}>
              {[2, 1, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 2].map((h, i) => (
                <div key={i} style={{ width: '2.5px', height: `${h * 4 + 6}px`, background: i % 4 === 0 ? accentColor : '#ffffff', opacity: 0.85 }} />
              ))}
            </div>
            <div className="font-mono" style={{ fontSize: '0.62rem', color: '#555f70', marginTop: '3px' }}>
              ID // SW-ALT-WORKSHOP-2026
            </div>
          </div>

          <div
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              background: '#040407',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'center'
            }}
          >
            <div className="font-mono" style={{ fontSize: '0.6rem', color: '#687385' }}>BENCH</div>
            <div className="font-mono" style={{ fontSize: '0.76rem', color: '#fff', fontWeight: 700 }}>LAB-01</div>
          </div>
        </div>

        {/* ENIG Gold Contact Edge Fingers */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '6px',
            margin: '0 -22px',
            padding: '6px 12px 0',
            background: '#05060a'
          }}
        >
          {Array.from({ length: 22 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: '6px',
                height: '16px',
                background: '#e2b768',
                borderRadius: '1px 1px 0 0',
                opacity: 0.9,
                boxShadow: '0 0 2px rgba(226, 183, 104, 0.4)'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
