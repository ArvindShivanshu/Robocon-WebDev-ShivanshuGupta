import React, { useState, useEffect, useRef } from 'react';
import {
  Cpu,
  Layers,
  Download,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Zap,
  RefreshCw,
  Plus,
  Trash2,
  Move,
  Eye,
  EyeOff,
  Activity,
  ArrowRight,
  Crosshair
} from 'lucide-react';

const INITIAL_COMPONENTS = [
  { id: 'U1', name: 'STM32F4 MCU', rx: -60, ry: 0, w: 68, h: 68, pins: 32, type: 'qfp', color: '#1a1d29' },
  { id: 'U2', name: 'High-Speed FPGA', rx: 70, ry: 0, w: 80, h: 80, pins: 48, type: 'bga', color: '#121520' },
  { id: 'J1', name: 'USB-C Receptacle', rx: -175, ry: 10, w: 38, h: 32, pins: 12, type: 'conn', color: '#2a2f40' },
  { id: 'U3', name: 'LDO 3.3V Reg', rx: -125, ry: -55, w: 32, h: 26, pins: 5, type: 'sot', color: '#1f2433' },
  { id: 'C1', name: 'Decoupling 100nF', rx: -10, ry: -40, w: 16, h: 10, pins: 2, type: 'smd', color: '#94a3b8' },
  { id: 'C2', name: 'Bulk Cap 10uF', rx: 14, ry: -40, w: 20, h: 12, pins: 2, type: 'smd', color: '#e2b768' },
  { id: 'H1', name: 'M3 Mount Hole', rx: -180, ry: -95, w: 18, h: 18, pins: 1, type: 'hole', color: '#e2b768' },
  { id: 'H2', name: 'M3 Mount Hole', rx: 180, ry: -95, w: 18, h: 18, pins: 1, type: 'hole', color: '#e2b768' },
  { id: 'H3', name: 'M3 Mount Hole', rx: -180, ry: 95, w: 18, h: 18, pins: 1, type: 'hole', color: '#e2b768' },
  { id: 'H4', name: 'M3 Mount Hole', rx: 180, ry: 95, w: 18, h: 18, pins: 1, type: 'hole', color: '#e2b768' }
];

const INITIAL_TRACES = [
  { id: 'TR_1', from: 'J1', to: 'U3', layer: 'L1_TOP', color: '#ef4444', width: 2.2 },
  { id: 'TR_2', from: 'U3', to: 'U1', layer: 'L3_PWR', color: '#e2b768', width: 2.0 },
  { id: 'TR_3', from: 'U1', to: 'U2', layer: 'L1_TOP', color: '#00e5ff', width: 1.6 },
  { id: 'TR_4', from: 'U2', to: 'H2', layer: 'L2_GND', color: '#10b981', width: 2.4 }
];

