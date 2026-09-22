import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Cpu,
  Layers,
  ShieldCheck,
  Zap,
  RefreshCw,
  Trash2,
  Move,
  Eye,
  EyeOff,
  Activity,
  ArrowRight,
  Crosshair,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  Box,
  Radio,
  Sliders,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info
} from 'lucide-react';

// Solder Mask Palette presets matching authentic PCB fabrication houses (Isola, Rogers, FR4)
const SOLDER_MASKS = {
  emerald: { name: 'Altium Matte Emerald', bg: '#0c2e1f', border: '#064e3b', silk: '#f8fafc', core: '#081f15' },
  obsidian: { name: 'Stealth Matte Obsidian', bg: '#11141c', border: '#1e2433', silk: '#f1f5f9', core: '#0a0c12' },
  royal: { name: 'Nordic Royal Blue', bg: '#0c1e3d', border: '#1d4ed8', silk: '#f8fafc', core: '#071226' },
  ruby: { name: 'Lab Signal Ruby', bg: '#300d14', border: '#991b1b', silk: '#fef2f2', core: '#1f070b' }
};

const INITIAL_COMPONENTS = [
  {
    id: 'U1',
    name: 'STM32F407VGT6',
    desc: 'ARM Cortex-M4 168MHz MCU',
    package: 'LQFP-64',
    rx: -60,
    ry: 0,
    w: 68,
    h: 68,
    rot: 0,
    height3D: 1.6,
    pins: 64,
    type: 'qfp',
    silkscreen: 'STM32F4 // 168MHz',
    netAssignments: ['CLK_25M', 'HS_BUS', 'USB_DP', 'PWR_3V3', 'GND']
  },
  {
    id: 'U2',
    name: 'Xilinx Artix-7 56G',
    desc: 'High-Density DSP FPGA',
    package: 'BGA-256',
    rx: 76,
    ry: 0,
    w: 80,
    h: 80,
    rot: 0,
    height3D: 2.2,
    pins: 256,
    type: 'bga',
    silkscreen: 'XILINX // ARTIX-7',
    netAssignments: ['HS_BUS', 'PWR_3V3', 'GND']
  },
  {
    id: 'J1',
    name: 'Amphenol USB-C 3.2',
    desc: '24-Pin Receptacle with Shield',
    package: 'USB-C-24P',
    rx: -175,
    ry: 8,
    w: 42,
    h: 36,
    rot: 0,
    height3D: 3.4,
    pins: 24,
    type: 'conn',
    silkscreen: 'USB-C // 10Gbps',
    netAssignments: ['USB_DP', 'USB_DM', 'VBUS_5V', 'GND']
  },
  {
    id: 'U3',
    name: 'TI TPS7A4700',
    desc: 'Ultra-Low Noise 3.3V LDO',
    package: 'SOT-223-3',
    rx: -125,
    ry: -55,
    w: 34,
    h: 28,
    rot: 0,
    height3D: 1.8,
    pins: 4,
    type: 'sot',
    silkscreen: 'TPS7A47 // LDO',
    netAssignments: ['VBUS_5V', 'PWR_3V3', 'GND']
  },
  {
    id: 'Y1',
    name: '25.000 MHz TCXO',
    desc: 'Ultra-Low Jitter Oscillator',
    package: 'SMD-3225',
    rx: -55,
    ry: 64,
    w: 24,
    h: 18,
    rot: 0,
    height3D: 1.0,
    pins: 4,
    type: 'xtal',
    silkscreen: '25.000 MHz',
    netAssignments: ['CLK_25M', 'PWR_3V3', 'GND']
  },
  {
    id: 'C1',
    name: '100nF 0402 Cap',
    desc: 'High-Freq Decoupling MLCC',
    package: '0402',
    rx: -12,
    ry: -44,
    w: 16,
    h: 10,
    rot: 0,
    height3D: 0.6,
    pins: 2,
    type: 'smd_cap',
    silkscreen: 'C1',
    netAssignments: ['PWR_3V3', 'GND']
  },
  {
    id: 'C2',
    name: '10uF 0805 Tantalum',
    desc: 'Bulk Rail Storage Cap',
    package: '0805',
    rx: 16,
    ry: -44,
    w: 20,
    h: 12,
    rot: 0,
    height3D: 0.9,
    pins: 2,
    type: 'smd_cap',
    silkscreen: 'C2',
    netAssignments: ['PWR_3V3', 'GND']
  },
  {
    id: 'R1',
    name: '50Ω 0603 Resistor',
    desc: 'Impedance Match Terminator',
    package: '0603',
    rx: 24,
    ry: 32,
    w: 18,
    h: 10,
    rot: 0,
    height3D: 0.6,
    pins: 2,
    type: 'smd_res',
    silkscreen: 'R1',
    netAssignments: ['HS_BUS']
  },
  {
    id: 'D1',
    name: '0805 Status LED',
    desc: 'Emerald 525nm Heartbeat',
    package: '0805',
    rx: -110,
    ry: 50,
    w: 18,
    h: 11,
    rot: 0,
    height3D: 0.8,
    pins: 2,
    type: 'smd_led',
    silkscreen: 'D1',
    netAssignments: ['PWR_3V3', 'GND']
  },
  {
    id: 'TP1',
    name: 'TP_CLK25M Test Point',
    desc: 'Oscilloscope Probe Pad',
    package: 'TESTPOINT',
    rx: -18,
    ry: 64,
    w: 12,
    h: 12,
    rot: 0,
    height3D: 0.2,
    pins: 1,
    type: 'testpoint',
    silkscreen: 'TP1',
    netAssignments: ['CLK_25M']
  },
  {
    id: 'TP2',
    name: 'TP_3V3 Test Point',
    desc: 'Regulator Monitor Pad',
    package: 'TESTPOINT',
    rx: -155,
    ry: -55,
    w: 12,
    h: 12,
    rot: 0,
    height3D: 0.2,
    pins: 1,
    type: 'testpoint',
    silkscreen: 'TP2',
    netAssignments: ['PWR_3V3']
  },
  {
    id: 'H1',
    name: 'M3 Plated Standoff',
    desc: 'Chassis Earth Ground',
    package: 'M3_HOLE',
    rx: -186,
    ry: -98,
    w: 22,
    h: 22,
    rot: 0,
    height3D: 0,
    pins: 1,
    type: 'hole',
    silkscreen: 'H1',
    netAssignments: ['GND']
  },
  {
    id: 'H2',
    name: 'M3 Plated Standoff',
    desc: 'Chassis Earth Ground',
    package: 'M3_HOLE',
    rx: 186,
    ry: -98,
    w: 22,
    h: 22,
    rot: 0,
    height3D: 0,
    pins: 1,
    type: 'hole',
    silkscreen: 'H2',
    netAssignments: ['GND']
  },
  {
    id: 'H3',
    name: 'M3 Plated Standoff',
    desc: 'Chassis Earth Ground',
    package: 'M3_HOLE',
    rx: -186,
    ry: 98,
    w: 22,
    h: 22,
    rot: 0,
    height3D: 0,
    pins: 1,
    type: 'hole',
    silkscreen: 'H3',
    netAssignments: ['GND']
  },
  {
    id: 'H4',
    name: 'M3 Plated Standoff',
    desc: 'Chassis Earth Ground',
    package: 'M3_HOLE',
    rx: 186,
    ry: 98,
    w: 22,
    h: 22,
    rot: 0,
    height3D: 0,
    pins: 1,
    type: 'hole',
    silkscreen: 'H4',
    netAssignments: ['GND']
  }
];

