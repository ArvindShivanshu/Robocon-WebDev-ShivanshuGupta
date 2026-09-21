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

  // Sync route /workshopreg2 in URL bar
  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '') {
      window.history.replaceState(null, '', '/workshopreg2');
    }
  }, []);

  // Fetch live workshop info from Express Backend (PERN)
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/workshop/info');
        const data = await res.json();
        if (data.success) {
          setWorkshopData(data.data);
        }
      } catch (err) {
        console.warn('Could not fetch workshop stats, using defaults:', err);
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
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--bg-core)' }}>
      {/* Background Ambience */}
      <div className="ambient-mesh">
        <div className="ambient-orb-1" />
        <div className="ambient-orb-2" />
      </div>
      <CircuitCanvas />

      {/* Single, Unified Master Navigation Bar */}
      <Navbar
        activeMode={activeStudioMode}
        setActiveMode={setActiveStudioMode}
        seatsLeft={workshopData?.workshop?.total_lab_seats - (workshopData?.workshop?.booked_lab_seats || 0)}
      />

      {/* STUDIO VIEWS */}
      {activeStudioMode === 'solidworks' ? (
        <SolidWorksStudio
          onSyncToAltium={(env) => {
            setCoDesignEnvelope(env);
            setActiveStudioMode('altium');
          }}
        />
      ) : activeStudioMode === 'altium' ? (
        <AltiumStudio
          boardDimensions={coDesignEnvelope}
          onSyncToSolidWorks={(data) => {
            setActiveStudioMode('codesign');
          }}
        />
      ) : activeStudioMode === 'codesign' ? (
        <CoDesignBridge />
      ) : (
        /* WORKSHOP HUB & REGISTRATION PORTAL (/workshopreg2) */
        <main>
          <HeroSection
            workshop={workshopData?.workshop}
            onSelectTrack={(track) => setSelectedTrack(track)}
          />

          <TrackCards onSelectTrack={(track) => setSelectedTrack(track)} />

          <InteractiveCoDesignDemo />

          <CurriculumTimeline />

          <SpeakersSection speakers={workshopData?.faculty} />

          {/* The Central /workshopreg2 Registration Component */}
          <RegistrationForm
            selectedTrack={selectedTrack}
            onRegisterSuccess={handleRegisterSuccess}
            workshopStats={workshopData?.workshop}
          />

          <FAQSection />
        </main>
      )}

      <Footer />

      {/* Registration Confirmation Modal */}
      {confirmedRegistration && (
        <TicketConfirmationModal
          registration={confirmedRegistration}
          onClose={() => setConfirmedRegistration(null)}
        />
      )}
    </div>
  );
}