export default function AltiumStudio({ onSyncToSolidWorks, boardDimensions }) {
  const [boardSize, setBoardSize] = useState({
    width: boardDimensions?.boardWidth || 114,
    height: boardDimensions?.boardLength || 74
  });

  const [activeLayer, setActiveLayer] = useState('L1_TOP');
  const [activeTool, setActiveTool] = useState('select'); // 'select', 'route'
  const [selectedComp, setSelectedComp] = useState(null);
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [isolateLayer, setIsolateLayer] = useState(false);
  const [statusText, setStatusText] = useState('Altium 24 Engine Ready • 0 DRC Violations');
  const [drcPassed, setDrcPassed] = useState(true);
  const [violations, setViolations] = useState([]);

  // Live Component & Trace States
  const [components, setComponents] = useState(INITIAL_COMPONENTS);
  const [traces, setTraces] = useState(INITIAL_TRACES);

  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Interactive Routing State
  const [routingSourceId, setRoutingSourceId] = useState(null);
  const [mouseBoardPos, setMouseBoardPos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Coordinate conversion helper: Client Screen (px) -> PCB Coordinate Space (relative to center)
  const getBoardCoords = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const scale = Math.min(1, Math.max(0.55, (canvas.width - 24) / 440));

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return {
      x: (x - cx) / scale,
      y: (y - cy) / scale
    };
  };

  // Geometric Collision DRC Algorithm
  const detectCollisions = (comps) => {
    const colls = [];
    const clearanceMargin = 4; // 4px margin = ~0.2mm clearance
    for (let i = 0; i < comps.length; i++) {
      for (let j = i + 1; j < comps.length; j++) {
        const c1 = comps[i];
        const c2 = comps[j];
        const overlap =
          c1.rx - clearanceMargin < c2.rx + c2.w &&
          c1.rx + c1.w + clearanceMargin > c2.rx &&
          c1.ry - clearanceMargin < c2.ry + c2.h &&
          c1.ry + c1.h + clearanceMargin > c2.ry;

        if (overlap) {
          colls.push({ c1: c1.id, c2: c2.id });
        }
      }
    }
    return colls;
  };

  // Re-check collisions whenever components move
  useEffect(() => {
    const colls = detectCollisions(components);
    setViolations(colls);
    if (colls.length > 0) {
      setDrcPassed(false);
      setStatusText(`⚠️ DRC VIOLATION: Component collision between ${colls[0].c1} and ${colls[0].c2} (< 0.15mm clearance)`);
    } else {
      setDrcPassed(true);
    }
  }, [components]);

  // Render PCB Layout Canvas
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

    const scale = Math.min(1, Math.max(0.55, (width - 24) / 440));
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(scale, scale);

    const pcbW = 440;
    const pcbH = 250;
    const pcbX = -pcbW / 2;
    const pcbY = -pcbH / 2;

    // 1. Board Substrate (Isola FR408HR)
    ctx.fillStyle = '#080a10';
    ctx.fillRect(pcbX, pcbY, pcbW, pcbH);

    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.6;
    ctx.strokeRect(pcbX, pcbY, pcbW, pcbH);

    // 2. Fine Snap Grid
    ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
    for (let x = pcbX; x < pcbX + pcbW; x += 16) {
      for (let y = pcbY; y < pcbY + pcbH; y += 16) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // 3. Render 45° Dog-Leg Copper Traces
    traces.forEach((tr) => {
      const cFrom = components.find((c) => c.id === tr.from);
      const cTo = components.find((c) => c.id === tr.to);
      if (!cFrom || !cTo) return;

      const isTraceSelected = selectedTrace?.id === tr.id;
      const isLayerActive = tr.layer === activeLayer;

      // Opacity calculation for layer isolation
      let alpha = 1.0;
      if (isolateLayer && !isLayerActive) {
        alpha = 0.18;
      }

      ctx.save();
      ctx.globalAlpha = alpha;

      const x1 = cFrom.rx + cFrom.w / 2;
      const y1 = cFrom.ry + cFrom.h / 2;
      const x2 = cTo.rx + cTo.w / 2;
      const y2 = cTo.ry + cTo.h / 2;

      ctx.strokeStyle = isTraceSelected ? '#ffffff' : tr.color;
      ctx.lineWidth = isTraceSelected ? tr.width + 1.2 : tr.width;

      if (isTraceSelected || isLayerActive) {
        ctx.shadowColor = tr.color;
        ctx.shadowBlur = isTraceSelected ? 12 : 5;
      }

      ctx.beginPath();
      ctx.moveTo(x1, y1);

      const midX = (x1 + x2) / 2;
      ctx.lineTo(midX, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // Plated Via Teardrop Pads
      ctx.fillStyle = '#e2b768';
      ctx.beginPath();
      ctx.arc(x1, y1, 3.5, 0, Math.PI * 2);
      ctx.arc(x2, y2, 3.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    // 4. Render Live Airwire Guide if actively routing
    if (activeTool === 'route' && routingSourceId) {
      const src = components.find((c) => c.id === routingSourceId);
      if (src) {
        const sx = src.rx + src.w / 2;
        const sy = src.ry + src.h / 2;

        ctx.save();
        ctx.strokeStyle = '#e2b768';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(mouseBoardPos.x, mouseBoardPos.y);
        ctx.stroke();

        // Pulsing Source Ring
        ctx.setLineDash([]);
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(sx, sy, Math.max(src.w, src.h) / 2 + 6, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    }

    // 5. Render Components
    components.forEach((comp) => {
      const isSelected = selectedComp?.id === comp.id;
      const isRoutingSource = routingSourceId === comp.id;
      const isColliding = violations.some((v) => v.c1 === comp.id || v.c2 === comp.id);
      const px = comp.rx;
      const py = comp.ry;

      // Component Body
      ctx.fillStyle = isSelected ? '#1c2233' : comp.color;
      ctx.fillRect(px, py, comp.w, comp.h);

      // Border Styling
      if (isColliding) {
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = 2.4;
      } else if (isRoutingSource) {
        ctx.strokeStyle = '#e2b768';
        ctx.lineWidth = 2.2;
      } else if (isSelected) {
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 2.2;
      } else {
        ctx.strokeStyle = comp.type === 'hole' ? '#e2b768' : 'rgba(255, 255, 255, 0.22)';
        ctx.lineWidth = 1;
      }
      ctx.strokeRect(px, py, comp.w, comp.h);

      // Authentic Altium Diagonal DRC Error Stripes when colliding
      if (isColliding) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(px, py, comp.w, comp.h);
        ctx.clip();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.65)';
        ctx.lineWidth = 2;
        for (let s = -comp.h; s < comp.w + comp.h; s += 8) {
          ctx.beginPath();
          ctx.moveTo(px + s, py);
          ctx.lineTo(px + s + comp.h, py + comp.h);
          ctx.stroke();
        }
        ctx.restore();

        // DRC Warning Tag
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 9px "JetBrains Mono", monospace';
        ctx.fillText('DRC CLEARANCE!', px, py - 4);
      }

      // Pins / Pads
      if (comp.type === 'qfp' || comp.type === 'bga') {
        ctx.fillStyle = '#e2b768';
        for (let i = 4; i < comp.w - 4; i += 8) {
          ctx.fillRect(px + i, py - 3, 4, 3);
          ctx.fillRect(px + i, py + comp.h, 4, 3);
        }
        for (let j = 4; j < comp.h - 4; j += 8) {
          ctx.fillRect(px - 3, py + j, 3, 4);
          ctx.fillRect(px + comp.w, py + j, 3, 4);
        }
        // Pin 1 Index Notch
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(px + 7, py + 7, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (comp.type === 'hole') {
        ctx.fillStyle = '#0a0d14';
        ctx.beginPath();
        ctx.arc(px + comp.w / 2, py + comp.h / 2, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#e2b768';
        ctx.lineWidth = 2.2;
        ctx.stroke();
      } else if (comp.type === 'smd') {
        // 2 terminal metal caps
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(px, py, 3, comp.h);
        ctx.fillRect(px + comp.w - 3, py, 3, comp.h);
      }

      // Silkscreen Text
      ctx.fillStyle = isSelected ? '#00e5ff' : '#cbd5e1';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillText(comp.id, px + 4, py + comp.h / 2 + 3);
    });

    // 6. Board Header Silkscreen (Cleanly Centered between H1 and H2 - Zero Overlap!)
    ctx.textAlign = 'center';
    ctx.fillStyle = '#687385';
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.fillText('ALTIUM DESIGNER 24 // HIGH-SPEED ECAD MATRIX', 0, pcbY + 20);

    ctx.fillStyle = violations.length > 0 ? '#ef4444' : '#10b981';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(
      `LAYER: ${activeLayer} | NETS: ${traces.length} | IMPEDANCE: 50Ω | DRC: ${violations.length > 0 ? `${violations.length} VIOLATION(S)` : 'VERIFIED 0 VIOLATIONS'}`,
      0,
      pcbY + 34
    );
    ctx.textAlign = 'left';

    ctx.restore();
  }, [components, traces, selectedComp, selectedTrace, activeLayer, activeTool, routingSourceId, mouseBoardPos, isolateLayer, violations]);

  // User Interaction Handlers (Mouse & Touch)
  const handlePointerDown = (clientX, clientY) => {
    const coords = getBoardCoords(clientX, clientY);
    if (!coords) return;

    // Check if clicked a component
    const clickedComp = components.find(
      (c) => coords.x >= c.rx && coords.x <= c.rx + c.w && coords.y >= c.ry && coords.y <= c.ry + c.h
    );

    if (activeTool === 'select') {
      if (clickedComp) {
        setSelectedComp(clickedComp);
        setSelectedTrace(null);
        setIsDragging(true);
        setDraggedId(clickedComp.id);
        setDragOffset({ x: coords.x - clickedComp.rx, y: coords.y - clickedComp.ry });
        setStatusText(`Selected ${clickedComp.id} (${clickedComp.name}) • Dragging enabled`);
      } else {
        // Check if clicked a trace
        const clickedTrace = traces.find((tr) => {
          const cFrom = components.find((c) => c.id === tr.from);
          const cTo = components.find((c) => c.id === tr.to);
          if (!cFrom || !cTo) return false;
          const x1 = cFrom.rx + cFrom.w / 2;
          const y1 = cFrom.ry + cFrom.h / 2;
          const x2 = cTo.rx + cTo.w / 2;
          const y2 = cTo.ry + cTo.h / 2;
          const midX = (x1 + x2) / 2;

          // Simple Manhattan bounding check around trace lines
          const dist1 = Math.abs(coords.y - y1) < 8 && coords.x >= Math.min(x1, midX) - 4 && coords.x <= Math.max(x1, midX) + 4;
          const dist2 = Math.abs(coords.x - midX) < 8 && coords.y >= Math.min(y1, y2) - 4 && coords.y <= Math.max(y1, y2) + 4;
          const dist3 = Math.abs(coords.y - y2) < 8 && coords.x >= Math.min(midX, x2) - 4 && coords.x <= Math.max(midX, x2) + 4;

          return dist1 || dist2 || dist3;
        });

        if (clickedTrace) {
          setSelectedTrace(clickedTrace);
          setSelectedComp(null);
          setStatusText(`Selected Net [${clickedTrace.from} ➔ ${clickedTrace.to}] on Layer ${clickedTrace.layer}`);
        } else {
          setSelectedComp(null);
          setSelectedTrace(null);
          setStatusText('Altium 24 Engine Ready • 0 DRC Violations');
        }
      }
    } else if (activeTool === 'route') {
      if (clickedComp) {
        if (!routingSourceId) {
          // Select routing source
          setRoutingSourceId(clickedComp.id);
          setStatusText(`⚡ Routing Net from ${clickedComp.id}: Click destination component to complete 45° trace`);
        } else if (routingSourceId === clickedComp.id) {
          // Cancel route
          setRoutingSourceId(null);
          setStatusText('Routing cancelled.');
        } else {
          // Complete route
          const layerColor =
            activeLayer === 'L1_TOP'
              ? '#ef4444'
              : activeLayer === 'L2_GND'
              ? '#00e5ff'
              : activeLayer === 'L3_PWR'
              ? '#e2b768'
              : '#3b82f6';

          const newTrace = {
            id: `TR_${Date.now()}`,
            from: routingSourceId,
            to: clickedComp.id,
            layer: activeLayer,
            color: layerColor,
            width: 2.0
          };

          setTraces((prev) => [...prev, newTrace]);
          setStatusText(`✓ Routed 45° Net [${routingSourceId} ➔ ${clickedComp.id}] on ${activeLayer} (Impedance: 50Ω)`);
          setRoutingSourceId(null);
        }
      } else {
        setRoutingSourceId(null);
        setStatusText('Routing cancelled • Click any component pin to start');
      }
    }
  };

  const handlePointerMove = (clientX, clientY) => {
    const coords = getBoardCoords(clientX, clientY);
    if (!coords) return;

    setMouseBoardPos(coords);

    if (isDragging && draggedId && activeTool === 'select') {
      const comp = components.find((c) => c.id === draggedId);
      if (!comp) return;

      const rawRx = coords.x - dragOffset.x;
      const rawRy = coords.y - dragOffset.y;

      // 4px CAD grid snap
      const snapRx = Math.round(rawRx / 4) * 4;
      const snapRy = Math.round(rawRy / 4) * 4;

      // Board boundary clamp (PCB is 440x250, so -220 to 220, -125 to 125)
      const clampedRx = Math.max(-210, Math.min(210 - comp.w, snapRx));
      const clampedRy = Math.max(-115, Math.min(115 - comp.h, snapRy));

      setComponents((prev) =>
        prev.map((c) => (c.id === draggedId ? { ...c, rx: clampedRx, ry: clampedRy } : c))
      );

      // Keep selected component state in sync
      setSelectedComp((prev) => (prev?.id === draggedId ? { ...prev, rx: clampedRx, ry: clampedRy } : prev));
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedId(null);
    }
  };

  // Component Palette Actions
  const handleAddComponent = (type) => {
    const nextId = `${type === 'cap' ? 'C' : type === 'led' ? 'D' : type === 'res' ? 'R' : 'Y'}${components.length + 1}`;
    let newComp;

    if (type === 'cap') {
      newComp = { id: nextId, name: '0402 100nF Cap', rx: -20, ry: 30, w: 16, h: 10, pins: 2, type: 'smd', color: '#94a3b8' };
    } else if (type === 'led') {
      newComp = { id: nextId, name: '0805 Status LED', rx: 30, ry: 30, w: 20, h: 12, pins: 2, type: 'smd', color: '#10b981' };
    } else if (type === 'res') {
      newComp = { id: nextId, name: '0603 50Ω Resistor', rx: -60, ry: -40, w: 18, h: 10, pins: 2, type: 'smd', color: '#64748b' };
    } else {
      newComp = { id: nextId, name: '25MHz TCXO Crystal', rx: 0, ry: 50, w: 26, h: 18, pins: 4, type: 'smd', color: '#d97706' };
    }

    setComponents((prev) => [...prev, newComp]);
    setSelectedComp(newComp);
    setStatusText(`✓ Placed ${newComp.id} (${newComp.name}) on Board Substrate`);
  };

  const handleDeleteSelected = () => {
    if (selectedComp) {
      setComponents((prev) => prev.filter((c) => c.id !== selectedComp.id));
      setTraces((prev) => prev.filter((tr) => tr.from !== selectedComp.id && tr.to !== selectedComp.id));
      setStatusText(`Deleted component ${selectedComp.id} and connected copper nets.`);
      setSelectedComp(null);
    } else if (selectedTrace) {
      setTraces((prev) => prev.filter((tr) => tr.id !== selectedTrace.id));
      setStatusText(`Ripped up copper net ${selectedTrace.from} ➔ ${selectedTrace.to}`);
      setSelectedTrace(null);
    }
  };

  const handleResetBoard = () => {
    setComponents(INITIAL_COMPONENTS);
    setTraces(INITIAL_TRACES);
    setSelectedComp(null);
    setSelectedTrace(null);
    setRoutingSourceId(null);
    setStatusText('PCB Layout reset to default mechatronics development configuration.');
  };

  const handleRunDRC = () => {
    const colls = detectCollisions(components);
    if (colls.length > 0) {
      setDrcPassed(false);
      setStatusText(`⚠️ DRC FAILED: ${colls.length} component clearance violation(s) detected. Adjust footprint spacing.`);
    } else {
      setDrcPassed(true);
      setStatusText('✓ DRC PASSED: 0 Clearance Violations. IPC-2221 Class 3 Electrical Verified.');
    }
  };

  const handlePushToMCAD = () => {
    setStatusText('Exporting IDF/IDX 3.0 changeset to SolidWorks Enclosure...');
    if (onSyncToSolidWorks) {
      onSyncToSolidWorks({
        componentsCount: components.length,
        tracesCount: traces.length,
        boardWidth: boardSize.width,
        boardHeight: boardSize.height
      });
    }
    setTimeout(() => {
      setStatusText('✓ Bi-Directional CoDesigner Sync: 3D STEP components synchronized into SolidWorks.');
    }, 700);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '110px clamp(12px, 3vw, 24px) 36px' }}>
      {/* Studio Header */}
      <div className="studio-header-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={20} color="#0284c7" />
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Altium Designer 24 ECAD Studio
            </h2>
            <span className="tag-badge alt-tag font-mono" style={{ fontSize: '0.68rem' }}>
              MULTI-LAYER PCB ROUTER
            </span>
          </div>
          <p style={{ color: '#475569', fontSize: '0.84rem', marginTop: '2px' }}>
            Interactive ECAD engine: Drag IC footprints, route 45° differential traces, inspect impedance, and verify clearance DRC rules in real time.
          </p>
        </div>

        <div className="studio-actions-wrap" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleRunDRC}
            className="btn-secondary-pro"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <ShieldCheck size={14} color={drcPassed ? '#10b981' : '#ef4444'} />
            <span>{drcPassed ? 'Run DRC Rule Check' : 'Inspect Violations'}</span>
          </button>

          <button
            onClick={handlePushToMCAD}
            className="btn-primary-lead"
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <Layers size={14} />
            <span>Push PCB to SolidWorks</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 290px',
          gap: '16px',
          alignItems: 'stretch'
        }}
        className="studio-grid-mobile"
      >
        {/* Left: Layer Stackup & Placed Component Netlist */}
        <div className="pro-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#0284c7', textTransform: 'uppercase', fontWeight: 600 }}>
              LAYER STACKUP MANAGER
            </span>
            <button
              onClick={() => setIsolateLayer(!isolateLayer)}
              style={{
                fontSize: '0.66rem',
                padding: '2px 7px',
                borderRadius: '4px',
                background: isolateLayer ? '#e0f2fe' : '#f1f5f9',
                border: isolateLayer ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
                color: isolateLayer ? '#0284c7' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              title="Altium Single Layer Mode (Shift+S)"
            >
              {isolateLayer ? <Eye size={11} /> : <EyeOff size={11} />}
              <span>{isolateLayer ? 'Solo Layer' : 'All Layers'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
            {[
              { id: 'L1_TOP', name: 'L1 Top Signals [RF/56G]', color: '#ef4444' },
              { id: 'L2_GND', name: 'L2 Ground Plane', color: '#0284c7' },
              { id: 'L3_PWR', name: 'L3 Power Rails', color: '#b45309' },
              { id: 'L12_BOT', name: 'L12 Bottom Signals', color: '#2563eb' }
            ].map((layer) => (
              <button
                key={layer.id}
                onClick={() => setActiveLayer(layer.id)}
                style={{
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: activeLayer === layer.id ? `1.5px solid ${layer.color}` : '1px solid var(--border-subtle)',
                  background: activeLayer === layer.id ? '#ffffff' : '#f8fafc',
                  color: activeLayer === layer.id ? '#0f172a' : '#64748b',
                  boxShadow: activeLayer === layer.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: layer.color }} />
                <span>{layer.name}</span>
              </button>
            ))}
          </div>

          {/* Placed Footprint List */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              PLACED COMPONENTS ({components.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.78rem', maxHeight: '230px', overflowY: 'auto' }}>
            {components.map((comp) => {
              const isColliding = violations.some((v) => v.c1 === comp.id || v.c2 === comp.id);
              return (
                <div
                  key={comp.id}
                  onClick={() => {
                    setSelectedComp(comp);
                    setSelectedTrace(null);
                  }}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '5px',
                    background: selectedComp?.id === comp.id ? '#e0f2fe' : '#f8fafc',
                    border: isColliding
                      ? '1px solid #ef4444'
                      : selectedComp?.id === comp.id
                      ? '1px solid #0284c7'
                      : '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <strong style={{ color: isColliding ? '#ef4444' : '#0f172a' }}>{comp.id}</strong>
                  <span style={{ color: '#64748b', fontSize: '0.74rem' }}>{comp.name}</span>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              onClick={handleResetBoard}
              style={{
                width: '100%',
                padding: '7px',
                borderRadius: '6px',
                background: '#ffffff',
                border: '1px solid var(--border-subtle)',
                color: '#475569',
                fontSize: '0.74rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={12} />
              <span>Reset PCB Layout</span>
            </button>
          </div>
        </div>

        {/* Center: Dynamic PCB Canvas Viewport */}
        <div
          className="pro-panel"
          style={{
            minHeight: '520px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Top Interactive Mode Toolbar */}
          <div
            style={{
              padding: '8px 12px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#f8fafc',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            {/* Primary Tool Modes */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => {
                  setActiveTool('select');
                  setRoutingSourceId(null);
                  setStatusText('Inspect & Move mode active • Drag footprints to reposition');
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '5px',
                  border: activeTool === 'select' ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
                  background: activeTool === 'select' ? '#e0f2fe' : '#ffffff',
                  color: activeTool === 'select' ? '#0284c7' : '#64748b',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Move size={12} />
                <span>Move & Inspect</span>
              </button>

              <button
                onClick={() => {
                  setActiveTool('route');
                  setSelectedComp(null);
                  setSelectedTrace(null);
                  setStatusText('⚡ Trace Routing Active: Click any component pin to start 45° route');
                }}
                style={{
                  padding: '5px 12px',
                  borderRadius: '5px',
                  border: activeTool === 'route' ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  background: activeTool === 'route' ? '#ecfdf5' : '#ffffff',
                  color: activeTool === 'route' ? '#059669' : '#64748b',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px'
                }}
              >
                <Zap size={12} />
                <span>Route 45° Net</span>
              </button>
            </div>

            {/* Quick Component Placement Palette */}
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <span className="font-mono" style={{ fontSize: '0.66rem', color: '#64748b' }}>+ PLACE:</span>
              <button
                onClick={() => handleAddComponent('cap')}
                style={{ padding: '4px 8px', borderRadius: '4px', background: '#ffffff', border: '1px solid var(--border-subtle)', color: '#0f172a', fontSize: '0.7rem', cursor: 'pointer' }}
                title="Place 0402 Bypass Capacitor"
              >
                Cap
              </button>
              <button
                onClick={() => handleAddComponent('led')}
                style={{ padding: '4px 8px', borderRadius: '4px', background: '#ffffff', border: '1px solid var(--border-subtle)', color: '#059669', fontSize: '0.7rem', cursor: 'pointer' }}
                title="Place 0805 Status LED"
              >
                LED
              </button>
              <button
                onClick={() => handleAddComponent('res')}
                style={{ padding: '4px 8px', borderRadius: '4px', background: '#ffffff', border: '1px solid var(--border-subtle)', color: '#0284c7', fontSize: '0.7rem', cursor: 'pointer' }}
                title="Place 0603 Termination Resistor"
              >
                Res
              </button>
              <button
                onClick={() => handleAddComponent('xtal')}
                style={{ padding: '4px 8px', borderRadius: '4px', background: '#ffffff', border: '1px solid var(--border-subtle)', color: '#b45309', fontSize: '0.7rem', cursor: 'pointer' }}
                title="Place 25MHz TCXO Crystal"
              >
                Crystal
              </button>
            </div>
          </div>

          {/* Canvas Viewport Box */}
          <div
            ref={containerRef}
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              minHeight: '380px',
              background: '#06070b',
              cursor: activeTool === 'route' ? 'crosshair' : isDragging ? 'grabbing' : 'grab',
              touchAction: 'none'
            }}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onTouchStart={(e) => {
              if (e.touches && e.touches.length > 0) {
                handlePointerDown(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchMove={(e) => {
              if (e.touches && e.touches.length > 0) {
                handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
              }
            }}
            onTouchEnd={handlePointerUp}
            onTouchCancel={handlePointerUp}
          >
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
          </div>

          {/* Bottom Live Status Bar */}
          <div
            style={{
              padding: '8px 14px',
              background: '#f8fafc',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.74rem',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: drcPassed ? '#059669' : '#dc2626' }}>
              {drcPassed ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />}
              <span className="font-mono">{statusText}</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <span className="font-mono" style={{ color: '#64748b' }}>
                TRACES: {traces.length} | VIAS: 12
              </span>
              {(selectedComp || selectedTrace) && (
                <button
                  onClick={handleDeleteSelected}
                  style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    color: '#b91c1c',
                    fontSize: '0.68rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Trash2 size={11} />
                  <span>{selectedComp ? `Delete ${selectedComp.id}` : 'Rip Up Trace'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right: Component & High-Speed Signal Inspector */}
        <div className="pro-panel" style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="font-mono" style={{ fontSize: '0.72rem', color: '#0284c7', textTransform: 'uppercase', fontWeight: 600 }}>
            SIGNAL & PACKAGE PROPERTIES
          </div>

          {selectedComp ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>DESIGNATOR</div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{selectedComp.id}</div>
                <div style={{ fontSize: '0.8rem', color: '#0284c7', marginTop: '2px' }}>{selectedComp.name}</div>
              </div>

              {/* Dynamic Coordinate Inspector */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.76rem' }}>
                <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>X COORD</span>
                  <strong className="font-mono" style={{ color: '#b45309' }}>{selectedComp.rx.toFixed(1)} mm</strong>
                </div>
                <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>Y COORD</span>
                  <strong className="font-mono" style={{ color: '#b45309' }}>{selectedComp.ry.toFixed(1)} mm</strong>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.76rem' }}>
                <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>FOOTPRINT</span>
                  <strong style={{ color: '#0f172a' }}>{selectedComp.type.toUpperCase()}</strong>
                </div>
                <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>PIN COUNT</span>
                  <strong className="font-mono" style={{ color: '#0f172a' }}>{selectedComp.pins} PADS</strong>
                </div>
              </div>

              <div style={{ padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', fontSize: '0.74rem' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem', marginBottom: '3px' }}>3D STEP HEIGHT CLEARANCE</span>
                <span className="font-mono" style={{ color: '#b45309', fontWeight: 700 }}>3.20mm [Fits inside SolidWorks Enclosure]</span>
              </div>

              {/* Connected Nets for this Component */}
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem', marginBottom: '6px', fontWeight: 600 }}>CONNECTED NETS</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {traces
                    .filter((tr) => tr.from === selectedComp.id || tr.to === selectedComp.id)
                    .map((tr) => (
                      <div
                        key={tr.id}
                        onClick={() => setSelectedTrace(tr)}
                        style={{
                          padding: '5px 8px',
                          borderRadius: '4px',
                          background: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          fontSize: '0.72rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          cursor: 'pointer'
                        }}
                      >
                        <span style={{ color: tr.color, fontWeight: 600 }}>{tr.from} ➔ {tr.to}</span>
                        <span className="font-mono" style={{ color: '#64748b' }}>{tr.layer}</span>
                      </div>
                    ))}
                  {traces.filter((tr) => tr.from === selectedComp.id || tr.to === selectedComp.id).length === 0 && (
                    <span style={{ color: '#64748b', fontSize: '0.72rem' }}>No routed nets connected. Click 'Route 45° Net' to connect.</span>
                  )}
                </div>
              </div>
            </div>
          ) : selectedTrace ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                <div style={{ fontSize: '0.7rem', color: '#64748b' }}>SELECTED TRACE NET</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: selectedTrace.color }}>{selectedTrace.from} ➔ {selectedTrace.to}</div>
                <div className="font-mono" style={{ fontSize: '0.76rem', color: '#475569', marginTop: '4px' }}>LAYER: {selectedTrace.layer}</div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.76rem' }}>
                <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>IMPEDANCE</span>
                  <strong className="font-mono" style={{ color: '#059669' }}>50.0 Ω ±3%</strong>
                </div>
                <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem' }}>TRACE WIDTH</span>
                  <strong className="font-mono" style={{ color: '#0f172a' }}>0.20 mm</strong>
                </div>
              </div>

              <div style={{ padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', fontSize: '0.74rem' }}>
                <span style={{ color: '#64748b', display: 'block', fontSize: '0.66rem', marginBottom: '3px' }}>SIGNAL FLIGHT DELAY</span>
                <span className="font-mono" style={{ color: '#0284c7', fontWeight: 700 }}>~215 ps [Delay-matched differential pair]</span>
              </div>

              <button
                onClick={handleDeleteSelected}
                className="btn-secondary-pro"
                style={{ justifyContent: 'center', padding: '9px', fontSize: '0.78rem', color: '#b91c1c', borderColor: '#fecaca', background: '#fef2f2' }}
              >
                <Trash2 size={13} />
                <span>Rip Up (Delete) Net</span>
              </button>
            </div>
          ) : (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: '#64748b', fontSize: '0.8rem', lineHeight: 1.5 }}>
              Click and drag any footprint on the board to reposition, or switch to <strong>Route 45° Net</strong> to connect copper traces.
            </div>
          )}

          <div style={{ marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
            <div className="font-mono" style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '6px' }}>
              BOARD CONSTRAINTS
            </div>
            <div style={{ fontSize: '0.76rem', color: '#475569', lineHeight: 1.5 }}>
              • Microstrip Impedance: <strong style={{ color: '#0f172a' }}>50Ω ±5%</strong><br />
              • Differential Pair: <strong style={{ color: '#0f172a' }}>90Ω USB / 100Ω SerDes</strong><br />
              • Minimum Copper Clearance: <strong style={{ color: '#0f172a' }}>0.15mm (6 mil)</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
