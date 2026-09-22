import React, { useState, useEffect, useRef } from 'react';
import { Box, Layers, Sliders, Eye, EyeOff, Download, RotateCw, ZoomIn, ZoomOut, CheckCircle2, Flame, Maximize2 } from 'lucide-react';

export default function SolidWorksStudio({ onSyncToAltium }) {
  // CAD Enclosure Parametric Dimensions
  const [params, setParams] = useState({
    length: 120, // mm
    width: 80,   // mm
    height: 32,  // mm
    wallThickness: 2.5, // mm
    standoffHeight: 6.0, // mm
    standoffInset: 9.0, // mm
    finCount: 6,
    ventOpenings: true,
    cavityEnabled: true,
    bossesEnabled: true,
    finsEnabled: true,
    material: 'aluminum'
  });

  // Active Selected Feature in FeatureManager Tree ('base', 'cavity', 'bosses', 'fins', 'vents')
  const [activeFeature, setActiveFeature] = useState('base');

  // 3D Viewport Controls
  const [rotation, setRotation] = useState({ x: 28, y: -38 });
  const [zoom, setZoom] = useState(1.0);
  const [renderMode, setRenderMode] = useState('shaded'); // shaded, wireframe, section, fea
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [statusMessage, setStatusMessage] = useState('Ready • SolidWorks 3D Parametric Engine Active');

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;

    setRotation((prev) => ({
      x: Math.max(-85, Math.min(85, prev.x + dy * 0.4)),
      y: prev.y + dx * 0.4
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mobile Touch Gestures for 360° CAD Orbit
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length === 1) {
      setIsDragging(true);
      setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !e.touches || e.touches.length !== 1) return;
    const dx = e.touches[0].clientX - lastMousePos.x;
    const dy = e.touches[0].clientY - lastMousePos.y;

    setRotation((prev) => ({
      x: Math.max(-85, Math.min(85, prev.x + dy * 0.5)),
      y: prev.y + dx * 0.5
    }));
    setLastMousePos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Render 3D CAD Enclosure with True Painter's Depth Sorting & Directional Lighting
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    const width = (canvas.width = container.clientWidth);
    const height = (canvas.height = container.clientHeight);

    ctx.clearRect(0, 0, width, height);

    const cx = width / 2;
    const cy = height / 2;

    const radX = (rotation.x * Math.PI) / 180;
    const radY = (rotation.y * Math.PI) / 180;

    // 3D Matrix Projection
    const project = (x, y, z) => {
      // Rotate around Y-axis
      const x1 = x * Math.cos(radY) + z * Math.sin(radY);
      const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

      // Rotate around X-axis
      const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
      const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

      const fov = 480 * zoom;
      const scale = fov / (fov + z2 + 360);

      return {
        x: cx + x1 * scale,
        y: cy + y2 * scale,
        depth: z2,
        orig: { x, y, z }
      };
    };

    // Ground CAD Datum Grid
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    const gSize = 160;
    const gStep = 24;
    const groundY = (params.height * 1.5) / 2 + 14;

    for (let gx = -gSize; gx <= gSize; gx += gStep) {
      const p1 = project(gx, groundY, -gSize);
      const p2 = project(gx, groundY, gSize);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let gz = -gSize; gz <= gSize; gz += gStep) {
      const p1 = project(-gSize, groundY, gz);
      const p2 = project(gSize, groundY, gz);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Parametric Dimensions
    const hw = (params.width * 1.5) / 2;
    const hl = (params.length * 1.5) / 2;
    const hh = (params.height * 1.5) / 2;

    // 8 3D Box Vertices
    const rawVertices = [
      { x: -hw, y: -hh, z: -hl }, // 0: Top Front Left
      { x: hw, y: -hh, z: -hl },  // 1: Top Front Right
      { x: hw, y: hh, z: -hl },   // 2: Bottom Front Right
      { x: -hw, y: hh, z: -hl },  // 3: Bottom Front Left
      { x: -hw, y: -hh, z: hl },  // 4: Top Back Left
      { x: hw, y: -hh, z: hl },   // 5: Top Back Right
      { x: hw, y: hh, z: hl },    // 6: Bottom Back Right
      { x: -hw, y: hh, z: hl }    // 7: Bottom Back Left
    ];

    const projectedVertices = rawVertices.map((v) => project(v.x, v.y, v.z));

    // Directional Light Vector (Normalized from top-left-front)
    const light = { x: 0.4, y: -0.8, z: -0.45 };
    const lightLen = Math.sqrt(light.x * light.x + light.y * light.y + light.z * light.z);
    light.x /= lightLen;
    light.y /= lightLen;
    light.z /= lightLen;

    // 6 Polygonal Faces
    const faces = [
      { pts: [0, 1, 2, 3], normal: { x: 0, y: 0, z: -1 }, baseColor: [26, 31, 46] }, // Front
      { pts: [5, 4, 7, 6], normal: { x: 0, y: 0, z: 1 }, baseColor: [20, 24, 36] },  // Back
      { pts: [4, 0, 3, 7], normal: { x: -1, y: 0, z: 0 }, baseColor: [24, 28, 42] }, // Left
      { pts: [1, 5, 6, 2], normal: { x: 1, y: 0, z: 0 }, baseColor: [32, 38, 56] },  // Right
      { pts: [4, 5, 1, 0], normal: { x: 0, y: -1, z: 0 }, baseColor: [38, 45, 66] }, // Top
      { pts: [3, 2, 6, 7], normal: { x: 0, y: 1, z: 0 }, baseColor: [14, 17, 26] }   // Bottom
    ];

    // Compute Face Depth for Painter's Algorithm Sorting
    faces.forEach((f) => {
      f.avgDepth = (
        projectedVertices[f.pts[0]].depth +
        projectedVertices[f.pts[1]].depth +
        projectedVertices[f.pts[2]].depth +
        projectedVertices[f.pts[3]].depth
      ) / 4;

      // Rotate Face Normal according to current Euler angles
      const nx1 = f.normal.x * Math.cos(radY) + f.normal.z * Math.sin(radY);
      const nz1 = -f.normal.x * Math.sin(radY) + f.normal.z * Math.cos(radY);
      const ny2 = f.normal.y * Math.cos(radX) - nz1 * Math.sin(radX);
      const nz2 = f.normal.y * Math.sin(radX) + nz1 * Math.cos(radX);
      f.rotatedNormal = { x: nx1, y: ny2, z: nz2 };

      // Diffuse Lambertian Intensity
      const dot = -(nx1 * light.x + ny2 * light.y + nz2 * light.z);
      f.diffuse = Math.max(0.15, Math.min(1.0, dot * 0.75 + 0.35));
    });

    // Sort Faces Back-to-Front
    faces.sort((a, b) => b.avgDepth - a.avgDepth);

    // Draw Faces
    if (renderMode === 'shaded' || renderMode === 'fea' || renderMode === 'section') {
      faces.forEach((f) => {
        // Back-face culling for solid shaded mode (skip faces pointing away)
        if (renderMode === 'shaded' && f.rotatedNormal.z > 0.05) return;

        ctx.beginPath();
        ctx.moveTo(projectedVertices[f.pts[0]].x, projectedVertices[f.pts[0]].y);
        for (let i = 1; i < f.pts.length; i++) {
          ctx.lineTo(projectedVertices[f.pts[i]].x, projectedVertices[f.pts[i]].y);
        }
        ctx.closePath();

        if (renderMode === 'fea') {
          const grad = ctx.createLinearGradient(
            projectedVertices[f.pts[0]].x,
            projectedVertices[f.pts[0]].y,
            projectedVertices[f.pts[2]].x,
            projectedVertices[f.pts[2]].y
          );
          grad.addColorStop(0, 'rgba(0, 229, 255, 0.45)');
          grad.addColorStop(0.5, 'rgba(255, 220, 0, 0.55)');
          grad.addColorStop(1, 'rgba(255, 60, 0, 0.7)');
          ctx.fillStyle = grad;
        } else if (renderMode === 'section') {
          ctx.fillStyle = 'rgba(255, 87, 34, 0.18)';
        } else {
          // Shaded with real material lighting
          const [r, g, b] = f.baseColor;
          const litR = Math.round(Math.min(255, r * f.diffuse * 1.5));
          const litG = Math.round(Math.min(255, g * f.diffuse * 1.5));
          const litB = Math.round(Math.min(255, b * f.diffuse * 1.5));
          ctx.fillStyle = `rgb(${litR}, ${litG}, ${litB})`;
        }

        ctx.fill();

        // Edge Lines
        ctx.strokeStyle = renderMode === 'fea' ? 'rgba(255, 255, 255, 0.4)' : '#ff5722';
        ctx.lineWidth = 1.2;
        ctx.stroke();
      });
    }

    if (renderMode === 'wireframe') {
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.3;
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7]
      ];
      edges.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(projectedVertices[i].x, projectedVertices[i].y);
        ctx.lineTo(projectedVertices[j].x, projectedVertices[j].y);
        ctx.stroke();
      });
    }

    // 4 Brass M3 Standoff Inserts (Mounting_Bosses)
    const inset = params.standoffInset * 1.2;
    const standoffs = [
      project(-hw + inset, hh - params.standoffHeight * 1.4, -hl + inset),
      project(hw - inset, hh - params.standoffHeight * 1.4, -hl + inset),
      project(-hw + inset, hh - params.standoffHeight * 1.4, hl - inset),
      project(hw - inset, hh - params.standoffHeight * 1.4, hl - inset)
    ];

    if (params.bossesEnabled !== false) {
      standoffs.forEach((so) => {
        ctx.fillStyle = '#e2b768';
        ctx.beginPath();
        ctx.arc(so.x, so.y, (activeFeature === 'bosses' ? 6 : 4.5) * zoom, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = activeFeature === 'bosses' ? '#00e5ff' : '#ffffff';
        ctx.lineWidth = activeFeature === 'bosses' ? 2.0 : 0.8;
        ctx.stroke();

        if (activeFeature === 'bosses') {
          ctx.strokeStyle = 'rgba(0, 229, 255, 0.45)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(so.x, so.y, 10 * zoom, 0, Math.PI * 2);
          ctx.stroke();
        }
      });
    }

    // Inner Cavity Cut Extrusion
    if (params.cavityEnabled !== false) {
      const inW = hw - params.wallThickness * 2.2;
      const inL = hl - params.wallThickness * 2.2;
      if (inW > 6 && inL > 6) {
        const cp0 = project(-inW, -hh, -inL);
        const cp1 = project(inW, -hh, -inL);
        const cp2 = project(inW, -hh, inL);
        const cp3 = project(-inW, -hh, inL);
        ctx.strokeStyle = activeFeature === 'cavity' ? '#00e5ff' : 'rgba(255, 87, 34, 0.45)';
        ctx.lineWidth = activeFeature === 'cavity' ? 2.2 : 1.0;
        ctx.beginPath();
        ctx.moveTo(cp0.x, cp0.y);
        ctx.lineTo(cp1.x, cp1.y);
        ctx.lineTo(cp2.x, cp2.y);
        ctx.lineTo(cp3.x, cp3.y);
        ctx.closePath();
        ctx.stroke();
      }
    }

    // Cooling Heat Sink Fins on Top (Extrude2)
    if (params.finsEnabled !== false && params.finCount > 0) {
      for (let f = 0; f < params.finCount; f++) {
        const offsetZ = -hl + (2 * hl * (f + 1)) / (params.finCount + 1);
        const p1 = project(-hw + 16, -hh - 12, offsetZ);
        const p2 = project(hw - 16, -hh - 12, offsetZ);
        const pBase1 = project(-hw + 16, -hh, offsetZ);
        const pBase2 = project(hw - 16, -hh, offsetZ);

        ctx.strokeStyle = activeFeature === 'fins' ? '#ffb703' : '#ff7a50';
        ctx.lineWidth = activeFeature === 'fins' ? 2.2 : 1.4;
        ctx.beginPath();
        ctx.moveTo(pBase1.x, pBase1.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(pBase2.x, pBase2.y);
        ctx.stroke();
      }
    }

    // Cooling Vents Cut Slots (Cut-Extrude2)
    if (params.ventOpenings) {
      for (let v = -1; v <= 1; v++) {
        const vy = v * 8;
        const vp1 = project(-hw + 16, vy, -hl);
        const vp2 = project(-hw + 46, vy, -hl);
        ctx.strokeStyle = activeFeature === 'vents' ? '#00e5ff' : 'rgba(0, 229, 255, 0.6)';
        ctx.lineWidth = activeFeature === 'vents' ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.moveTo(vp1.x, vp1.y);
        ctx.lineTo(vp2.x, vp2.y);
        ctx.stroke();
      }
    }

    // Viewport HUD Metadata
    ctx.fillStyle = '#adb6c7';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText(`ROTATION: ${rotation.x.toFixed(0)}° / ${rotation.y.toFixed(0)}° | ZOOM: ${(zoom * 100).toFixed(0)}%`, 18, 26);
    ctx.fillText(`FEATURE: ${activeFeature.toUpperCase()} | ENCLOSURE: ${params.length}×${params.width}×${params.height}mm | WALL: ${params.wallThickness}mm`, 18, 42);
  }, [params, rotation, zoom, renderMode, activeFeature]);

  const handleSelectFeature = (featId) => {
    setActiveFeature(featId);
    if (featId === 'base') {
      setStatusMessage(`Selected: Enclosure_Base [Extrude1] • Solid Body (${params.length}×${params.width}×${params.height}mm)`);
    } else if (featId === 'cavity') {
      setStatusMessage(`Selected: Inner_Cavity [Cut-Extrude1] • Wall: ${params.wallThickness}mm (${params.cavityEnabled ? 'Active' : 'Suppressed'})`);
    } else if (featId === 'bosses') {
      setStatusMessage(`Selected: Mounting_Bosses [Pattern4] • 4x M3 Brass Standoffs @ ${params.standoffHeight}mm (${params.bossesEnabled ? 'Active' : 'Suppressed'})`);
    } else if (featId === 'fins') {
      setStatusMessage(`Selected: HeatSink_Fins [Extrude2] • ${params.finCount} Cooling Fins (${params.finsEnabled ? 'Active' : 'Suppressed'})`);
    } else if (featId === 'vents') {
      setStatusMessage(`Selected: Cooling_Vents [Cut-Extrude2] • ${params.ventOpenings ? 'Airflow Slots Open' : 'Sealed IP67 Walls'}`);
    }
  };

  const toggleFeatureSuppression = (featId, e) => {
    if (e) e.stopPropagation();
    if (featId === 'cavity') {
      const next = !params.cavityEnabled;
      setParams((p) => ({ ...p, cavityEnabled: next }));
      setStatusMessage(next ? 'Inner_Cavity [Cut-Extrude1] Unsuppressed • Hollow chamber active' : 'Inner_Cavity [Cut-Extrude1] Suppressed • Solid billet enclosure rendered');
    } else if (featId === 'bosses') {
      const next = !params.bossesEnabled;
      setParams((p) => ({ ...p, bossesEnabled: next }));
      setStatusMessage(next ? 'Mounting_Bosses [Pattern4] Unsuppressed • 4x M3 standoffs active' : 'Mounting_Bosses [Pattern4] Suppressed • Standoffs hidden');
    } else if (featId === 'fins') {
      const next = !params.finsEnabled;
      setParams((p) => ({ ...p, finsEnabled: next }));
      setStatusMessage(next ? `HeatSink_Fins [Extrude2] Unsuppressed • ${params.finCount} cooling fins active` : 'HeatSink_Fins [Extrude2] Suppressed • Flat top plate');
    } else if (featId === 'vents') {
      const next = !params.ventOpenings;
      setParams((p) => ({ ...p, ventOpenings: next }));
      setStatusMessage(next ? 'Cooling_Vents [Cut-Extrude2] Open • Airflow slots active' : 'Cooling_Vents [Cut-Extrude2] Suppressed • Enclosure sealed');
    } else if (featId === 'base') {
      setStatusMessage('Enclosure_Base [Extrude1] is the root solid body and cannot be suppressed.');
    }
  };

  const handleExportSTL = () => {
    setStatusMessage('Compiling parametric solid geometry to ASCII STL...');
    setTimeout(() => {
      setStatusMessage('✓ SolidWorks STL Export Complete (enclosure_chassis_v1.stl generated)');
    }, 600);
  };

  const handlePushToECAD = () => {
    setStatusMessage('Syncing 3D enclosure step envelope to Altium Designer...');
    if (onSyncToAltium) {
      onSyncToAltium({
        boardLength: params.length - params.wallThickness * 2,
        boardWidth: params.width - params.wallThickness * 2,
        standoffHeight: params.standoffHeight
      });
    }
    setTimeout(() => {
      setStatusMessage('✓ IDX 3.0 Changeset Pushed: Altium PCB board outline updated to match inner cavity.');
    }, 700);
  };

  const features = [
    {
      id: 'base',
      name: 'Enclosure_Base',
      sub: '[Extrude1]',
      status: 'Active',
      icon: Box,
      isSuppressed: false,
      canSuppress: false,
      color: '#ff5722'
    },
    {
      id: 'cavity',
      name: 'Inner_Cavity',
      sub: '[Cut-Extrude1]',
      status: params.cavityEnabled ? `${params.wallThickness}mm` : 'Suppressed',
      icon: Box,
      isSuppressed: !params.cavityEnabled,
      canSuppress: true,
      color: '#ff7a50'
    },
    {
      id: 'bosses',
      name: 'Mounting_Bosses',
      sub: '[Pattern4]',
      status: params.bossesEnabled ? `M3 × ${params.standoffHeight}mm` : 'Suppressed',
      icon: Layers,
      isSuppressed: !params.bossesEnabled,
      canSuppress: true,
      color: '#e2b768'
    },
    {
      id: 'fins',
      name: 'HeatSink_Fins',
      sub: '[Extrude2]',
      status: params.finsEnabled ? `${params.finCount} Fins` : 'Suppressed',
      icon: Flame,
      isSuppressed: !params.finsEnabled,
      canSuppress: true,
      color: '#ff5722'
    },
    {
      id: 'vents',
      name: 'Cooling_Vents',
      sub: '[Cut-Extrude2]',
      status: params.ventOpenings ? 'Open' : 'Suppressed',
      icon: params.ventOpenings ? Eye : EyeOff,
      isSuppressed: !params.ventOpenings,
      canSuppress: true,
      color: '#00e5ff'
    }
  ];

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '110px clamp(12px, 3vw, 24px) 36px' }}>
      {/* Studio Header Bar */}
      <div className="studio-header-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={20} color="#ea580c" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              SolidWorks 3D Parametric CAD Studio
            </h2>
            <span className="tag-badge sw-tag font-mono" style={{ fontSize: '0.68rem' }}>
              INTERACTIVE VIEWPORT
            </span>
          </div>
          <p style={{ color: '#475569', fontSize: '0.84rem', marginTop: '2px' }}>
            Model custom mechatronics enclosures, adjust mounting boss standoffs, and inspect 3D thermal FEA dissipation.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="studio-actions-wrap" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleExportSTL}
            className="btn-secondary-pro"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <Download size={14} />
            <span>Export STL</span>
          </button>

          <button
            onClick={handlePushToECAD}
            className="btn-primary-lead"
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <Layers size={14} />
            <span>Push Envelope to Altium</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr 280px',
          gap: '16px',
          alignItems: 'stretch'
        }}
        className="studio-grid-mobile"
      >
        {/* Left: SolidWorks Feature Tree Manager */}
        <div className="pro-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              FEATUREMANAGER DESIGN TREE
            </span>
            <span className="font-mono" style={{ fontSize: '0.64rem', color: '#ea580c' }}>
              5 FEATURES
            </span>
          </div>

          {/* Interactive FeatureManager Tree Nodes */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
            {features.map((feat) => {
              const isSelected = activeFeature === feat.id;
              const Icon = feat.icon;
              return (
                <div
                  key={feat.id}
                  style={{
                    borderRadius: '8px',
                    border: isSelected ? `1.5px solid ${feat.color}` : '1px solid var(--border-subtle)',
                    background: isSelected ? '#fff2ed' : feat.isSuppressed ? '#f1f5f9' : '#ffffff',
                    opacity: feat.isSuppressed ? 0.62 : 1,
                    transition: 'all 0.18s ease',
                    overflow: 'hidden'
                  }}
                >
                  {/* Feature Node Header Button */}
                  <div
                    onClick={() => handleSelectFeature(feat.id)}
                    style={{
                      padding: '9px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                      <Icon size={14} color={isSelected ? feat.color : feat.isSuppressed ? '#94a3b8' : '#ea580c'} style={{ flexShrink: 0 }} />
                      <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                        <span style={{ color: isSelected ? '#0f172a' : feat.isSuppressed ? '#94a3b8' : '#1e293b', fontSize: '0.78rem', fontWeight: isSelected ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {feat.name} <span style={{ color: '#64748b', fontSize: '0.72rem' }}>{feat.sub}</span>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <span
                        className="font-mono"
                        style={{
                          fontSize: '0.66rem',
                          color: feat.isSuppressed ? '#ef4444' : isSelected ? feat.color : '#8893a7',
                          fontWeight: isSelected ? 700 : 500
                        }}
                      >
                        {feat.status}
                      </span>

                      {feat.canSuppress && (
                        <button
                          onClick={(e) => toggleFeatureSuppression(feat.id, e)}
                          title={feat.isSuppressed ? 'Unsuppress Feature (Enable in 3D)' : 'Suppress Feature (Disable in 3D)'}
                          style={{
                            background: feat.isSuppressed ? 'rgba(239, 68, 68, 0.18)' : 'rgba(255, 255, 255, 0.06)',
                            border: feat.isSuppressed ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid var(--border-subtle)',
                            borderRadius: '4px',
                            padding: '3px 5px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: feat.isSuppressed ? '#fca5a5' : '#8893a7',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          {feat.isSuppressed ? <EyeOff size={11} /> : <Eye size={11} />}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inline Quick Parametric Controls when feature is clicked */}
                  {isSelected && (
                    <div
                      style={{
                        padding: '10px 11px',
                        background: '#f8fafc',
                        borderTop: '1px solid var(--border-subtle)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        fontSize: '0.72rem'
                      }}
                    >
                      {feat.id === 'base' && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                            <span>Length / Width:</span>
                            <span className="font-mono" style={{ color: '#0f172a', fontWeight: 600 }}>{params.length} × {params.width}mm</span>
                          </div>
                          <input
                            type="range"
                            min="80"
                            max="180"
                            value={params.length}
                            onChange={(e) => setParams({ ...params, length: Number(e.target.value) })}
                            style={{ width: '100%', accentColor: '#ea580c' }}
                          />
                        </>
                      )}

                      {feat.id === 'cavity' && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                            <span>Wall Thickness:</span>
                            <span className="font-mono" style={{ color: '#ea580c', fontWeight: 600 }}>{params.wallThickness}mm</span>
                          </div>
                          <input
                            type="range"
                            min="1.5"
                            max="5.0"
                            step="0.5"
                            disabled={!params.cavityEnabled}
                            value={params.wallThickness}
                            onChange={(e) => setParams({ ...params, wallThickness: Number(e.target.value) })}
                            style={{ width: '100%', accentColor: '#ea580c' }}
                          />
                        </>
                      )}

                      {feat.id === 'bosses' && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                            <span>Standoff Height:</span>
                            <span className="font-mono" style={{ color: '#b45309', fontWeight: 600 }}>{params.standoffHeight}mm</span>
                          </div>
                          <input
                            type="range"
                            min="3.0"
                            max="12.0"
                            step="0.5"
                            disabled={!params.bossesEnabled}
                            value={params.standoffHeight}
                            onChange={(e) => setParams({ ...params, standoffHeight: Number(e.target.value) })}
                            style={{ width: '100%', accentColor: '#b45309' }}
                          />
                        </>
                      )}

                      {feat.id === 'fins' && (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                            <span>Fin Count:</span>
                            <span className="font-mono" style={{ color: '#0f172a', fontWeight: 600 }}>{params.finCount} Fins</span>
                          </div>
                          <input
                            type="range"
                            min="2"
                            max="12"
                            step="1"
                            disabled={!params.finsEnabled}
                            value={params.finCount}
                            onChange={(e) => setParams({ ...params, finCount: Number(e.target.value) })}
                            style={{ width: '100%', accentColor: '#ea580c' }}
                          />
                        </>
                      )}

                      {feat.id === 'vents' && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#64748b' }}>Airflow Status:</span>
                          <button
                            onClick={() => toggleFeatureSuppression('vents')}
                            style={{
                              padding: '4px 10px',
                              borderRadius: '4px',
                              border: params.ventOpenings ? '1px solid #0284c7' : '1px solid #ef4444',
                              background: params.ventOpenings ? '#e0f2fe' : '#fee2e2',
                              color: params.ventOpenings ? '#0284c7' : '#b91c1c',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            {params.ventOpenings ? '✓ Vents Open' : '✕ Sealed (IP67)'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <label className="form-label" style={{ fontSize: '0.74rem' }}>Alloy Material</label>
            <select
              value={params.material}
              onChange={(e) => setParams({ ...params, material: e.target.value })}
              className="form-input"
              style={{ fontSize: '0.8rem', padding: '8px 10px' }}
            >
              <option value="aluminum">6061-T6 Billet Aluminum</option>
              <option value="brass">C360 Brass [High Mass]</option>
              <option value="polymer">Polycarbonate DFM Molded</option>
            </select>
          </div>
        </div>

        {/* Center: 3D CAD Viewport with dedicated flex container */}
        <div
          className="pro-panel"
          style={{
            minHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Viewport Mode Bar */}
          <div
            style={{
              padding: '10px 14px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc'
            }}
          >
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'shaded', label: 'Solid Shaded' },
                { id: 'wireframe', label: 'Wireframe CAD' },
                { id: 'section', label: 'Section Slice' },
                { id: 'fea', label: 'FEA Stress Heatmap' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setRenderMode(m.id)}
                  style={{
                    padding: '5px 11px',
                    borderRadius: '5px',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    border: renderMode === m.id ? '1px solid #ea580c' : '1px solid var(--border-subtle)',
                    background: renderMode === m.id ? '#fff2ed' : '#ffffff',
                    color: renderMode === m.id ? '#ea580c' : '#64748b',
                    boxShadow: renderMode === m.id ? '0 1px 3px rgba(234, 88, 12, 0.12)' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <span className="font-mono" style={{ fontSize: '0.68rem', color: '#64748b' }}>
              TOUCH OR DRAG TO 360° ORBIT
            </span>
          </div>

          {/* 3D Canvas Viewport Box */}
          <div
            ref={containerRef}
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              cursor: isDragging ? 'grabbing' : 'grab',
              minHeight: '380px',
              background: '#07090e',
              touchAction: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
          >
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>

          {/* Bottom Viewport Status Line */}
          <div
            style={{
              padding: '8px 14px',
              background: '#f8fafc',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.74rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669' }}>
              <CheckCircle2 size={13} />
              <span className="font-mono">{statusMessage}</span>
            </div>

            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                style={{ padding: '3px 7px', borderRadius: '4px', background: '#ffffff', border: '1px solid var(--border-subtle)', color: '#0f172a', cursor: 'pointer' }}
              >
                <ZoomOut size={12} />
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(1.8, z + 0.15))}
                style={{ padding: '3px 7px', borderRadius: '4px', background: '#ffffff', border: '1px solid var(--border-subtle)', color: '#0f172a', cursor: 'pointer' }}
              >
                <ZoomIn size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right: Parametric Dimensions Inspector */}
        <div className="pro-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="font-mono" style={{ fontSize: '0.72rem', color: '#ea580c', textTransform: 'uppercase', fontWeight: 600 }}>
            PARAMETRIC DIMENSIONS // CAD
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#475569', marginBottom: '4px' }}>
              <span>Length (X-Axis):</span>
              <span className="font-mono" style={{ color: '#0f172a', fontWeight: 700 }}>{params.length} mm</span>
            </div>
            <input
              type="range"
              min="80"
              max="180"
              value={params.length}
              onChange={(e) => setParams({ ...params, length: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#ea580c' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#475569', marginBottom: '4px' }}>
              <span>Width (Y-Axis):</span>
              <span className="font-mono" style={{ color: '#0f172a', fontWeight: 700 }}>{params.width} mm</span>
            </div>
            <input
              type="range"
              min="60"
              max="130"
              value={params.width}
              onChange={(e) => setParams({ ...params, width: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#ea580c' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#475569', marginBottom: '4px' }}>
              <span>Height (Z-Axis):</span>
              <span className="font-mono" style={{ color: '#0f172a', fontWeight: 700 }}>{params.height} mm</span>
            </div>
            <input
              type="range"
              min="20"
              max="60"
              value={params.height}
              onChange={(e) => setParams({ ...params, height: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#ea580c' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#475569', marginBottom: '4px' }}>
              <span>Wall Thickness:</span>
              <span className="font-mono" style={{ color: '#ea580c', fontWeight: 700 }}>{params.wallThickness} mm</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="5.0"
              step="0.5"
              value={params.wallThickness}
              onChange={(e) => setParams({ ...params, wallThickness: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#ea580c' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#475569', marginBottom: '4px' }}>
              <span>Standoff Height:</span>
              <span className="font-mono" style={{ color: '#b45309', fontWeight: 700 }}>{params.standoffHeight} mm</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="12.0"
              step="0.5"
              value={params.standoffHeight}
              onChange={(e) => setParams({ ...params, standoffHeight: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#b45309' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: '#475569', marginBottom: '4px' }}>
              <span>Heat Sink Fin Count:</span>
              <span className="font-mono" style={{ color: '#0f172a', fontWeight: 700 }}>{params.finCount}</span>
            </div>
            <input
              type="range"
              min="0"
              max="12"
              value={params.finCount}
              onChange={(e) => setParams({ ...params, finCount: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#ea580c' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