const INITIAL_TRACES = [
  {
    id: 'TR_VBUS',
    net: 'VBUS_5V',
    from: 'J1',
    to: 'U3',
    layer: 'L1_TOP',
    color: '#ef4444',
    width: 2.8,
    signalType: 'power',
    voltage: '5.0V',
    frequency: 'DC',
    impedance: '0.12 Ω'
  },
  {
    id: 'TR_3V3',
    net: 'PWR_3V3',
    from: 'U3',
    to: 'C1',
    layer: 'L3_PWR',
    color: '#f59e0b',
    width: 2.4,
    signalType: 'power',
    voltage: '3.3V',
    frequency: '100kHz Ripple',
    impedance: '0.08 Ω'
  },
  {
    id: 'TR_CLK',
    net: 'CLK_25M',
    from: 'Y1',
    to: 'U1',
    layer: 'L1_TOP',
    color: '#10b981',
    width: 1.8,
    signalType: 'clock',
    voltage: '3.3Vpp',
    frequency: '25.000 MHz',
    impedance: '50.1 Ω'
  },
  {
    id: 'TR_BUS',
    net: 'HS_BUS',
    from: 'U1',
    to: 'U2',
    layer: 'L1_TOP',
    color: '#06b6d4',
    width: 1.6,
    signalType: 'diff',
    voltage: '1.2V LVDS',
    frequency: '480.0 Mbps',
    impedance: '100.2 Ω Diff'
  },
  {
    id: 'TR_GND',
    net: 'GND',
    from: 'U2',
    to: 'H2',
    layer: 'L2_GND',
    color: '#3b82f6',
    width: 3.0,
    signalType: 'gnd',
    voltage: '0.0V',
    frequency: 'Return Plane',
    impedance: '0.01 Ω'
  },
  {
    id: 'TR_LED',
    net: 'PWR_3V3',
    from: 'U3',
    to: 'D1',
    layer: 'L1_TOP',
    color: '#10b981',
    width: 1.6,
    signalType: 'power',
    voltage: '3.3V',
    frequency: 'Heartbeat 1Hz',
    impedance: '150 Ω'
  }
];

