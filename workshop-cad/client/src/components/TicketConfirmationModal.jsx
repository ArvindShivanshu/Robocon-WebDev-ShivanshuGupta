import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Download, Calendar, X, ShieldCheck } from 'lucide-react';

export default function TicketConfirmationModal({ registration, onClose }) {
  useEffect(() => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.65 },
      colors: ['#e2b768', '#00e5ff', '#ff5722', '#10b981']
    });
  }, []);

  if (!registration) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCalendar = () => {
    const title = encodeURIComponent('SolidWorks 3D CAD & Altium ECAD Workshop');
    const details = encodeURIComponent(
      `Workshop Registration Confirmed!\nRegistration ID: ${registration.registration_id || registration.ticket_code}\nTrack: ${registration.track}\nAttendee: ${registration.full_name}\nMode: ${registration.attendance_mode || 'In-Person'}`
    );
    const location = encodeURIComponent('Main Hardware Lab Bench & Live 4K Stream');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20261024T090000Z/20261026T173000Z`;
    window.open(url, '_blank');
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(5, 6, 10, 0.85)',
        backdropFilter: 'blur(20px)'
      }}
    >
      <div
        className="pro-panel"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '36px 32px',
          background: '#0c0e15',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.8)',
          position: 'relative'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: '#161924',
            border: '1px solid var(--border-subtle)',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#adb6c7',
            cursor: 'pointer'
          }}
        >
          <X size={16} />
        </button>

        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1.5px solid #10b981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}
          >
            <CheckCircle2 size={28} color="#10b981" />
          </div>

          <span className="font-mono" style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 600, letterSpacing: '0.04em' }}>
            REGISTRATION PROVISIONED // SUPABASE RECORD #{registration.id || 'OK'}
          </span>
          <h3 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
            Lab Workstation Confirmed
          </h3>
          <p style={{ color: '#8c96a8', fontSize: '0.88rem', marginTop: '4px' }}>
            Confirmation details and software license assistance dispatched to <strong style={{ color: '#fff' }}>{registration.email}</strong>.
          </p>
        </div>

        {/* Registration Card Spec */}
        <div
          style={{
            background: '#07080d',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '24px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#687385', textTransform: 'uppercase' }}>Registration Code</div>
              <div className="font-mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: '#e2b768', letterSpacing: '0.04em' }}>
                {registration.registration_id || registration.ticket_code}
              </div>
            </div>
            <span className="tag-badge font-mono" style={{ fontSize: '0.72rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
              100% FREE ADMISSION
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.84rem' }}>
            <div>
              <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>DELEGATE</span>
              <strong style={{ color: '#fff' }}>{registration.full_name}</strong>
            </div>
            <div>
              <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>INSTITUTION</span>
              <strong style={{ color: '#00e5ff' }}>{registration.institution}</strong>
            </div>
            <div>
              <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>TRACK</span>
              <strong style={{ color: '#ff7a50', textTransform: 'capitalize' }}>{registration.track?.replace('_', ' ')}</strong>
            </div>
            <div>
              <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>ATTENDANCE MODE</span>
              <strong style={{ color: '#fff', textTransform: 'capitalize' }}>{registration.attendance_mode?.replace('_', ' ') || 'In-Person'}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleCalendar}
            className="btn-secondary-pro"
            style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '0.88rem' }}
          >
            <Calendar size={15} />
            <span>Add to Calendar</span>
          </button>

          <button
            onClick={handlePrint}
            className="btn-primary-lead"
            style={{ flex: 1, justifyContent: 'center', padding: '12px', fontSize: '0.88rem' }}
          >
            <Download size={15} />
            <span>Print Delegate Pass</span>
          </button>
        </div>
      </div>
    </div>
  );
}
