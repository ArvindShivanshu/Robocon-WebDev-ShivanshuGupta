import React, { useState, useEffect } from 'react';
import { Box, Cpu, Layers, Loader2, ArrowRight, ShieldCheck, Check, Sparkles, UserCheck } from 'lucide-react';
import LivePassPreview from './LivePassPreview.jsx';
import { DecryptedText, SpecularButton } from './reactbits';

export default function RegistrationForm({ selectedTrack, onRegisterSuccess, workshopStats }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    institution: '',
    regNumber: '',
    department: 'Mechatronics Engineering',
    yearOrRole: '3rd Year B.Tech',
    track: selectedTrack || 'both_mechatronics',
    attendanceMode: 'in_person',
    experienceLevel: 'Intermediate',
    licenseAssistance: true,
    projectInterest: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (selectedTrack) {
      setFormData((prev) => ({ ...prev, track: selectedTrack }));
    }
  }, [selectedTrack]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.institution.trim() || !formData.department.trim()) {
      setErrorMsg('Please complete all required fields (Full Name, Email, Institution, Department).');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const response = await fetch('/api/workshop/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed. Please verify your inputs.');
      }

      if (onRegisterSuccess) {
        onRegisterSuccess(result.data.registration, result.data.updatedSeats);
      }
    } catch (err) {
      console.error('Registration submission error:', err);
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="registration-section" style={{ padding: '80px 0', position: 'relative', zIndex: 2 }}>
      <div className="page-container">
        {/* Section Header */}
        <div style={{ marginBottom: '38px', maxWidth: '640px' }}>
          <span className="tag-badge font-mono" style={{ marginBottom: '12px' }}>
            <DecryptedText text="REGISTRATION // DELEGATE ENROLLMENT" speed={25} maxIterations={10} animateOn="view" />
          </span>
          <h2 style={{ fontSize: 'clamp(1.9rem, 3vw, 2.6rem)', fontWeight: 750, letterSpacing: '-0.03em', color: '#0f172a', marginBottom: '10px' }}>
            Reserve Your Workshop Workstation.
          </h2>
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6 }}>
            Zero registration fee for engineering students, researchers, and developers. Complete your credentials to reserve a workstation or virtual stream seat.
          </p>
        </div>

        {/* Dual Grid: Registration Form + Live FR4 Delegate Badge */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 0.9fr)',
            gap: '36px',
            alignItems: 'start'
          }}
          className="reg-grid-mobile"
        >
          {/* Left: Professional Form */}
          <div className="pro-panel" style={{ padding: 'clamp(20px, 4vw, 38px) clamp(16px, 3.5vw, 34px)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
              {errorMsg && (
                <div
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    fontSize: '0.88rem'
                  }}
                >
                  {errorMsg}
                </div>
              )}

              {/* 1. Track Selection */}
              <div>
                <label className="form-label font-mono" style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  01 // SELECT WORKSHOP TRACK
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                  {[
                    { id: 'solidworks', name: 'SolidWorks 3D CAD', tag: 'Mechanical & FEA', icon: Box, accent: '#ea580c' },
                    { id: 'altium', name: 'Altium Designer', tag: '12-Layer ECAD', icon: Cpu, accent: '#0284c7' },
                    { id: 'both_mechatronics', name: 'Unified Co-Design', tag: 'Complete Fellowship', icon: Layers, accent: '#b45309' }
                  ].map((t) => {
                    const isSelected = formData.track === t.id;
                    const Icon = t.icon;
                    return (
                      <div
                        key={t.id}
                        onClick={() => setFormData((prev) => ({ ...prev, track: t.id }))}
                        style={{
                          padding: '14px 16px',
                          borderRadius: '10px',
                          border: isSelected ? `1.5px solid ${t.accent}` : '1px solid var(--border-subtle)',
                          background: isSelected ? '#ffffff' : '#f8fafc',
                          boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <Icon size={16} color={isSelected ? t.accent : '#64748b'} />
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>{t.name}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: isSelected ? t.accent : '#64748b' }}>{t.tag}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Personal & Academic Credentials */}
              <div>
                <label className="form-label font-mono" style={{ fontSize: '0.78rem', color: '#687385', marginBottom: '12px' }}>
                  02 // DELEGATE ACADEMIC / INSTITUTIONAL CREDENTIALS
                </label>

                <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Aditya Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Institutional / University Email *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="aditya.s@srmist.edu.in"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '14px' }}>
                  <div>
                    <label className="form-label">College / University / Lab *</label>
                    <input
                      type="text"
                      name="institution"
                      required
                      placeholder="e.g. SRM IST / MIT / IIT"
                      value={formData.institution}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                  <div>
                    <label className="form-label">Student Roll No. / Registration No.</label>
                    <input
                      type="text"
                      name="regNumber"
                      placeholder="e.g. RA2211003010482"
                      value={formData.regNumber}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-grid-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className="form-label">Department / Branch *</label>
                    <select
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="form-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Mechatronics Engineering">Mechatronics Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Electronics & Communication (ECE)">Electronics & Communication (ECE)</option>
                      <option value="Electrical & Electronics (EEE)">Electrical & Electronics (EEE)</option>
                      <option value="Robotics & Automation">Robotics & Automation</option>
                      <option value="Aerospace Engineering">Aerospace Engineering</option>
                      <option value="Computer Science / Embedded">Computer Science / Embedded</option>
                      <option value="Other Engineering Domain">Other Engineering Domain</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Year of Study / Designation *</label>
                    <select
                      name="yearOrRole"
                      value={formData.yearOrRole}
                      onChange={handleChange}
                      className="form-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="1st Year Undergrad">1st Year Undergrad</option>
                      <option value="2nd Year Undergrad">2nd Year Undergrad</option>
                      <option value="3rd Year Undergrad">3rd Year Undergrad</option>
                      <option value="Final Year B.Tech / B.E.">Final Year B.Tech / B.E.</option>
                      <option value="Postgraduate / M.Tech / PhD">Postgraduate / M.Tech / PhD</option>
                      <option value="Faculty / Research Staff">Faculty / Research Staff</option>
                      <option value="Industry Engineer">Industry Engineer</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 3. Attendance Mode & Software Setup */}
              <div>
                <label className="form-label font-mono" style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '12px' }}>
                  03 // ATTENDANCE MODE & LAB ASSISTANCE
                </label>

                {/* Mode Selector */}
                <div className="mode-selector-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, attendanceMode: 'in_person' }))}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: formData.attendanceMode === 'in_person' ? '1.5px solid #10b981' : '1px solid var(--border-subtle)',
                      background: formData.attendanceMode === 'in_person' ? '#ecfdf5' : '#f8fafc',
                      boxShadow: formData.attendanceMode === 'in_person' ? '0 1px 4px rgba(16, 185, 129, 0.12)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>🏢 In-Person Lab Bench</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Physical CAD rig + Hardware Kit</div>
                  </div>

                  <div
                    onClick={() => setFormData((prev) => ({ ...prev, attendanceMode: 'virtual' }))}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: formData.attendanceMode === 'virtual' ? '1.5px solid #0284c7' : '1px solid var(--border-subtle)',
                      background: formData.attendanceMode === 'virtual' ? '#f0f9ff' : '#f8fafc',
                      boxShadow: formData.attendanceMode === 'virtual' ? '0 1px 4px rgba(2, 132, 199, 0.12)' : 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a' }}>💻 Virtual 4K Stream</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Live Discord CAD room + Q&A</div>
                  </div>
                </div>

                {/* License Assistance Checkbox */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '0.86rem', color: '#334155' }}>
                  <input
                    type="checkbox"
                    name="licenseAssistance"
                    checked={formData.licenseAssistance}
                    onChange={handleChange}
                    style={{ accentColor: '#ea580c', width: '16px', height: '16px', marginTop: '2px' }}
                  />
                  <span>
                    <strong style={{ color: '#0f172a' }}>Request Educational License Assistance:</strong> I would like guidance obtaining 60-day student evaluation licenses for SolidWorks 2024 and Altium Designer 24.
                  </span>
                </label>
              </div>

              {/* Admission Notice Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 18px',
                  borderRadius: '10px',
                  background: '#f8fafc',
                  border: '1px solid var(--border-subtle)'
                }}
              >
                <ShieldCheck size={20} color="#10b981" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: '0.82rem', color: '#475569' }}>
                  <strong style={{ color: '#0f172a' }}>Zero Registration Fee:</strong> This workshop is fully sponsored by the Engineering Research Group. Workstations are reserved on a verified first-come, first-served basis.
                </div>
              </div>

              {/* Submit CTA with SpecularButton */}
              <SpecularButton
                type="submit"
                disabled={isSubmitting}
                variant="primary"
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '0.96rem'
                }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="rotating" />
                    <span>Confirming Registration...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Workshop Registration</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </SpecularButton>
            </form>
          </div>

          {/* Right: Real-time Physical Badge Preview */}
          <div style={{ position: 'sticky', top: '100px' }}>
            <LivePassPreview formData={formData} />
          </div>
        </div>
      </div>
    </section>
  );
}