export default function AltiumStudio({ onSyncToSolidWorks, boardDimensions }) {
  const [boardSize] = useState({
    width: boardDimensions?.boardWidth || 115,
    height: boardDimensions?.boardLength || 75
  });

  const [solderMask, setSolderMask] = useState('emerald');
  const [viewMode, setViewMode] = useState('2D'); // '2D' or '3D'
  const [activeLayer, setActiveLayer] = useState('L1_TOP');
  const [activeTool, setActiveTool] = useState('select'); // 'select', 'route', 'pan'
  const [signalsActive, setSignalsActive] = useState(true);
  const [isolateLayer, setIsolateLayer] = useState(false);

  // Zoom & Pan
  const [zoom, setZoom] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Selections
  const [selectedComp, setSelectedComp] = useState(null);
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [selectedNet, setSelectedNet] = useState('CLK_25M');

  // DRC & Status
  const [statusText, setStatusText] = useState('Altium 24 Engine Ready • 0 DRC Violations • High-Speed ECAD Core Online');
  const [drcPassed, setDrcPassed] = useState(true);
  const [violations, setViolations] = useState([]);

  // Components & Traces
  const [components, setComponents] = useState(INITIAL_COMPONENTS);
  const [traces, setTraces] = useState(INITIAL_TRACES);

  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Routing State
  const [routingSourceId, setRoutingSourceId] = useState(null);
  const [mouseBoardPos, setMouseBoardPos] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const scopeCanvasRef = useRef(null);
  const animFrameRef = useRef(0);

  // Collision DRC Algorithm
  const detectCollisions = (comps) => {
    const colls = [];
    const clearanceMargin = 6; // ~0.25mm clearance
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

  // Coordinate Conversion: Viewport Client (px) -> PCB Board Space
  const getBoardCoords = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const cx = canvas.width / 2 + panOffset.x;
    const cy = canvas.height / 2 + panOffset.y;
    const baseScale = Math.min(1.0, Math.max(0.65, (canvas.width - 32) / 460)) * zoom;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    return {
      x: (x - cx) / baseScale,
      y: (y - cy) / baseScale
    };
  };

  // Rotate selected component 90 degrees
  const handleRotateSelected = () => {
    if (!selectedComp) return;
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === selectedComp.id) {
          const newRot = ((c.rot || 0) + 90) % 360;
          const newComp = { ...c, rot: newRot, w: c.h, h: c.w };
          setSelectedComp(newComp);
          return newComp;
        }
        return c;
      })
    );
    setStatusText(`Rotated ${selectedComp.id} 90° clockwise`);
  };

  // Main 60FPS RAF Canvas Loop (2D Layout + 3D View + Live Signal Pulses)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    let startTime = performance.now();

    const render = (time) => {
      const elapsed = time - startTime;
      const width = (canvas.width = container.clientWidth);
      const height = (canvas.height = container.clientHeight);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + panOffset.x;
      const cy = height / 2 + panOffset.y;
      const baseScale = Math.min(1.0, Math.max(0.65, (width - 32) / 460)) * zoom;

      ctx.save();
      ctx.translate(cx, cy);

      if (viewMode === '3D') {
        // Perspective Isometric transformation for realistic 3D Board inspection
        ctx.scale(baseScale * 0.95, baseScale * 0.58);
        ctx.rotate(-Math.PI / 8);
      } else {
        ctx.scale(baseScale, baseScale);
      }

      const pcbW = 440;
      const pcbH = 250;
      const pcbX = -pcbW / 2;
      const pcbY = -pcbH / 2;
      const mask = SOLDER_MASKS[solderMask];

      // 1. Board Drop Shadow & 3D Substrate Thickness
      if (viewMode === '3D') {
        // Multi-layer FR4 edge depth
        ctx.fillStyle = '#05070a';
        ctx.beginPath();
        ctx.roundRect(pcbX + 8, pcbY + 16, pcbW, pcbH, 10);
        ctx.fill();

        // FR4 Core Brown/Gold edge bevel
        ctx.fillStyle = '#1c150c';
        ctx.beginPath();
        ctx.roundRect(pcbX, pcbY + 8, pcbW, pcbH, 8);
        ctx.fill();
      }

      // 2. PCB Solder Mask (FR4 Substrate Surface)
      ctx.fillStyle = mask.bg;
      ctx.beginPath();
      ctx.roundRect(pcbX, pcbY, pcbW, pcbH, 8);
      ctx.fill();

      // Subtle fiberglass weave texture
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;
      for (let i = pcbX; i <= pcbX + pcbW; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, pcbY);
        ctx.lineTo(i, pcbY + pcbH);
        ctx.stroke();
      }
      for (let j = pcbY; j <= pcbY + pcbH; j += 8) {
        ctx.beginPath();
        ctx.moveTo(pcbX, j);
        ctx.lineTo(pcbX + pcbW, j);
        ctx.stroke();
      }

      // Board Edge Chamfer / Milling Outline
      ctx.strokeStyle = mask.border;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Mechanical Keepout Route Line (Yellow Dashed)
      ctx.save();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(pcbX + 4, pcbY + 4, pcbW - 8, pcbH - 8);
      ctx.restore();

      // CAD Precision Snap Grid Dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      for (let x = pcbX + 16; x < pcbX + pcbW; x += 16) {
        for (let y = pcbY + 16; y < pcbY + pcbH; y += 16) {
          ctx.fillRect(x - 0.5, y - 0.5, 1.2, 1.2);
        }
      }

      // Optical Fiducials in Board Corners (ENIG Gold with Soldermask Opening)
      const fiducials = [
        { x: pcbX + 18, y: pcbY + 36 },
        { x: pcbX + pcbW - 18, y: pcbY + 36 },
        { x: pcbX + 18, y: pcbY + pcbH - 24 }
      ];
      fiducials.forEach((fid) => {
        // Solder mask opening
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.beginPath();
        ctx.arc(fid.x, fid.y, 4.5, 0, Math.PI * 2);
        ctx.fill();
        // Gold pad
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(fid.x, fid.y, 2.2, 0, Math.PI * 2);
        ctx.fill();
        // Crosshair ring
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(fid.x, fid.y, 6.5, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 3. Render Multi-Layer 45° Mitred Copper Traces
      traces.forEach((tr) => {
        const cFrom = components.find((c) => c.id === tr.from);
        const cTo = components.find((c) => c.id === tr.to);
        if (!cFrom || !cTo) return;

        const isTraceSelected = selectedTrace?.id === tr.id || selectedNet === tr.net;
        const isLayerActive = tr.layer === activeLayer;

        let alpha = 1.0;
        if (isolateLayer && !isLayerActive) {
          alpha = 0.15;
        }

        ctx.save();
        ctx.globalAlpha = alpha;

        const x1 = cFrom.rx + cFrom.w / 2;
        const y1 = cFrom.ry + cFrom.h / 2;
        const x2 = cTo.rx + cTo.w / 2;
        const y2 = cTo.ry + cTo.h / 2;

        // Calculate authentic 45-degree mitred dogleg routing
        const dx = x2 - x1;
        const dy = y2 - y1;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        let p1x = x1;
        let p1y = y1;
        let p2x, p2y, p3x, p3y;

        if (absDx > absDy) {
          const cornerDist = absDy;
          const cornerDirX = Math.sign(dx);
          p2x = x1 + (dx - cornerDist * cornerDirX);
          p2y = y1;
          p3x = x2;
          p3y = y2;
        } else {
          const cornerDist = absDx;
          const cornerDirY = Math.sign(dy);
          p2x = x1;
          p2y = y1 + (dy - cornerDist * cornerDirY);
          p3x = x2;
          p3y = y2;
        }

        // Trace Outer Glow on Selected / Active
        if (isTraceSelected || isLayerActive) {
          ctx.strokeStyle = tr.color;
          ctx.lineWidth = tr.width + 4.0;
          ctx.shadowColor = tr.color;
          ctx.shadowBlur = isTraceSelected ? 14 : 7;
          ctx.beginPath();
          ctx.moveTo(p1x, p1y);
          ctx.lineTo(p2x, p2y);
          ctx.lineTo(p3x, p3y);
          ctx.stroke();
        }

        // Copper Track Body
        ctx.strokeStyle = isTraceSelected ? '#ffffff' : tr.color;
        ctx.lineWidth = tr.width;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.beginPath();
        ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.lineTo(p3x, p3y);
        ctx.stroke();

        // 4. Real-Time Moving Signal Photon Pulses
        if (signalsActive && alpha > 0.4) {
          const totalLength = Math.hypot(p2x - p1x, p2y - p1y) + Math.hypot(p3x - p2x, p3y - p2y);
          const speed = tr.signalType === 'clock' ? 0.28 : tr.signalType === 'diff' ? 0.38 : 0.16;
          const pulseOffset = (elapsed * speed) % totalLength;

          // Compute exact position along 45° segments
          let pulseX, pulseY;
          const seg1Len = Math.hypot(p2x - p1x, p2y - p1y);
          if (pulseOffset <= seg1Len && seg1Len > 0) {
            const frac = pulseOffset / seg1Len;
            pulseX = p1x + (p2x - p1x) * frac;
            pulseY = p1y + (p2y - p1y) * frac;
          } else {
            const seg2Len = Math.hypot(p3x - p2x, p3y - p2y);
            const frac = seg2Len > 0 ? (pulseOffset - seg1Len) / seg2Len : 0;
            pulseX = p2x + (p3x - p2x) * frac;
            pulseY = p2y + (p3y - p2y) * frac;
          }

          // Render Electric Photon Dot
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = tr.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(pulseX, pulseY, 2.8, 0, Math.PI * 2);
          ctx.fill();

          // Second staggered pulse for high-speed differential bus
          if (tr.signalType === 'diff') {
            const offset2 = (pulseOffset + totalLength * 0.5) % totalLength;
            let p2X, p2Y;
            if (offset2 <= seg1Len && seg1Len > 0) {
              const f = offset2 / seg1Len;
              p2X = p1x + (p2x - p1x) * f;
              p2Y = p1y + (p2y - p1y) * f;
            } else {
              const seg2Len = Math.hypot(p3x - p2x, p3y - p2y);
              const f = seg2Len > 0 ? (offset2 - seg1Len) / seg2Len : 0;
              p2X = p2x + (p3x - p2x) * f;
              p2Y = p2y + (p3y - p2y) * f;
            }
            ctx.fillStyle = '#a5f3fc';
            ctx.beginPath();
            ctx.arc(p2X, p2Y, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Plated Via Annular Rings at Terminations
        const drawVia = (vx, vy) => {
          // Copper pad outer ring
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(vx, vy, 4.2, 0, Math.PI * 2);
          ctx.fill();
          // ENIG Gold center plating
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(vx, vy, 2.8, 0, Math.PI * 2);
          ctx.fill();
          // Dark drilled hole
          ctx.fillStyle = '#05070a';
          ctx.beginPath();
          ctx.arc(vx, vy, 1.4, 0, Math.PI * 2);
          ctx.fill();
        };

        drawVia(x1, y1);
        drawVia(x2, y2);

        ctx.restore();
      });

      // 5. Interactive Routing Airwire Guide
      if (activeTool === 'route' && routingSourceId) {
        const src = components.find((c) => c.id === routingSourceId);
        if (src) {
          const sx = src.rx + src.w / 2;
          const sy = src.ry + src.h / 2;

          ctx.save();
          // Dynamic 45-degree preview line
          const rdx = mouseBoardPos.x - sx;
          const rdy = mouseBoardPos.y - sy;
          let midX, midY;
          if (Math.abs(rdx) > Math.abs(rdy)) {
            midX = sx + (rdx - Math.abs(rdy) * Math.sign(rdx));
            midY = sy;
          } else {
            midX = sx;
            midY = sy + (rdy - Math.abs(rdx) * Math.sign(rdy));
          }

          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2.2;
          ctx.setLineDash([5, 4]);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(midX, midY);
          ctx.lineTo(mouseBoardPos.x, mouseBoardPos.y);
          ctx.stroke();

          // Pulsing Source Ring
          ctx.setLineDash([]);
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(sx, sy, Math.max(src.w, src.h) / 2 + 8, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 6. Render Authentic Component Packages & Footprints
      components.forEach((comp) => {
        const isSelected = selectedComp?.id === comp.id;
        const isRoutingSource = routingSourceId === comp.id;
        const isColliding = violations.some((v) => v.c1 === comp.id || v.c2 === comp.id);
        const px = comp.rx;
        const py = comp.ry;
        const pw = comp.w;
        const ph = comp.h;

        ctx.save();

        // 3D Isometric Drop Shadow on Substrate
        if (viewMode === '3D') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.beginPath();
          ctx.roundRect(px + 4, py + 6, pw, ph, 4);
          ctx.fill();
        }

        // Live DRC Collision Warning Halo
        if (isColliding) {
          ctx.strokeStyle = '#ef4444';
          ctx.lineWidth = 2.8;
          ctx.strokeRect(px - 4, py - 4, pw + 8, ph + 8);

          // Diagonal Warning Stripes
          ctx.save();
          ctx.beginPath();
          ctx.rect(px, py, pw, ph);
          ctx.clip();
          ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
          ctx.lineWidth = 2.5;
          for (let s = -ph; s < pw + ph; s += 8) {
            ctx.beginPath();
            ctx.moveTo(px + s, py);
            ctx.lineTo(px + s + ph, py + ph);
            ctx.stroke();
          }
          ctx.restore();

          // DRC clearance tag
          ctx.fillStyle = '#ef4444';
          ctx.font = 'bold 9px "JetBrains Mono", monospace';
          ctx.fillText('CLEARANCE VIOLATION!', px - 2, py - 6);
        }

        // Selection Halo
        if (isSelected) {
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 2.0;
          ctx.setLineDash([4, 3]);
          ctx.strokeRect(px - 3, py - 3, pw + 6, ph + 6);
          ctx.setLineDash([]);
        }

        // Specific Package Footprint Rendering
        if (comp.type === 'qfp') {
          // STM32F4 QFP-64 Package
          // Perimeter Gold Lead Pads
          ctx.fillStyle = '#fbbf24';
          for (let i = 8; i < pw - 8; i += 7) {
            ctx.fillRect(px + i, py - 4, 3.5, 4);
            ctx.fillRect(px + i, py + ph, 3.5, 4);
          }
          for (let j = 8; j < ph - 8; j += 7) {
            ctx.fillRect(px - 4, py + j, 4, 3.5);
            ctx.fillRect(px + pw, py + j, 4, 3.5);
          }

          // Molded Epoxy Package Body with Beveled Chamfers
          ctx.fillStyle = isSelected ? '#1e2433' : '#141720';
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, 4);
          ctx.fill();
          ctx.strokeStyle = '#2d3748';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Exposed Thermal Center Ground Pad
          ctx.fillStyle = '#d97706';
          ctx.fillRect(px + pw / 2 - 12, py + ph / 2 - 12, 24, 24);

          // Pin 1 Index Notch
          ctx.fillStyle = '#00e5ff';
          ctx.beginPath();
          ctx.arc(px + 8, py + 8, 2.5, 0, Math.PI * 2);
          ctx.fill();

          // Laser Engraved IC Silkscreen
          ctx.fillStyle = '#94a3b8';
          ctx.font = '700 8px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(comp.id, px + pw / 2, py + ph / 2 - 3);
          ctx.font = '500 7px "JetBrains Mono", monospace';
          ctx.fillText('STM32F407', px + pw / 2, py + ph / 2 + 7);
          ctx.textAlign = 'left';
        } else if (comp.type === 'bga') {
          // FPGA BGA-256 Package with Metallic Heat-Spreader
          // Substrate PCB Border
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(px, py, pw, ph);

          // Metallic Anodized Aluminum Lid
          const lidMargin = 6;
          ctx.fillStyle = isSelected ? '#334155' : '#1e2430';
          ctx.fillRect(px + lidMargin, py + lidMargin, pw - lidMargin * 2, ph - lidMargin * 2);
          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + lidMargin, py + lidMargin, pw - lidMargin * 2, ph - lidMargin * 2);

          // BGA Corner Orientation Chamfer
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.moveTo(px + lidMargin, py + lidMargin + 8);
          ctx.lineTo(px + lidMargin + 8, py + lidMargin);
          ctx.lineTo(px + lidMargin, py + lidMargin);
          ctx.closePath();
          ctx.fill();

          // Laser Text
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '700 9px "JetBrains Mono", monospace';
          ctx.textAlign = 'center';
          ctx.fillText(comp.id, px + pw / 2, py + ph / 2 - 4);
          ctx.font = '500 7px "JetBrains Mono", monospace';
          ctx.fillStyle = '#94a3b8';
          ctx.fillText('XILINX 56G', px + pw / 2, py + ph / 2 + 7);
          ctx.textAlign = 'left';
        } else if (comp.type === 'conn') {
          // USB-C Receptacle Package
          // Metal Shell
          ctx.fillStyle = isSelected ? '#384252' : '#272f3d';
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, 4);
          ctx.fill();
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Ground Hold-Down Retention Tabs
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(px + 4, py - 3, 6, 3);
          ctx.fillRect(px + pw - 10, py - 3, 6, 3);
          ctx.fillRect(px + 4, py + ph, 6, 3);
          ctx.fillRect(px + pw - 10, py + ph, 6, 3);

          // Front Bezel Tongue & Opening
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.roundRect(px + 4, py + 8, 8, ph - 16, 2);
          ctx.fill();

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '700 8px "JetBrains Mono", monospace';
          ctx.fillText('USB-C', px + 15, py + ph / 2 + 3);
        } else if (comp.type === 'sot') {
          // SOT-223 Voltage Regulator
          // Tab Heat Sink Lead (Top)
          ctx.fillStyle = '#fbbf24';
          ctx.fillRect(px + pw / 2 - 8, py - 4, 16, 4);

          // 3 Output Leads (Bottom)
          ctx.fillRect(px + 4, py + ph, 5, 4);
          ctx.fillRect(px + pw / 2 - 2.5, py + ph, 5, 4);
          ctx.fillRect(px + pw - 9, py + ph, 5, 4);

          // Molded Body
          ctx.fillStyle = '#1e2430';
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, 2);
          ctx.fill();
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.stroke();

          ctx.fillStyle = '#cbd5e1';
          ctx.font = '700 8px "JetBrains Mono", monospace';
          ctx.fillText(comp.id, px + 5, py + ph / 2 + 3);
        } else if (comp.type === 'xtal') {
          // Crystal Oscillator Hermetic Can
          ctx.fillStyle = '#b45309';
          ctx.beginPath();
          ctx.roundRect(px, py, pw, ph, 2);
          ctx.fill();
          ctx.fillStyle = '#fef3c7';
          ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
          ctx.fillStyle = '#78350f';
          ctx.font = '700 7px "JetBrains Mono", monospace';
          ctx.fillText('25.0M', px + 3, py + ph / 2 + 2);
        } else if (comp.type === 'testpoint') {
          // Gold Circular Test Point
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(px + pw / 2, py + ph / 2, pw / 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#fbbf24';
          ctx.lineWidth = 1.4;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = '700 7px "JetBrains Mono", monospace';
          ctx.fillText(comp.id, px - 2, py - 2);
        } else if (comp.type === 'hole') {
          // M3 Mounting Standoff with Annular Thermal Relief Vias
          ctx.fillStyle = '#05070a';
          ctx.beginPath();
          ctx.arc(px + pw / 2, py + ph / 2, 7, 0, Math.PI * 2);
          ctx.fill();

          // Plated Ring
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 3.5;
          ctx.stroke();

          // 8 Thermal Ground Vias around hole
          ctx.fillStyle = '#fbbf24';
          for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
            const hx = px + pw / 2 + Math.cos(a) * 11;
            const hy = py + ph / 2 + Math.sin(a) * 11;
            ctx.beginPath();
            ctx.arc(hx, hy, 1.4, 0, Math.PI * 2);
            ctx.fill();
          }
        } else {
          // SMD Passive (Resistor, Capacitor, LED)
          // Ceramic or Epoxy Body
          const isCap = comp.type === 'smd_cap';
          const isLed = comp.type === 'smd_led';
          ctx.fillStyle = isCap ? '#854d0e' : isLed ? '#065f46' : '#1e2430';
          ctx.fillRect(px, py, pw, ph);

          // Metallic Solder Terminals on Ends
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(px, py, 3.5, ph);
          ctx.fillRect(px + pw - 3.5, py, 3.5, ph);

          // Silkscreen RefDes
          ctx.fillStyle = '#cbd5e1';
          ctx.font = '700 7.5px "JetBrains Mono", monospace';
          ctx.fillText(comp.id, px + 1, py - 3);
        }

        ctx.restore();
      });

      // 7. Silkscreen Board Title & Revision Stamp
      ctx.textAlign = 'center';
      ctx.fillStyle = mask.silk;
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.fillText('ALTIUM DESIGNER 24 // HIGH-SPEED ECAD MATRIX', 0, pcbY + 22);

      ctx.fillStyle = violations.length > 0 ? '#ef4444' : '#10b981';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.fillText(
        `LAYER: ${activeLayer} | NETS: ${traces.length} | IMPEDANCE: 50Ω | DRC: ${
          violations.length > 0 ? `${violations.length} VIOLATION(S)` : '0 ERRORS (VERIFIED)'
        }`,
        0,
        pcbY + 36
      );

      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillText('SRM ROBOCON // HW-MECH CO-DESIGN LAB // REV 2.4', 0, pcbY + pcbH - 12);
      ctx.textAlign = 'left';

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [
    components,
    traces,
    selectedComp,
    selectedTrace,
    selectedNet,
    activeLayer,
    activeTool,
    routingSourceId,
    mouseBoardPos,
    isolateLayer,
    violations,
    solderMask,
    viewMode,
    zoom,
    panOffset,
    signalsActive
  ]);

  // Real-Time Animated Oscilloscope Waveform RAF Loop
  useEffect(() => {
    const scopeCanvas = scopeCanvasRef.current;
    if (!scopeCanvas) return;
    const ctx = scopeCanvas.getContext('2d');
    let scopeAnimId = 0;
    let t = 0;

    const renderScope = () => {
      const w = (scopeCanvas.width = scopeCanvas.clientWidth || 250);
      const h = (scopeCanvas.height = scopeCanvas.clientHeight || 120);

      // CRT phosphor dark background
      ctx.fillStyle = '#060a0e';
      ctx.fillRect(0, 0, w, h);

      // Oscilloscope Graticule (Subdivision Grid)
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.12)';
      ctx.lineWidth = 1;
      const xDivs = 8;
      const yDivs = 6;
      for (let i = 0; i <= xDivs; i++) {
        const gx = (w / xDivs) * i;
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let j = 0; j <= yDivs; j++) {
        const gy = (h / yDivs) * j;
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      // Center Dotted Crosshairs
      ctx.strokeStyle = 'rgba(0, 229, 255, 0.28)';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(w / 2, 0);
      ctx.lineTo(w / 2, h);
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Generate Live Signal Waveform based on selected trace or net
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2.0;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 8;
      ctx.beginPath();

      const activeTr = traces.find((tr) => tr.net === selectedNet || tr.id === selectedTrace?.id);
      const sigType = activeTr ? activeTr.signalType : 'clock';

      for (let x = 0; x < w; x++) {
        let y = h / 2;
        if (sigType === 'clock') {
          // 25MHz Square Wave with high-speed slew-rate exponential curvature
          const phase = (x * 0.08 + t * 0.18) % (Math.PI * 2);
          const rawSq = Math.sin(phase) > 0 ? 1 : -1;
          const rounded = Math.tanh(rawSq * 4);
          y = h / 2 - rounded * (h * 0.35);
        } else if (sigType === 'diff') {
          // High-Speed 480Mbps Serial PRBS Eye-Pattern Simulation
          const p1 = Math.sin(x * 0.12 + t * 0.25);
          const p2 = Math.cos(x * 0.06 - t * 0.15);
          y = h / 2 - (p1 * 0.7 + p2 * 0.3) * (h * 0.32);
        } else if (sigType === 'power') {
          // 3.3V DC Rail with Switch-Mode 100kHz ripple noise
          const ripple = Math.sin(x * 0.25 + t * 0.3) * 3 + Math.sin(x * 0.7 - t * 0.4) * 1.5;
          y = h / 2 - h * 0.25 + ripple;
        } else {
          // GND Clean Low Line
          y = h * 0.85 + (Math.random() - 0.5) * 1.2;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      t += 0.8;
      scopeAnimId = requestAnimationFrame(renderScope);
    };

    scopeAnimId = requestAnimationFrame(renderScope);
    return () => cancelAnimationFrame(scopeAnimId);
  }, [selectedNet, selectedTrace, traces]);

  // Pointer Handlers: Move, Select, Routing & Drag
  const handlePointerDown = (clientX, clientY, e) => {
    // Middle-click or Alt-click initiates pan
    if (e?.button === 1 || activeTool === 'pan') {
      setIsPanning(true);
      setPanStart({ x: clientX - panOffset.x, y: clientY - panOffset.y });
      return;
    }

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
        if (clickedComp.netAssignments && clickedComp.netAssignments[0]) {
          setSelectedNet(clickedComp.netAssignments[0]);
        }
        setIsDragging(true);
        setDraggedId(clickedComp.id);
        setDragOffset({ x: coords.x - clickedComp.rx, y: coords.y - clickedComp.ry });
        setStatusText(`Selected Footprint ${clickedComp.id} (${clickedComp.name}) • Drag to reposition • Press 'R' to rotate`);
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

          const d1 = Math.hypot(coords.x - x1, coords.y - y1);
          const d2 = Math.hypot(coords.x - x2, coords.y - y2);
          const dTotal = Math.hypot(x2 - x1, y2 - y1);
          return Math.abs(d1 + d2 - dTotal) < 14;
        });

        if (clickedTrace) {
          setSelectedTrace(clickedTrace);
          setSelectedNet(clickedTrace.net);
          setSelectedComp(null);
          setStatusText(`Selected Copper Net [${clickedTrace.net}] (${clickedTrace.from} ➔ ${clickedTrace.to}) on Layer ${clickedTrace.layer}`);
        } else {
          setSelectedComp(null);
          setSelectedTrace(null);
          setStatusText('Altium 24 Engine Ready • 0 DRC Violations');
        }
      }
    } else if (activeTool === 'route') {
      if (clickedComp) {
        if (!routingSourceId) {
          setRoutingSourceId(clickedComp.id);
          setStatusText(`⚡ Routing Net from ${clickedComp.id}: Click destination pin to finish 45° track`);
        } else if (routingSourceId === clickedComp.id) {
          setRoutingSourceId(null);
          setStatusText('Routing cancelled.');
        } else {
          const layerColor =
            activeLayer === 'L1_TOP'
              ? '#ef4444'
              : activeLayer === 'L2_GND'
              ? '#06b6d4'
              : activeLayer === 'L3_PWR'
              ? '#f59e0b'
              : '#3b82f6';

          const newTrace = {
            id: `TR_${Date.now()}`,
            net: `NET_${routingSourceId}_${clickedComp.id}`,
            from: routingSourceId,
            to: clickedComp.id,
            layer: activeLayer,
            color: layerColor,
            width: 2.0,
            signalType: 'diff',
            voltage: '3.3V',
            frequency: '100MHz',
            impedance: '50.0 Ω'
          };

          setTraces((prev) => [...prev, newTrace]);
          setSelectedTrace(newTrace);
          setSelectedNet(newTrace.net);
          setStatusText(`✓ Routed 45° Net [${routingSourceId} ➔ ${clickedComp.id}] on ${activeLayer} (Impedance: 50.0Ω)`);
          setRoutingSourceId(null);
        }
      } else {
        setRoutingSourceId(null);
        setStatusText('Routing cancelled • Click component pin to start');
      }
    }
  };

  const handlePointerMove = (clientX, clientY) => {
    if (isPanning) {
      setPanOffset({
        x: clientX - panStart.x,
        y: clientY - panStart.y
      });
      return;
    }

    const coords = getBoardCoords(clientX, clientY);
    if (!coords) return;
    setMouseBoardPos(coords);

    if (isDragging && draggedId && activeTool === 'select') {
      const comp = components.find((c) => c.id === draggedId);
      if (!comp) return;

      const rawRx = coords.x - dragOffset.x;
      const rawRy = coords.y - dragOffset.y;

      // 4px CAD grid snap (~0.2mm)
      const snapRx = Math.round(rawRx / 4) * 4;
      const snapRy = Math.round(rawRy / 4) * 4;

      // Clamp inside 440x250 board boundary
      const clampedRx = Math.max(-210, Math.min(210 - comp.w, snapRx));
      const clampedRy = Math.max(-115, Math.min(115 - comp.h, snapRy));

      setComponents((prev) =>
        prev.map((c) => (c.id === draggedId ? { ...c, rx: clampedRx, ry: clampedRy } : c))
      );
      setSelectedComp((prev) => (prev?.id === draggedId ? { ...prev, rx: clampedRx, ry: clampedRy } : prev));
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedId(null);
    }
    if (isPanning) {
      setIsPanning(false);
    }
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoomDelta = e.deltaY < 0 ? 0.1 : -0.1;
    setZoom((prev) => Math.max(0.6, Math.min(2.4, prev + zoomDelta)));
  };

  const handleAddComponent = (type) => {
    const nextId = `${type === 'cap' ? 'C' : type === 'led' ? 'D' : type === 'res' ? 'R' : 'Y'}${components.length + 1}`;
    let newComp;

    if (type === 'cap') {
      newComp = {
        id: nextId,
        name: '0402 100nF Cap',
        desc: 'SMD MLCC Bypass',
        package: '0402',
        rx: -20,
        ry: 20,
        w: 16,
        h: 10,
        rot: 0,
        height3D: 0.6,
        pins: 2,
        type: 'smd_cap',
        silkscreen: nextId,
        netAssignments: ['PWR_3V3']
      };
    } else if (type === 'led') {
      newComp = {
        id: nextId,
        name: '0805 Status LED',
        desc: 'Emerald Indicating Diode',
        package: '0805',
        rx: 30,
        ry: 30,
        w: 18,
        h: 11,
        rot: 0,
        height3D: 0.8,
        pins: 2,
        type: 'smd_led',
        silkscreen: nextId,
        netAssignments: ['PWR_3V3']
      };
    } else if (type === 'res') {
      newComp = {
        id: nextId,
        name: '0603 50Ω Resistor',
        desc: 'Thick Film Terminator',
        package: '0603',
        rx: -50,
        ry: -35,
        w: 18,
        h: 10,
        rot: 0,
        height3D: 0.6,
        pins: 2,
        type: 'smd_res',
        silkscreen: nextId,
        netAssignments: ['HS_BUS']
      };
    } else {
      newComp = {
        id: nextId,
        name: '25MHz TCXO Crystal',
        desc: 'Precision Oscillator',
        package: 'SMD-3225',
        rx: 0,
        ry: 45,
        w: 24,
        h: 18,
        rot: 0,
        height3D: 1.0,
        pins: 4,
        type: 'xtal',
        silkscreen: nextId,
        netAssignments: ['CLK_25M']
      };
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
    setSelectedNet('CLK_25M');
    setRoutingSourceId(null);
    setZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
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
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '110px clamp(12px, 3vw, 24px) 36px' }}>
      {/* Studio Header Bar */}
      <div className="studio-header-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Cpu size={22} color="#0284c7" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Altium Designer 24 ECAD Studio
            </h2>
            <span className="tag-badge alt-tag font-mono" style={{ fontSize: '0.68rem' }}>
              MULTI-LAYER HIGH-SPEED ROUTER
            </span>
          </div>
          <p style={{ color: '#475569', fontSize: '0.84rem', marginTop: '2px' }}>
            Interactive ECAD engine: Drag IC footprints with real-time rubberbanding, route 45° mitred differential nets, inspect live oscillograms, and verify IPC-2221 clearances.
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

      {/* Main Studio 3-Column Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '260px 1fr 310px',
          gap: '16px',
          alignItems: 'stretch'
        }}
        className="studio-grid-mobile"
      >
        {/* Left Column: Layer Stackup & Solder Mask Customization */}
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

          {/* Layer Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
            {[
              { id: 'L1_TOP', name: 'L1 Top Signals [RF/56G]', color: '#ef4444' },
              { id: 'L2_GND', name: 'L2 Ground Plane', color: '#0284c7' },
              { id: 'L3_PWR', name: 'L3 Power Rails [3.3V]', color: '#f59e0b' },
              { id: 'L4_BOT', name: 'L4 Bottom Signals', color: '#2563eb' }
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

          {/* Solder Mask Color Switcher */}
          <div style={{ marginBottom: '16px' }}>
            <span className="font-mono" style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
              SOLDER MASK SUBSTRATE
            </span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
              {Object.entries(SOLDER_MASKS).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setSolderMask(k)}
                  style={{
                    height: '26px',
                    borderRadius: '5px',
                    background: v.bg,
                    border: solderMask === k ? '2px solid #00e5ff' : '1px solid rgba(0,0,0,0.2)',
                    cursor: 'pointer',
                    boxShadow: solderMask === k ? '0 0 8px rgba(0, 229, 255, 0.4)' : 'none'
                  }}
                  title={v.name}
                />
              ))}
            </div>
          </div>

          {/* Placed Footprint List */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              PLACED FOOTPRINTS ({components.length})
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.78rem', maxHeight: '180px', overflowY: 'auto' }}>
            {components.map((comp) => {
              const isColliding = violations.some((v) => v.c1 === comp.id || v.c2 === comp.id);
              return (
                <div
                  key={comp.id}
                  onClick={() => {
                    setSelectedComp(comp);
                    setSelectedTrace(null);
                    if (comp.netAssignments && comp.netAssignments[0]) {
                      setSelectedNet(comp.netAssignments[0]);
                    }
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
                  <span style={{ color: '#64748b', fontSize: '0.74rem' }}>{comp.package}</span>
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

        {/* Center Column: Live Interactive ECAD Canvas Viewport */}
        <div
          className="pro-panel"
          style={{
            minHeight: '560px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Top Interactive CAD Toolbar */}
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
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                onClick={() => {
                  setActiveTool('select');
                  setRoutingSourceId(null);
                  setStatusText('Inspect & Move mode active • Drag footprints to reposition • Press R to rotate');
                }}
                style={{
                  padding: '5px 11px',
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
                  setStatusText('⚡ 45° Mitred Routing Active: Click any IC pin or test point to start route');
                }}
                style={{
                  padding: '5px 11px',
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

              {/* Rotate Tool */}
              <button
                onClick={handleRotateSelected}
                disabled={!selectedComp}
                style={{
                  padding: '5px 9px',
                  borderRadius: '5px',
                  background: selectedComp ? '#ffffff' : '#f1f5f9',
                  border: '1px solid var(--border-subtle)',
                  color: selectedComp ? '#0f172a' : '#94a3b8',
                  fontSize: '0.74rem',
                  cursor: selectedComp ? 'pointer' : 'not-allowed',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Rotate Selected Footprint 90° (R)"
              >
                <RotateCw size={12} />
                <span>Rotate</span>
              </button>
            </div>

            {/* View Mode & Signal Animation Toggles */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {/* 2D / 3D Toggle */}
              <div style={{ display: 'flex', background: '#e2e8f0', padding: '2px', borderRadius: '6px', gap: '2px' }}>
                <button
                  onClick={() => setViewMode('2D')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: viewMode === '2D' ? '#ffffff' : 'transparent',
                    color: viewMode === '2D' ? '#0f172a' : '#64748b',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  2D CAD
                </button>
                <button
                  onClick={() => setViewMode('3D')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    background: viewMode === '3D' ? '#ffffff' : 'transparent',
                    color: viewMode === '3D' ? '#0f172a' : '#64748b',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  3D View
                </button>
              </div>

              {/* Signals Flow Toggle */}
              <button
                onClick={() => setSignalsActive(!signalsActive)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '5px',
                  background: signalsActive ? '#ecfdf5' : '#f1f5f9',
                  border: signalsActive ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  color: signalsActive ? '#059669' : '#64748b',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Toggle Real-Time Animated Signal Transmission"
              >
                {signalsActive ? <Play size={10} fill="#059669" /> : <Pause size={10} />}
                <span>{signalsActive ? 'Signals Live' : 'Signals Off'}</span>
              </button>

              {/* Zoom Controls */}
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                <button
                  onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
                  style={{ padding: '4px 6px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <ZoomOut size={12} color="#475569" />
                </button>
                <button
                  onClick={() => setZoom((z) => Math.min(2.4, z + 0.15))}
                  style={{ padding: '4px 6px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer' }}
                >
                  <ZoomIn size={12} color="#475569" />
                </button>
                <button
                  onClick={() => {
                    setZoom(1.0);
                    setPanOffset({ x: 0, y: 0 });
                  }}
                  style={{ padding: '4px 6px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '4px', cursor: 'pointer' }}
                  title="Fit Board to View"
                >
                  <Maximize2 size={12} color="#475569" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Component Placement Bar */}
          <div style={{ padding: '6px 12px', background: '#ffffff', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.7rem' }}>
            <span className="font-mono" style={{ color: '#64748b', fontWeight: 600 }}>+ ADD FOOTPRINT:</span>
            <button
              onClick={() => handleAddComponent('cap')}
              style={{ padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: '#0f172a' }}
            >
              0402 Cap
            </button>
            <button
              onClick={() => handleAddComponent('res')}
              style={{ padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: '#0f172a' }}
            >
              0603 Res
            </button>
            <button
              onClick={() => handleAddComponent('led')}
              style={{ padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: '#059669' }}
            >
              0805 LED
            </button>
            <button
              onClick={() => handleAddComponent('xtal')}
              style={{ padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: '#b45309' }}
            >
              25MHz TCXO
            </button>
          </div>

          {/* Canvas Viewport Box */}
          <div
            ref={containerRef}
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              minHeight: '390px',
              background: '#040608',
              cursor: activeTool === 'route' ? 'crosshair' : isDragging ? 'grabbing' : 'grab',
              touchAction: 'none'
            }}
            onMouseDown={(e) => handlePointerDown(e.clientX, e.clientY, e)}
            onMouseMove={(e) => handlePointerMove(e.clientX, e.clientY)}
            onMouseUp={handlePointerUp}
            onMouseLeave={handlePointerUp}
            onWheel={handleWheel}
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
                NETS: {traces.length} | VIAS: 18 | ZOOM: {(zoom * 100).toFixed(0)}%
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
                  <span>{selectedComp ? `Delete ${selectedComp.id}` : 'Rip Up Net'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Live Oscilloscope & Signal Analyzer */}
        <div className="pro-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#0284c7', textTransform: 'uppercase', fontWeight: 600 }}>
              LIVE SIGNAL ANALYZER
            </span>
            <span className="font-mono" style={{ fontSize: '0.68rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'spinSlow 2s linear infinite' }} />
              2.5 GSa/s
            </span>
          </div>

          {/* Real-Time Digital Oscilloscope CRT Screen */}
          <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid #1e293b', background: '#060a0e', position: 'relative' }}>
            <canvas ref={scopeCanvasRef} style={{ width: '100%', height: '115px', display: 'block' }} />
            <div style={{ position: 'absolute', top: '6px', left: '8px', fontSize: '0.66rem', color: '#00e5ff', fontFamily: 'monospace', fontWeight: 700 }}>
              CH1 // {selectedNet}
            </div>
            <div style={{ position: 'absolute', bottom: '6px', right: '8px', fontSize: '0.62rem', color: '#64748b', fontFamily: 'monospace' }}>
              500mV/div | 10ns/div
            </div>
          </div>

          {/* Live Waveform Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.74rem' }}>
            <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>FREQUENCY</span>
              <strong className="font-mono" style={{ color: '#059669' }}>
                {selectedNet === 'CLK_25M' ? '25.000 MHz' : selectedNet === 'HS_BUS' ? '480.0 Mbps' : selectedNet === 'VBUS_5V' ? 'DC 0 Hz' : '100 kHz'}
              </strong>
            </div>
            <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>VOLTAGE PEAK</span>
              <strong className="font-mono" style={{ color: '#0f172a' }}>
                {selectedNet === 'VBUS_5V' ? '5.02 V' : selectedNet === 'HS_BUS' ? '1.20 Vpp' : '3.31 Vpp'}
              </strong>
            </div>
            <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>IMPEDANCE (Z0)</span>
              <strong className="font-mono" style={{ color: '#b45309' }}>50.1 Ω ±2%</strong>
            </div>
            <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>FLIGHT DELAY</span>
              <strong className="font-mono" style={{ color: '#0284c7' }}>218 ps</strong>
            </div>
          </div>

          {/* Active Net Channel Selector */}
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '0.68rem', marginBottom: '6px', fontWeight: 600 }}>PROBE CHANNELS</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
              {['CLK_25M', 'HS_BUS', 'PWR_3V3', 'USB_DP', 'VBUS_5V', 'GND'].map((netName) => (
                <button
                  key={netName}
                  onClick={() => setSelectedNet(netName)}
                  style={{
                    padding: '4px 6px',
                    borderRadius: '4px',
                    background: selectedNet === netName ? '#0284c7' : '#f8fafc',
                    color: selectedNet === netName ? '#ffffff' : '#475569',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.66rem',
                    fontFamily: 'monospace',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {netName}
                </button>
              ))}
            </div>
          </div>

          {/* Selected Component / Trace Details */}
          {selectedComp ? (
            <div style={{ padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', fontSize: '0.74rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ color: '#0f172a', fontSize: '0.85rem' }}>{selectedComp.id}</strong>
                <span className="font-mono" style={{ color: '#b45309', fontWeight: 700 }}>{selectedComp.package}</span>
              </div>
              <div style={{ color: '#0284c7', fontSize: '0.72rem', marginBottom: '6px' }}>{selectedComp.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', color: '#64748b', fontSize: '0.7rem' }}>
                <div>POS: <strong className="font-mono" style={{ color: '#0f172a' }}>{selectedComp.rx}, {selectedComp.ry}</strong></div>
                <div>HEIGHT: <strong className="font-mono" style={{ color: '#0f172a' }}>{selectedComp.height3D}mm</strong></div>
              </div>
            </div>
          ) : selectedTrace ? (
            <div style={{ padding: '10px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', fontSize: '0.74rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ color: selectedTrace.color, fontSize: '0.85rem' }}>{selectedTrace.net}</strong>
                <span className="font-mono" style={{ color: '#0f172a' }}>{selectedTrace.layer}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '0.7rem' }}>ROUTE: {selectedTrace.from} ➔ {selectedTrace.to}</div>
            </div>
          ) : (
            <div style={{ padding: '12px', textAlign: 'center', color: '#64748b', fontSize: '0.74rem', background: '#f8fafc', borderRadius: '8px' }}>
              Select any component or probe channel above to inspect its real-time electrical waveform.
            </div>
          )}

          {/* IPC-2221 Rules Summary */}
          <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5 }}>
            • Microstrip Z0: <strong style={{ color: '#0f172a' }}>50Ω ±5% (0.20mm track)</strong><br />
            • Differential Pair: <strong style={{ color: '#0f172a' }}>100Ω SerDes (6 mil space)</strong><br />
            • Clearance Rule: <strong style={{ color: '#0f172a' }}>0.15mm (IPC-2221 Class 3)</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
