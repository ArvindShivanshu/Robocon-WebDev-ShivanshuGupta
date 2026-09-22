import React, { useState, useEffect } from 'react';
import CircuitCanvas from './components/CircuitCanvas.jsx';
import Navbar from './components/Navbar.jsx';
import HeroSection from './components/HeroSection.jsx';
import TrackCards from './components/TrackCards.jsx';
import InteractiveCoDesignDemo from './components/InteractiveCoDesignDemo.jsx';
import CurriculumTimeline from './components/CurriculumTimeline.jsx';
import SpeakersSection from './components/SpeakersSection.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';
import TicketConfirmationModal from './components/TicketConfirmationModal.jsx';
import FAQSection from './components/FAQSection.jsx';
import Footer from './components/Footer.jsx';

// In-Browser Studios
import SolidWorksStudio from './components/studio/SolidWorksStudio.jsx';
import AltiumStudio from './components/studio/AltiumStudio.jsx';
import CoDesignBridge from './components/studio/CoDesignBridge.jsx';

// React Bits Library
import { ClickSpark, Squares, FluidSimulation } from './components/reactbits';

export default function App() {
  const [workshopData, setWorkshopData] = useState(null);
  const [selectedTrack, setSelectedTrack] = useState('both_mechatronics');
  const [confirmedRegistration, setConfirmedRegistration] = useState(null);
  const [activeStudioMode, setActiveStudioMode] = useState('portal'); // 'portal', 'solidworks', 'altium', 'codesign'
  const [coDesignEnvelope, setCoDesignEnvelope] = useState({
    boardWidth: 114,
    boardLength: 74,
    standoffHeight: 6.0
  });


  // Reset window scroll position to the very top whenever switching studio modes / pages
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeStudioMode]);

  // Fetch live workshop info from Express Backend (PERN) with timeout guard
  useEffect(() => {
    async function fetchStats() {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        const res = await fetch('/api/workshop/info', { signal: controller.signal });
        clearTimeout(timeoutId);
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setWorkshopData(data.data);
          }
        }
      } catch (err) {
        // Quiet fallback to built-in workshop data if backend is offline or static hosting
      }
    }
    fetchStats();
  }, []);

  const handleRegisterSuccess = (registration, updatedSeats) => {
    setConfirmedRegistration(registration);
    if (updatedSeats && workshopData) {
      setWorkshopData((prev) => ({
        ...prev,
        workshop: {
          ...prev.workshop,
          solidworks_seats_left: updatedSeats.solidworks_left,
          altium_seats_left: updatedSeats.altium_left,
          booked_lab_seats: updatedSeats.booked
        }
      }));
    }
  };

  return (
    <ClickSpark sparkColor={['#0f172a', '#0284c7', '#ea580c', '#f59e0b']} sparkCount={5} sparkRadius={16} sparkSize={7}>
      <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-core)', margin: 0, padding: 0, border: 'none', outline: 'none', width: '100%', overflowX: 'hidden' }}>
        
        {/* Ambient Hero Background & Fluid Vortex from rbp-ai-saas-template */}
        {activeStudioMode === 'portal' && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              width: '100%',
              height: '920px',
              overflow: 'hidden',
              pointerEvents: 'none',
              zIndex: 0
            }}
            aria-hidden="true"
          >
            {/* Soft Ambient Lower Glow matching rbp-ai-saas-template */}
            <div
              style={{
                position: 'absolute',
                top: '320px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100vw',
                maxWidth: '1920px',
                height: '600px',
                background: 'radial-gradient(ellipse 85% 65% at 50% 90%, rgba(115, 136, 223, 0.25) 0%, rgba(51, 61, 167, 0.10) 45%, transparent 75%)',
                filter: 'blur(35px)',
                pointerEvents: 'none'
              }}
            />

            {/* Glowing Periwinkle/Royal Blue Radial Aura */}
            <div
              style={{
                position: 'absolute',
                top: '120px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: 'min(90vw, 860px)',
                height: '420px',
                borderRadius: '50%',
                background: 'radial-gradient(ellipse at center, rgba(147, 197, 253, 0.28) 0%, rgba(199, 210, 254, 0.14) 50%, transparent 75%)',
                filter: 'blur(50px)',
                pointerEvents: 'none'
              }}
            />

            {/* Interactive Navier-Stokes WebGL Fluid Vortex from rbp-ai-saas-template */}
            <FluidSimulation
              color={{ r: 0.21, g: 0.18, b: 0.51 }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                mixBlendMode: 'multiply',
                filter: 'blur(8px)',
                zIndex: 1
              }}
            />

            {/* Soft linear fade into page background */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                bottom: 0,
                height: '240px',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(248, 250, 252, 0.8) 70%, var(--bg-core) 100%)',
                pointerEvents: 'none',
                zIndex: 2
              }}
            />
          </div>
        )}

        {/* Minimalist Interactive Drafting Paper Grid */}
        <Squares
          direction="diagonal"
          speed={0.18}
          squareSize={56}
          borderColor="rgba(15, 23, 42, 0.04)"
          hoverFillColor="rgba(6, 182, 212, 0.05)"
          style={{ zIndex: 0 }}
        />

        {/* Single, Unified Master Navigation Bar */}
        <Navbar
          activeMode={activeStudioMode}
          setActiveMode={setActiveStudioMode}
          seatsLeft={workshopData?.workshop?.total_lab_seats - (workshopData?.workshop?.booked_lab_seats || 0)}
        />

        {/* STUDIO VIEWS - Persistently mounted to preserve all custom CAD dimensions, 3D orbits, placed chips, routes, and edits */}
        <div style={{ display: activeStudioMode === 'solidworks' ? 'block' : 'none' }}>
          <SolidWorksStudio
            isActive={activeStudioMode === 'solidworks'}
            onSyncToAltium={(env) => {
              setCoDesignEnvelope(env);
              setActiveStudioMode('altium');
            }}
          />
        </div>

        <div style={{ display: activeStudioMode === 'altium' ? 'block' : 'none' }}>
          <AltiumStudio
            isActive={activeStudioMode === 'altium'}
            boardDimensions={coDesignEnvelope}
            onSyncToSolidWorks={(data) => {
              setActiveStudioMode('codesign');
            }}
          />
        </div>

        <div style={{ display: activeStudioMode === 'codesign' ? 'block' : 'none' }}>
          <CoDesignBridge />
        </div>

        <div style={{ display: activeStudioMode === 'portal' ? 'block' : 'none' }}>
          {/* WORKSHOP HUB & REGISTRATION PORTAL */}
          <main style={{ position: 'relative', zIndex: 2 }}>
            <HeroSection
              workshop={workshopData?.workshop}
              onSelectTrack={(track) => setSelectedTrack(track)}
            />

            <TrackCards onSelectTrack={(track) => setSelectedTrack(track)} />

            <InteractiveCoDesignDemo />

            <CurriculumTimeline />

            <SpeakersSection speakers={workshopData?.faculty} />

            {/* The Central Registration Component */}
            <RegistrationForm
              selectedTrack={selectedTrack}
              onRegisterSuccess={handleRegisterSuccess}
              workshopStats={workshopData?.workshop}
            />

            <FAQSection />
          </main>
        </div>

        <Footer />

        {/* Registration Confirmation Modal */}
        {confirmedRegistration && (
          <TicketConfirmationModal
            registration={confirmedRegistration}
            onClose={() => setConfirmedRegistration(null)}
          />
        )}
      </div>
    </ClickSpark>
  );
}
