import React, { useState } from 'react';
import { Layers, Box, Cpu, RefreshCw, CheckCircle2, AlertTriangle, ArrowLeftRight, Download, ShieldCheck } from 'lucide-react';

export default function CoDesignBridge() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncHistory, setSyncHistory] = useState([
    { id: 1, time: '10:14 AM', author: 'Altium Designer', action: 'Pushed PCB outline & 4× M3 mounting holes', status: 'Accepted in SolidWorks' },
    { id: 2, time: '10:28 AM', author: 'SolidWorks MCAD', action: 'Shifted USB-C port cutout +1.2mm for bezel clearance', status: 'Updated in Altium' }
  ]);

  const [standoffHeight, setStandoffHeight] = useState(6.0);
  const [collisionDetected, setCollisionDetected] = useState(false);

  const handlePushSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const newEntry = {
        id: syncHistory.length + 1,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        author: 'CoDesigner IDX 3.0 Bridge',
        action: `Bi-directional sync completed: Standoff locked at ${standoffHeight}mm. 0 interference collisions.`,
        status: 'Synchronized'
      };
      setSyncHistory([newEntry, ...syncHistory]);
    }, 800);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '16px auto', padding: '0 clamp(12px, 3vw, 24px)' }}>
      {/* Header */}
      <div className="studio-header-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="#e2b768" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
              Bi-Directional ECAD-MCAD CoDesigner Bridge
            </h2>
            <span className="tag-badge enig-tag font-mono" style={{ fontSize: '0.7rem' }}>
              IDX 3.0 PROTOCOL
            </span>
          </div>
          <p style={{ color: '#8c96a8', fontSize: '0.85rem', marginTop: '2px' }}>
            Live bi-directional changeset push/pull between Altium Designer and SolidWorks. Zero manual DXF/STEP conversion errors.
          </p>
        </div>

        <button
          onClick={handlePushSync}
          disabled={isSyncing}
          className="btn-primary-lead"
          style={{ padding: '9px 20px', fontSize: '0.86rem' }}
        >
          <RefreshCw size={14} className={isSyncing ? 'rotating' : ''} />
          <span>{isSyncing ? 'Synchronizing Models...' : 'Push / Pull IDX Changeset'}</span>
        </button>
      </div>

      {/* Main CoDesign Studio Dashboard */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}
        className="demo-grid-mobile"
      >
        {/* Left Card: SolidWorks Enclosure State */}
        <div className="pro-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Box size={18} color="#ff5722" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>SolidWorks Assembly Model</h3>
            </div>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#ff7a50' }}>MCAD // 6061 ALUMINUM</span>
          </div>

          <div style={{ background: '#090a0f', borderRadius: '10px', padding: '18px', border: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>INNER CAVITY BOUNDS</span>
                <strong className="font-mono" style={{ color: '#fff' }}>115.0mm × 75.0mm</strong>
              </div>
              <div>
                <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>STANDOFF BOSS HEIGHT</span>
                <strong className="font-mono" style={{ color: '#e2b768' }}>{standoffHeight.toFixed(1)}mm [M3 INSERT]</strong>
              </div>
              <div>
                <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>USB-C BEZEL CUTOUT</span>
                <strong style={{ color: '#10b981' }}>Aligned (+0.2mm clearance)</strong>
              </div>
              <div>
                <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>LID INTERFERENCE</span>
                <strong style={{ color: '#10b981' }}>0 Collisions Detected</strong>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#8893a7', lineHeight: 1.5 }}>
            Any repositioning of the mounting bosses or enclosure ribs in SolidWorks automatically flags copper keepout zones in Altium Designer.
          </p>
        </div>

        {/* Right Card: Altium PCB Model State */}
        <div className="pro-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="#00e5ff" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Altium Designer Board Model</h3>
            </div>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#00e5ff' }}>ECAD // 12-LAYER STACKUP</span>
          </div>

          <div style={{ background: '#090a0f', borderRadius: '10px', padding: '18px', border: '1px solid var(--border-subtle)', marginBottom: '18px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem' }}>
              <div>
                <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>BOARD CONTOUR (OUTLINE)</span>
                <strong className="font-mono" style={{ color: '#fff' }}>114.0mm × 74.0mm</strong>
              </div>
              <div>
                <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>3D STEP COMPONENT PEAK</span>
                <strong className="font-mono" style={{ color: '#00e5ff' }}>3.20mm [FPGA BGA]</strong>
              </div>
              <div>
                <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>MOUNTING HOLE LOCATIONS</span>
                <strong style={{ color: '#10b981' }}>4× M3 Exact Match (0.0mm deviation)</strong>
              </div>
              <div>
                <span style={{ color: '#687385', display: 'block', fontSize: '0.7rem' }}>COPPER KEEPOUT VIOLATIONS</span>
                <strong style={{ color: '#10b981' }}>0 Keepout Breaches</strong>
              </div>
            </div>
          </div>

          <p style={{ fontSize: '0.82rem', color: '#8893a7', lineHeight: 1.5 }}>
            Moving the USB-C connector or BGA IC in Altium generates an automated changeset notification in the SolidWorks FeatureManager design tree.
          </p>
        </div>
      </div>

      {/* Real-time Changeset Audit Log */}
      <div className="pro-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ArrowLeftRight size={16} color="#e2b768" />
            <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>Bi-Directional Changeset History</h4>
          </div>
          <span className="font-mono" style={{ fontSize: '0.72rem', color: '#687385' }}>IDX PROTOCOL // VERSION 3.0</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {syncHistory.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                padding: '10px 14px',
                borderRadius: '8px',
                background: '#090a0f',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.82rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="font-mono" style={{ color: '#687385', fontSize: '0.75rem' }}>{item.time}</span>
                <strong style={{ color: item.author.includes('SolidWorks') ? '#ff7a50' : item.author.includes('Altium') ? '#00e5ff' : '#e2b768' }}>
                  {item.author}:
                </strong>
                <span style={{ color: '#cbd5e1' }}>{item.action}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.76rem' }}>
                <CheckCircle2 size={13} />
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
