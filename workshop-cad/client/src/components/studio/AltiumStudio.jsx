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
  Info,
  Link,
  PlusCircle,
  Compass
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
    rx: -70,
    ry: 0,
    w: 68,
    h: 68,
    rot: 0,
    height3D: 2.2,
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
    rx: 80,
    ry: 0,
    w: 78,
    h: 78,
    rot: 0,
    height3D: 2.4,
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
    rx: -180,
    ry: 8,
    w: 42,
    h: 36,
    rot: 0,
    height3D: 3.6,
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
    rx: -130,
    ry: -60,
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
    rx: -60,
    ry: 70,
    w: 24,
    h: 18,
    rot: 0,
    height3D: 1.2,
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
    rx: -14,
    ry: -48,
    w: 16,
    h: 10,
    rot: 0,
    height3D: 0.8,
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
    ry: -48,
    w: 20,
    h: 12,
    rot: 0,
    height3D: 1.0,
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
    rx: 20,
    ry: 36,
    w: 18,
    h: 10,
    rot: 0,
    height3D: 0.8,
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
    rx: -115,
    ry: 52,
    w: 18,
    h: 11,
    rot: 0,
    height3D: 0.9,
    pins: 2,
    type: 'smd_led',
    silkscreen: 'D1',
    netAssignments: ['PWR_3V3', 'GND']
  }
];

const INITIAL_TRACES = [
  {
    id: 'TR1',
    net: 'HS_BUS',
    from: 'U1',
    to: 'U2',
    layer: 'L1_TOP',
    color: '#ef4444',
    width: 2.5,
    signalType: 'diff',
    voltage: '1.2Vpp',
    frequency: '480 MHz',
    impedance: '50.1 Ω'
  },
  {
    id: 'TR2',
    net: 'CLK_25M',
    from: 'Y1',
    to: 'U1',
    layer: 'L1_TOP',
    color: '#ef4444',
    width: 2.0,
    signalType: 'clock',
    voltage: '3.3Vpp',
    frequency: '25.000 MHz',
    impedance: '50.0 Ω'
  },
  {
    id: 'TR3',
    net: 'USB_DP',
    from: 'J1',
    to: 'U1',
    layer: 'L1_TOP',
    color: '#ef4444',
    width: 2.2,
    signalType: 'diff',
    voltage: '3.3V',
    frequency: '12 Mbps',
    impedance: '45.0 Ω'
  },
  {
    id: 'TR4',
    net: 'PWR_3V3',
    from: 'U3',
    to: 'U1',
    layer: 'L3_PWR',
    color: '#f59e0b',
    width: 3.5,
    signalType: 'power',
    voltage: '3.30V DC',
    frequency: 'DC',
    impedance: '0.02 Ω'
  },
  {
    id: 'TR5',
    net: 'PWR_3V3',
    from: 'U1',
    to: 'U2',
    layer: 'L3_PWR',
    color: '#f59e0b',
    width: 3.5,
    signalType: 'power',
    voltage: '3.30V DC',
    frequency: 'DC',
    impedance: '0.02 Ω'
  },
  {
    id: 'TR6',
    net: 'HS_BUS',
    from: 'U2',
    to: 'R1',
    layer: 'L1_TOP',
    color: '#ef4444',
    width: 2.0,
    signalType: 'diff',
    voltage: '1.2Vpp',
    frequency: '480 MHz',
    impedance: '50.0 Ω'
  },
  {
    id: 'TR7',
    net: 'VBUS_5V',
    from: 'J1',
    to: 'U3',
    layer: 'L3_PWR',
    color: '#f59e0b',
    width: 3.8,
    signalType: 'power',
    voltage: '5.02V DC',
    frequency: 'DC',
    impedance: '0.01 Ω'
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

  // 3D Viewport Orbit & Camera State
  const [rotation3D, setRotation3D] = useState({ x: 32, y: -38 });
  const [autoRotate3D, setAutoRotate3D] = useState(false);

  // Zoom & Pan
  const [zoom, setZoom] = useState(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Selections
  const [selectedComp, setSelectedComp] = useState(null);
  const [selectedTrace, setSelectedTrace] = useState(null);
  const [selectedNet, setSelectedNet] = useState('CLK_25M');
  const [targetConnectId, setTargetConnectId] = useState('');

  // DRC & Status
  const [statusText, setStatusText] = useState('Altium 24 Engine Ready • 0 DRC Violations • High-Speed ECAD Core Online');
  const [drcPassed, setDrcPassed] = useState(true);

  // Components & Traces
  const [components, setComponents] = useState(INITIAL_COMPONENTS);
  const [traces, setTraces] = useState(INITIAL_TRACES);

  // Dragging State
  const [isDragging, setIsDragging] = useState(false);
  const [draggedId, setDraggedId] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });

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

  // Convert Screen Canvas Mouse Coordinates to Board Internal Coordinates (2D)
  const getBoardCoords = (clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const cx = canvas.width / 2 + panOffset.x;
    const cy = canvas.height / 2 + panOffset.y;
    const baseScale = Math.min(1.0, Math.max(0.65, (canvas.width - 32) / 460)) * zoom;

    return {
      x: (mouseX - cx) / baseScale,
      y: (mouseY - cy) / baseScale
    };
  };

  // 3D Standard CAD Presets
  const set3DPreset = (view) => {
    if (view === 'iso') setRotation3D({ x: 32, y: -38 });
    else if (view === 'top') setRotation3D({ x: 90, y: 0 });
    else if (view === 'front') setRotation3D({ x: 0, y: 0 });
    else if (view === 'right') setRotation3D({ x: 0, y: -90 });
    setStatusText(`3D Camera: Standard ${view.toUpperCase()} View Alignment`);
  };

  // 60FPS Digital Oscilloscope Simulation CRT Waveform
  useEffect(() => {
    const scopeCanvas = scopeCanvasRef.current;
    if (!scopeCanvas) return;
    const sCtx = scopeCanvas.getContext('2d');
    let scopeAnimId;
    let scopeTime = 0;

    const renderScope = () => {
      scopeTime += 0.05;
      const w = (scopeCanvas.width = scopeCanvas.clientWidth);
      const h = (scopeCanvas.height = scopeCanvas.clientHeight);

      sCtx.fillStyle = '#060a0e';
      sCtx.fillRect(0, 0, w, h);

      // CRT Grid Division Lines
      sCtx.strokeStyle = 'rgba(0, 229, 255, 0.08)';
      sCtx.lineWidth = 1;
      const divX = w / 8;
      const divY = h / 4;
      for (let x = 0; x <= w; x += divX) {
        sCtx.beginPath();
        sCtx.moveTo(x, 0);
        sCtx.lineTo(x, h);
        sCtx.stroke();
      }
      for (let y = 0; y <= h; y += divY) {
        sCtx.beginPath();
        sCtx.moveTo(0, y);
        sCtx.lineTo(w, y);
        sCtx.stroke();
      }

      // Draw Signal Trace Waveform
      sCtx.strokeStyle = '#00e5ff';
      sCtx.shadowColor = '#00e5ff';
      sCtx.shadowBlur = 8;
      sCtx.lineWidth = 1.8;
      sCtx.beginPath();

      const centerY = h / 2;
      const amp = h * 0.32;

      for (let x = 0; x < w; x++) {
        let y = centerY;
        const normX = x / w;

        if (selectedNet === 'CLK_25M') {
          // Sharp High-Speed 25MHz Square Clock Wave with rise/fall edges
          const phase = (normX * 8 + scopeTime * 2.5) % 1;
          const square = phase < 0.5 ? 1 : -1;
          // Soften edges slightly for authentic analog RC rise time
          const edgeSoft = Math.sin(phase * Math.PI * 2) * 0.15;
          y = centerY + (square * 0.85 + edgeSoft) * amp;
        } else if (selectedNet === 'HS_BUS') {
          // 480Mbps Differential Eye-Diagram PRBS Pattern
          const bit1 = Math.sin(normX * 24 + scopeTime * 4);
          const bit2 = Math.cos(normX * 48 + scopeTime * 8);
          y = centerY + (bit1 * 0.5 + bit2 * 0.4) * amp;
        } else if (selectedNet === 'VBUS_5V' || selectedNet === 'PWR_3V3') {
          // DC Power Rail with minor high-frequency switching ripple (<15mV)
          const ripple = Math.sin(normX * 36 + scopeTime * 6) * 0.08;
          y = centerY - amp * 0.75 + ripple * amp;
        } else {
          // Sine Wave Probe Signal
          y = centerY + Math.sin(normX * 12 + scopeTime * 3) * amp;
        }

        if (x === 0) sCtx.moveTo(x, y);
        else sCtx.lineTo(x, y);
      }
      sCtx.stroke();
      sCtx.shadowBlur = 0;

      scopeAnimId = requestAnimationFrame(renderScope);
    };

    scopeAnimId = requestAnimationFrame(renderScope);
    return () => cancelAnimationFrame(scopeAnimId);
  }, [selectedNet]);

  // Main 60FPS Canvas Loop (2D Precision CAD + True 3D Perspective Isometric Board View)
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    let startTime = performance.now();

    const render = (time) => {
      const elapsed = (time - startTime) * 0.001;

      // Turntable Auto-Rotate in 3D
      if (viewMode === '3D' && autoRotate3D && !isDragging) {
        setRotation3D((prev) => ({ ...prev, y: prev.y + 0.5 }));
      }

      const width = (canvas.width = container.clientWidth);
      const height = (canvas.height = container.clientHeight);

      if (width === 0 || height === 0) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2 + (viewMode === '2D' ? panOffset.x : 0);
      const cy = height / 2 + (viewMode === '2D' ? panOffset.y : 0);
      const mask = SOLDER_MASKS[solderMask] || SOLDER_MASKS.emerald;

      // ==========================================
      // TRUE 3D PERSPECTIVE RENDERING ENGINE
      // ==========================================
      if (viewMode === '3D') {
        const radX = (rotation3D.x * Math.PI) / 180;
        const radY = (rotation3D.y * Math.PI) / 180;

        // 3D Projection Matrix
        const project3D = (x, y, z) => {
          // Rotate Y (yaw)
          const x1 = x * Math.cos(radY) + z * Math.sin(radY);
          const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

          // Rotate X (pitch)
          const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
          const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

          const fov = 480 * zoom;
          const scale = fov / (fov + z2 + 380);

          return {
            x: cx + x1 * scale,
            y: cy + y2 * scale,
            depth: z2,
            scale
          };
        };

        // 1. Ground Datum CAD Grid
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
        ctx.lineWidth = 1;
        const gSize = 260;
        const gStep = 32;
        const groundY = 48;

        for (let gx = -gSize; gx <= gSize; gx += gStep) {
          const p1 = project3D(gx, groundY, -gSize);
          const p2 = project3D(gx, groundY, gSize);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
        for (let gz = -gSize; gz <= gSize; gz += gStep) {
          const p1 = project3D(-gSize, groundY, gz);
          const p2 = project3D(gSize, groundY, gz);
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // 2. 3D Solid FR4 PCB Slab (Multi-layer Board with real thickness)
        const pcbHalfW = 210;
        const pcbHalfD = 120;
        const pcbThick = 14; // ~1.6mm thickness scaled
        const topY = -pcbThick / 2;
        const botY = pcbThick / 2;

        const verts = [
          project3D(-pcbHalfW, topY, -pcbHalfD), // 0: Top Front Left
          project3D(pcbHalfW, topY, -pcbHalfD),  // 1: Top Front Right
          project3D(pcbHalfW, topY, pcbHalfD),   // 2: Top Back Right
          project3D(-pcbHalfW, topY, pcbHalfD),  // 3: Top Back Left
          project3D(-pcbHalfW, botY, -pcbHalfD), // 4: Bot Front Left
          project3D(pcbHalfW, botY, -pcbHalfD),  // 5: Bot Front Right
          project3D(pcbHalfW, botY, pcbHalfD),   // 6: Bot Back Right
          project3D(-pcbHalfW, botY, pcbHalfD)   // 7: Bot Back Left
        ];

        // Bottom Solder Mask Face
        ctx.fillStyle = mask.core;
        ctx.beginPath();
        ctx.moveTo(verts[4].x, verts[4].y);
        ctx.lineTo(verts[5].x, verts[5].y);
        ctx.lineTo(verts[6].x, verts[6].y);
        ctx.lineTo(verts[7].x, verts[7].y);
        ctx.closePath();
        ctx.fill();

        // 4 Multi-Layer FR4 Edge Faces (showing brown laminate core & gold copper foil stripes)
        const drawEdge = (i1, i2, i3, i4) => {
          ctx.fillStyle = '#1c150c'; // FR4 core edge
          ctx.beginPath();
          ctx.moveTo(verts[i1].x, verts[i1].y);
          ctx.lineTo(verts[i2].x, verts[i2].y);
          ctx.lineTo(verts[i3].x, verts[i3].y);
          ctx.lineTo(verts[i4].x, verts[i4].y);
          ctx.closePath();
          ctx.fill();

          // Internal Copper Plane Foil Stripes
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 1;
          const mid1x = (verts[i1].x + verts[i4].x) / 2;
          const mid1y = (verts[i1].y + verts[i4].y) / 2;
          const mid2x = (verts[i2].x + verts[i3].x) / 2;
          const mid2y = (verts[i2].y + verts[i3].y) / 2;
          ctx.beginPath();
          ctx.moveTo(mid1x, mid1y);
          ctx.lineTo(mid2x, mid2y);
          ctx.stroke();

          ctx.strokeStyle = mask.border;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        };

        // Render visible edge faces
        drawEdge(0, 1, 5, 4); // Front
        drawEdge(1, 2, 6, 5); // Right
        drawEdge(2, 3, 7, 6); // Back
        drawEdge(3, 0, 4, 7); // Left

        // Top Solder Mask Face with Solder Mask Relief
        ctx.fillStyle = mask.bg;
        ctx.beginPath();
        ctx.moveTo(verts[0].x, verts[0].y);
        ctx.lineTo(verts[1].x, verts[1].y);
        ctx.lineTo(verts[2].x, verts[2].y);
        ctx.lineTo(verts[3].x, verts[3].y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = mask.border;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Authentic Underlying Copper Ground Pour Sheen (Cross-hatched polygon flood)
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.04)';
        ctx.lineWidth = 1;
        for (let gx = -pcbHalfW + 12; gx <= pcbHalfW - 12; gx += 20) {
          const pt1 = project3D(gx, topY, -pcbHalfD + 12);
          const pt2 = project3D(gx + 30, topY, pcbHalfD - 12);
          ctx.beginPath();
          ctx.moveTo(pt1.x, pt1.y);
          ctx.lineTo(pt2.x, pt2.y);
          ctx.stroke();
        }

        // 3D Standoff Mounting Holes with 8-Point ENIG Gold Grounding Starburst Teeth
        const holes = [
          { x: -pcbHalfW + 20, z: -pcbHalfD + 20 },
          { x: pcbHalfW - 20, z: -pcbHalfD + 20 },
          { x: -pcbHalfW + 20, z: pcbHalfD - 20 },
          { x: pcbHalfW - 20, z: pcbHalfD - 20 }
        ];
        holes.forEach((hPos) => {
          const hp = project3D(hPos.x, topY, hPos.z);
          // 8 radial gold contact teeth
          ctx.fillStyle = '#f59e0b';
          for (let a = 0; a < 8; a++) {
            const ang = (a * Math.PI) / 4;
            const tx = hp.x + Math.cos(ang) * 9 * zoom;
            const ty = hp.y + Math.sin(ang) * 9 * zoom;
            ctx.beginPath();
            ctx.arc(tx, ty, 1.8 * zoom, 0, Math.PI * 2);
            ctx.fill();
          }
          // Gold annular ring
          ctx.fillStyle = '#d97706';
          ctx.beginPath();
          ctx.arc(hp.x, hp.y, 7.5 * zoom, 0, Math.PI * 2);
          ctx.fill();
          // Dark drill hole barrel
          ctx.fillStyle = '#060a0e';
          ctx.beginPath();
          ctx.arc(hp.x, hp.y, 4.2 * zoom, 0, Math.PI * 2);
          ctx.fill();
          // Silkscreen circular boundary
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.arc(hp.x, hp.y, 11 * zoom, 0, Math.PI * 2);
          ctx.stroke();
        });

        // Perimeter Ground Stitching Vias Array (EMI Shielding)
        const stitchingVias = [];
        for (let vx = -pcbHalfW + 36; vx <= pcbHalfW - 36; vx += 24) {
          stitchingVias.push({ x: vx, z: -pcbHalfD + 9 });
          stitchingVias.push({ x: vx, z: pcbHalfD - 9 });
        }
        for (let vz = -pcbHalfD + 26; vz <= pcbHalfD - 26; vz += 22) {
          stitchingVias.push({ x: -pcbHalfW + 9, z: vz });
          stitchingVias.push({ x: pcbHalfW - 9, z: vz });
        }
        stitchingVias.forEach((sv) => {
          const sp = project3D(sv.x, topY, sv.z);
          ctx.fillStyle = '#f59e0b'; // Gold annular ring
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 2.6 * zoom, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#05070a'; // Drill hole
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, 1.2 * zoom, 0, Math.PI * 2);
          ctx.fill();
        });

        // Top Silkscreen Legend & Annotations (Top Overlay)
        const silkMargin1 = project3D(-pcbHalfW + 12, topY, -pcbHalfD + 12);
        const silkMargin2 = project3D(pcbHalfW - 12, topY, -pcbHalfD + 12);
        const silkMargin3 = project3D(pcbHalfW - 12, topY, pcbHalfD - 12);
        const silkMargin4 = project3D(-pcbHalfW + 12, topY, pcbHalfD - 12);
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.55)';
        ctx.lineWidth = 0.9;
        ctx.beginPath();
        ctx.moveTo(silkMargin1.x, silkMargin1.y);
        ctx.lineTo(silkMargin2.x, silkMargin2.y);
        ctx.lineTo(silkMargin3.x, silkMargin3.y);
        ctx.lineTo(silkMargin4.x, silkMargin4.y);
        ctx.closePath();
        ctx.stroke();

        // Project Silk Stamp text
        const titlePt = project3D(-pcbHalfW + 36, topY, -pcbHalfD + 26);
        ctx.fillStyle = '#f8fafc';
        ctx.font = `700 ${Math.max(7, 8.5 * zoom)}px "JetBrains Mono", monospace`;
        ctx.textAlign = 'left';
        ctx.fillText('ROBOCON 2026 // MCAD-ECAD CO-DESIGN LAB', titlePt.x, titlePt.y);

        const subTitlePt = project3D(-pcbHalfW + 36, topY, -pcbHalfD + 36);
        ctx.fillStyle = '#94a3b8';
        ctx.font = `600 ${Math.max(6, 7 * zoom)}px "JetBrains Mono", monospace`;
        ctx.fillText('6-LAYER FR4 | IMPEDANCE 50Ω SE / 100Ω DIFF | REV 2.4', subTitlePt.x, subTitlePt.y);

        // Hardware Test Points with probe pads
        const testPoints = [
          { label: 'TP1 [3V3]', x: -pcbHalfW + 40, z: pcbHalfD - 26 },
          { label: 'TP2 [GND]', x: -pcbHalfW + 72, z: pcbHalfD - 26 },
          { label: 'TP3 [CLK]', x: 20, z: pcbHalfD - 26 },
          { label: 'TP4 [USB]', x: 60, z: pcbHalfD - 26 }
        ];
        testPoints.forEach((tp) => {
          const tpp = project3D(tp.x, topY, tp.z);
          ctx.fillStyle = '#fbbf24';
          ctx.beginPath();
          ctx.arc(tpp.x, tpp.y, 2.8 * zoom, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#f8fafc';
          ctx.font = `600 ${Math.max(6, 7 * zoom)}px "JetBrains Mono", monospace`;
          ctx.textAlign = 'center';
          ctx.fillText(tp.label, tpp.x, tpp.y + 10 * zoom);
        });

        // Component Solder Pads on PCB Surface (ENIG Gold & Solder Fillets)
        components.forEach((comp) => {
          const cx3D = comp.rx + comp.w / 2;
          const cz3D = comp.ry + comp.h / 2;
          const hw = comp.w / 2;
          const hd = comp.h / 2;

          if (comp.type === 'qfp') {
            // 64 Gold Rectangular Pads radiating around 4 edges
            ctx.fillStyle = '#fbbf24';
            for (let side = 0; side < 4; side++) {
              for (let p = -hw + 6; p <= hw - 6; p += (hw * 2 - 12) / 15) {
                let px = 0, pz = 0;
                if (side === 0) { px = cx3D + p; pz = cz3D + hd + 3; }
                else if (side === 1) { px = cx3D + p; pz = cz3D - hd - 3; }
                else if (side === 2) { px = cx3D - hw - 3; pz = cz3D + p; }
                else if (side === 3) { px = cx3D + hw + 3; pz = cz3D + p; }
                const padPt = project3D(px, topY, pz);
                ctx.fillRect(padPt.x - 1.2 * zoom, padPt.y - 1.2 * zoom, 2.4 * zoom, 2.4 * zoom);
              }
            }
            // Silk box around QFP with pin 1 index dot
            const s1 = project3D(cx3D - hw - 5, topY, cz3D - hd - 5);
            const s2 = project3D(cx3D + hw + 5, topY, cz3D - hd - 5);
            const s3 = project3D(cx3D + hw + 5, topY, cz3D + hd + 5);
            const s4 = project3D(cx3D - hw - 5, topY, cz3D + hd + 5);
            ctx.strokeStyle = '#f8fafc';
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(s1.x + 4 * zoom, s1.y);
            ctx.lineTo(s2.x, s2.y);
            ctx.lineTo(s3.x, s3.y);
            ctx.lineTo(s4.x, s4.y);
            ctx.lineTo(s1.x, s1.y + 4 * zoom);
            ctx.stroke();
            // Pin 1 dot
            const p1Dot = project3D(cx3D - hw - 3, topY, cz3D - hd - 3);
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(p1Dot.x, p1Dot.y, 1.8 * zoom, 0, Math.PI * 2);
            ctx.fill();
          } else if (comp.type === 'bga') {
            // Gold BGA ball pads matrix
            ctx.fillStyle = '#d97706';
            for (let bx = -hw + 8; bx <= hw - 8; bx += 10) {
              for (let bz = -hd + 8; bz <= hd - 8; bz += 10) {
                const bPt = project3D(cx3D + bx, topY, cz3D + bz);
                ctx.beginPath();
                ctx.arc(bPt.x, bPt.y, 1.5 * zoom, 0, Math.PI * 2);
                ctx.fill();
              }
            }
          } else if (comp.type === 'conn') {
            // 4 heavy through-hole gold plated slot pads for USB-C mechanical anchor tabs
            const tabOffsets = [
              { x: cx3D - hw + 4, z: cz3D - hd + 4 },
              { x: cx3D + hw - 4, z: cz3D - hd + 4 },
              { x: cx3D - hw + 4, z: cz3D + hd - 4 },
              { x: cx3D + hw - 4, z: cz3D + hd - 4 }
            ];
            ctx.fillStyle = '#f59e0b';
            tabOffsets.forEach((to) => {
              const tp = project3D(to.x, topY, to.z);
              ctx.beginPath();
              ctx.arc(tp.x, tp.y, 3.2 * zoom, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#060a0e';
              ctx.beginPath();
              ctx.arc(tp.x, tp.y, 1.8 * zoom, 0, Math.PI * 2);
              ctx.fill();
              ctx.fillStyle = '#f59e0b';
            });
          } else if (comp.type === 'smd_cap' || comp.type === 'smd_res' || comp.type === 'smd_led') {
            // Two rectangular gold SMT solder pads
            const p1 = project3D(cx3D - hw - 2, topY, cz3D);
            const p2 = project3D(cx3D + hw + 2, topY, cz3D);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(p1.x - 2 * zoom, p1.y - 3 * zoom, 4 * zoom, 6 * zoom);
            ctx.fillRect(p2.x - 2 * zoom, p2.y - 3 * zoom, 4 * zoom, 6 * zoom);
          } else if (comp.type === 'sot') {
            // Wide thermal tab pad + 3 pin pads
            const tabP = project3D(cx3D, topY, cz3D - hd - 3);
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(tabP.x - 8 * zoom, tabP.y - 2 * zoom, 16 * zoom, 4 * zoom);
          } else if (comp.type === 'xtal') {
            // 4 corner pads
            const corners = [
              { x: cx3D - hw, z: cz3D - hd },
              { x: cx3D + hw, z: cz3D - hd },
              { x: cx3D - hw, z: cz3D + hd },
              { x: cx3D + hw, z: cz3D + hd }
            ];
            ctx.fillStyle = '#fbbf24';
            corners.forEach((c) => {
              const cp = project3D(c.x, topY, c.z);
              ctx.fillRect(cp.x - 2 * zoom, cp.y - 2 * zoom, 4 * zoom, 4 * zoom);
            });
          }
        });

        // 3. Render 3D Copper Traces on Top Solder Mask Plane with Solder Mask Relief
        traces.forEach((tr) => {
          const cFrom = components.find((c) => c.id === tr.from);
          const cTo = components.find((c) => c.id === tr.to);
          if (!cFrom || !cTo) return;

          const p1 = project3D(cFrom.rx + cFrom.w / 2, topY - 1, cFrom.ry + cFrom.h / 2);
          const p2 = project3D(cTo.rx + cTo.w / 2, topY - 1, cTo.ry + cTo.h / 2);

          const isSelected = selectedTrace?.id === tr.id || selectedNet === tr.net;

          // Solder mask copper relief under-sheen
          const midX = (cFrom.rx + cTo.rx) / 2;
          const pMid = project3D(midX, topY - 1, cFrom.ry + cFrom.h / 2);

          ctx.strokeStyle = isSelected ? '#00e5ff' : tr.color;
          ctx.lineWidth = (isSelected ? 3.2 : 2.0) * zoom;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(pMid.x, pMid.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();

          // 3D Animated Signal Photons
          if (signalsActive) {
            const photonPhase = (elapsed * 2.2 + tr.id.charCodeAt(tr.id.length - 1) * 0.3) % 1;
            const photonX = p1.x + (p2.x - p1.x) * photonPhase;
            const photonY = p1.y + (p2.y - p1.y) * photonPhase;

            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#00e5ff';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(photonX, photonY, 3.2 * zoom, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        });

        // 4. Render 3D Extruded Components
        // Sort components by 3D depth for painter's algorithm
        const sortedComps = [...components].map((comp) => {
          const center = project3D(comp.rx + comp.w / 2, topY, comp.ry + comp.h / 2);
          return { comp, center, depth: center.depth };
        });
        sortedComps.sort((a, b) => b.depth - a.depth);

        sortedComps.forEach(({ comp }) => {
          const h3D = (comp.height3D || 1.5) * 8; // Extrusion height
          const compTopY = topY - h3D;
          const compBotY = topY;
          const isSelected = selectedComp?.id === comp.id;

          const cx3D = comp.rx + comp.w / 2;
          const cz3D = comp.ry + comp.h / 2;
          const hw = comp.w / 2;
          const hd = comp.h / 2;

          // 8 Vertices of the Extruded Component Box
          const cv = [
            project3D(cx3D - hw, compTopY, cz3D - hd),
            project3D(cx3D + hw, compTopY, cz3D - hd),
            project3D(cx3D + hw, compTopY, cz3D + hd),
            project3D(cx3D - hw, compTopY, cz3D + hd),
            project3D(cx3D - hw, compBotY, cz3D - hd),
            project3D(cx3D + hw, compBotY, cz3D - hd),
            project3D(cx3D + hw, compBotY, cz3D + hd),
            project3D(cx3D - hw, compBotY, cz3D + hd)
          ];

          // Side Walls Shading
          ctx.fillStyle = comp.type === 'conn' ? '#94a3b8' : comp.type === 'bga' ? '#334155' : comp.type === 'smd_cap' ? '#8c6b4f' : '#1e2433';
          // Front Side
          ctx.beginPath();
          ctx.moveTo(cv[0].x, cv[0].y);
          ctx.lineTo(cv[1].x, cv[1].y);
          ctx.lineTo(cv[5].x, cv[5].y);
          ctx.lineTo(cv[4].x, cv[4].y);
          ctx.closePath();
          ctx.fill();
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Right Side
          ctx.beginPath();
          ctx.moveTo(cv[1].x, cv[1].y);
          ctx.lineTo(cv[2].x, cv[2].y);
          ctx.lineTo(cv[6].x, cv[6].y);
          ctx.lineTo(cv[5].x, cv[5].y);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Top Face
          if (comp.type === 'smd_led') {
            ctx.fillStyle = '#10b981'; // Luminous Emerald
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 12;
          } else if (comp.type === 'conn') {
            ctx.fillStyle = '#cbd5e1'; // Stainless Steel
          } else if (comp.type === 'xtal') {
            ctx.fillStyle = '#e2e8f0'; // Shiny Silver Can
          } else if (comp.type === 'smd_cap') {
            ctx.fillStyle = '#b48a60'; // Realistic tan ceramic MLCC
          } else if (comp.type === 'smd_res') {
            ctx.fillStyle = '#0f172a'; // Glossy black chip resistor
          } else if (comp.type === 'bga') {
            ctx.fillStyle = '#64748b'; // Heat spreader lid
          } else {
            ctx.fillStyle = isSelected ? '#2d3748' : '#1a202c'; // Molded Epoxy Package
          }

          ctx.beginPath();
          ctx.moveTo(cv[0].x, cv[0].y);
          ctx.lineTo(cv[1].x, cv[1].y);
          ctx.lineTo(cv[2].x, cv[2].y);
          ctx.lineTo(cv[3].x, cv[3].y);
          ctx.closePath();
          ctx.fill();
          ctx.shadowBlur = 0;

          ctx.strokeStyle = isSelected ? '#00e5ff' : '#475569';
          ctx.lineWidth = isSelected ? 2.0 : 1.0;
          ctx.stroke();

          // Realistic Gull-Wing Pins on QFP (STM32 on all 4 sides)
          if (comp.type === 'qfp') {
            ctx.fillStyle = '#e2e8f0'; // Tinned copper alloy pins
            const pinStep = (hw * 2 - 12) / 15;
            for (let p = -hw + 6; p <= hw - 6; p += pinStep) {
              // South pins
              const pTopS = project3D(cx3D + p, compBotY - 2, cz3D + hd);
              const pBotS = project3D(cx3D + p, compBotY + 1, cz3D + hd + 4);
              ctx.fillRect(pTopS.x - 1, pTopS.y, 2.2 * zoom, 4 * zoom);

              // North pins
              const pTopN = project3D(cx3D + p, compBotY - 2, cz3D - hd);
              const pBotN = project3D(cx3D + p, compBotY + 1, cz3D - hd - 4);
              ctx.fillRect(pTopN.x - 1, pTopN.y - 3 * zoom, 2.2 * zoom, 4 * zoom);
            }
          }

          // Ceramic Cap Silver End Terminals
          if (comp.type === 'smd_cap' || comp.type === 'smd_res') {
            ctx.fillStyle = '#e2e8f0'; // Shiny tinned solder cap
            const t1 = project3D(cx3D - hw, compTopY, cz3D);
            const t2 = project3D(cx3D + hw, compTopY, cz3D);
            ctx.fillRect(t1.x - 1, t1.y - 3 * zoom, 3 * zoom, 6 * zoom);
            ctx.fillRect(t2.x - 2 * zoom, t2.y - 3 * zoom, 3 * zoom, 6 * zoom);
          }

          // Top Face Laser Etched Markings / Silkscreen
          const labelPt = project3D(cx3D, compTopY, cz3D);
          if (comp.type === 'qfp') {
            ctx.fillStyle = '#cbd5e1';
            ctx.font = `700 ${Math.max(7, 8 * zoom)}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText('ARM®', labelPt.x, labelPt.y - 4);
            ctx.fillText('STM32F4', labelPt.x, labelPt.y + 6);
          } else if (comp.type === 'bga') {
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 ${Math.max(7, 8.5 * zoom)}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText('XILINX', labelPt.x, labelPt.y - 4);
            ctx.font = `600 ${Math.max(6, 7 * zoom)}px "JetBrains Mono", monospace`;
            ctx.fillText('ARTIX-7', labelPt.x, labelPt.y + 6);
          } else if (comp.type === 'conn') {
            ctx.fillStyle = '#0f172a';
            ctx.font = `700 ${Math.max(7, 8 * zoom)}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText('USB-C 3.2', labelPt.x, labelPt.y + 3);
          } else if (comp.type === 'xtal') {
            ctx.fillStyle = '#475569';
            ctx.font = `700 ${Math.max(6, 7 * zoom)}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText('25.0MHz', labelPt.x, labelPt.y + 3);
          } else {
            ctx.fillStyle = '#f8fafc';
            ctx.font = `700 ${Math.max(7, 8.5 * zoom)}px "JetBrains Mono", monospace`;
            ctx.textAlign = 'center';
            ctx.fillText(comp.id, labelPt.x, labelPt.y + 3);
          }
        });

        // 3D Viewport HUD Metadata
        ctx.textAlign = 'left';
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '700 11px "JetBrains Mono", monospace';
        ctx.fillText(
          `3D ORBIT: ${rotation3D.x.toFixed(0)}° / ${rotation3D.y.toFixed(0)}° | ZOOM: ${(zoom * 100).toFixed(0)}% | COMPONENTS: ${components.length}`,
          18,
          24
        );
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 10px "JetBrains Mono", monospace';
        ctx.fillText(
          `FR4 SUBSTRATE: 115×75×1.6mm | TOP LAYER: ${activeLayer} | SOLDER MASK: ${mask.name}`,
          18,
          38
        );

        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      // ==========================================
      // 2D PRECISION CAD INTERACTIVE EDITOR
      // ==========================================
      const baseScale = Math.min(1.0, Math.max(0.65, (width - 32) / 460)) * zoom;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(baseScale, baseScale);

      const pcbW = 440;
      const pcbH = 250;
      const pcbX = -pcbW / 2;
      const pcbY = -pcbH / 2;

      // 1. Board Drop Shadow
      ctx.fillStyle = '#05070a';
      ctx.beginPath();
      ctx.roundRect(pcbX + 8, pcbY + 12, pcbW, pcbH, 10);
      ctx.fill();

      // 2. PCB Solder Mask
      ctx.fillStyle = mask.bg;
      ctx.beginPath();
      ctx.roundRect(pcbX, pcbY, pcbW, pcbH, 8);
      ctx.fill();

      // Board Edge Chamfer
      ctx.strokeStyle = mask.border;
      ctx.lineWidth = 2.2;
      ctx.stroke();

      // Realistic Underlying Copper Ground Pour Sheen
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.05)';
      ctx.lineWidth = 1;
      for (let gx = pcbX + 10; gx <= pcbX + pcbW - 10; gx += 16) {
        ctx.beginPath();
        ctx.moveTo(gx, pcbY + 10);
        ctx.lineTo(gx + 24, pcbY + pcbH - 10);
        ctx.stroke();
      }

      // Mechanical Keepout Route Line (Yellow Dashed)
      ctx.save();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(pcbX + 4, pcbY + 4, pcbW - 8, pcbH - 8);
      ctx.restore();

      // 4 M3 Plated Standoff Mounting Holes with Radial Starburst Teeth
      const standoff2D = [
        { x: pcbX + 22, y: pcbY + 22 },
        { x: pcbX + pcbW - 22, y: pcbY + 22 },
        { x: pcbX + 22, y: pcbY + pcbH - 22 },
        { x: pcbX + pcbW - 22, y: pcbY + pcbH - 22 }
      ];
      standoff2D.forEach((sh) => {
        // 8 gold contact starburst pads
        ctx.fillStyle = '#f59e0b';
        for (let a = 0; a < 8; a++) {
          const ang = (a * Math.PI) / 4;
          ctx.beginPath();
          ctx.arc(sh.x + Math.cos(ang) * 9, sh.y + Math.sin(ang) * 9, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
        // Gold annular ring
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 7.5, 0, Math.PI * 2);
        ctx.fill();
        // Center drill barrel
        ctx.fillStyle = '#05070a';
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 4.2, 0, Math.PI * 2);
        ctx.fill();
        // Silkscreen circle & crosshairs
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(sh.x, sh.y, 11, 0, Math.PI * 2);
        ctx.moveTo(sh.x - 13, sh.y);
        ctx.lineTo(sh.x + 13, sh.y);
        ctx.moveTo(sh.x, sh.y - 13);
        ctx.lineTo(sh.x, sh.y + 13);
        ctx.stroke();
      });

      // Perimeter Ground Stitching Vias Array (EMI Shielding)
      ctx.fillStyle = '#f59e0b';
      for (let vx = pcbX + 42; vx <= pcbX + pcbW - 42; vx += 24) {
        // Top edge vias
        ctx.beginPath();
        ctx.arc(vx, pcbY + 12, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Bottom edge vias
        ctx.beginPath();
        ctx.arc(vx, pcbY + pcbH - 12, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let vy = pcbY + 38; vy <= pcbY + pcbH - 38; vy += 20) {
        // Left edge vias
        ctx.beginPath();
        ctx.arc(pcbX + 12, vy, 2.5, 0, Math.PI * 2);
        ctx.fill();
        // Right edge vias
        ctx.beginPath();
        ctx.arc(pcbX + pcbW - 12, vy, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
      // Via center drill holes
      ctx.fillStyle = '#05070a';
      for (let vx = pcbX + 42; vx <= pcbX + pcbW - 42; vx += 24) {
        ctx.beginPath();
        ctx.arc(vx, pcbY + 12, 1.2, 0, Math.PI * 2);
        ctx.arc(vx, pcbY + pcbH - 12, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let vy = pcbY + 38; vy <= pcbY + pcbH - 38; vy += 20) {
        ctx.beginPath();
        ctx.arc(pcbX + 12, vy, 1.2, 0, Math.PI * 2);
        ctx.arc(pcbX + pcbW - 12, vy, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top Silkscreen Legend & Annotations (Top Overlay)
      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 8.5px "JetBrains Mono", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('ROBOCON 2026 // MCAD-ECAD CO-DESIGN LAB', pcbX + 42, pcbY + 28);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 7px "JetBrains Mono", monospace';
      ctx.fillText('6-LAYER FR4 | IMPEDANCE 50Ω SE / 100Ω DIFF | REV 2.4', pcbX + 42, pcbY + 38);

      // Hardware Test Points with probe pads
      const testPoints2D = [
        { label: 'TP1 [3V3]', x: pcbX + 46, y: pcbY + pcbH - 28 },
        { label: 'TP2 [GND]', x: pcbX + 82, y: pcbY + pcbH - 28 },
        { label: 'TP3 [CLK]', x: pcbX + 118, y: pcbY + pcbH - 28 },
        { label: 'TP4 [USB]', x: pcbX + 154, y: pcbY + pcbH - 28 }
      ];
      testPoints2D.forEach((tp) => {
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 7px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(tp.label, tp.x, tp.y + 9);
      });

      // CAD Snap Grid Dots
      ctx.fillStyle = 'rgba(255, 255, 255, 0.10)';
      for (let x = pcbX + 16; x < pcbX + pcbW; x += 16) {
        for (let y = pcbY + 16; y < pcbY + pcbH; y += 16) {
          ctx.fillRect(x - 0.5, y - 0.5, 1.2, 1.2);
        }
      }

      // Optical Fiducials in Board Corners
      const fiducials = [
        { x: pcbX + 18, y: pcbY + 48 },
        { x: pcbX + pcbW - 18, y: pcbY + 48 },
        { x: pcbX + 18, y: pcbY + pcbH - 42 }
      ];
      fiducials.forEach((fid) => {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(fid.x, fid.y, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#f8fafc';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.arc(fid.x, fid.y, 6.0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // 3. Render 2D Copper Traces
      traces.forEach((tr) => {
        const cFrom = components.find((c) => c.id === tr.from);
        const cTo = components.find((c) => c.id === tr.to);
        if (!cFrom || !cTo) return;

        const isTraceSelected = selectedTrace?.id === tr.id || selectedNet === tr.net;
        const isLayerActive = tr.layer === activeLayer;

        let alpha = 1.0;
        if (isolateLayer && !isLayerActive) alpha = 0.15;

        ctx.save();
        ctx.globalAlpha = alpha;

        const x1 = cFrom.rx + cFrom.w / 2;
        const y1 = cFrom.ry + cFrom.h / 2;
        const x2 = cTo.rx + cTo.w / 2;
        const y2 = cTo.ry + cTo.h / 2;

        const midX = (x1 + x2) / 2;

        ctx.strokeStyle = isTraceSelected ? '#00e5ff' : tr.color;
        ctx.lineWidth = (isTraceSelected ? 3.6 : tr.width) * (activeLayer === tr.layer ? 1.0 : 0.85);
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(midX, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();

        // Animated Signal Photon Wavefront
        if (signalsActive) {
          const photonPhase = (elapsed * 2.5 + tr.id.charCodeAt(tr.id.length - 1) * 0.3) % 1;
          let px = x1 + (x2 - x1) * photonPhase;
          let py = y1 + (y2 - y1) * photonPhase;

          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00e5ff';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(px, py, 3.2, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }

        ctx.restore();
      });

      // 4. Interactive In-Progress Routing Flightline Wire
      if (activeTool === 'route' && routingSourceId) {
        const rComp = components.find((c) => c.id === routingSourceId);
        if (rComp) {
          const sx = rComp.rx + rComp.w / 2;
          const sy = rComp.ry + rComp.h / 2;

          ctx.save();
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 2.0;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(mouseBoardPos.x, mouseBoardPos.y);
          ctx.stroke();
          ctx.restore();

          // Destination crosshair target
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(mouseBoardPos.x, mouseBoardPos.y, 8, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      // 5. Render 2D Components with Realistic SMT Pads & Silk Outlines
      components.forEach((comp) => {
        const isSelected = selectedComp?.id === comp.id;

        // Render SMT Solder Pads on PCB Surface
        if (comp.type === 'qfp') {
          // 64 Gold Gull-wing landing pads
          ctx.fillStyle = '#fbbf24';
          const pinStep = (comp.w - 12) / 15;
          for (let p = 6; p <= comp.w - 6; p += pinStep) {
            ctx.fillRect(comp.rx + p - 1, comp.ry - 5, 2, 5); // North
            ctx.fillRect(comp.rx + p - 1, comp.ry + comp.h, 2, 5); // South
            ctx.fillRect(comp.rx - 5, comp.ry + p - 1, 5, 2); // West
            ctx.fillRect(comp.rx + comp.w, comp.ry + p - 1, 5, 2); // East
          }
          // White silkscreen outline box with Pin 1 chamfer
          ctx.strokeStyle = '#f8fafc';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(comp.rx - 6 + 4, comp.ry - 6);
          ctx.lineTo(comp.rx + comp.w + 6, comp.ry - 6);
          ctx.lineTo(comp.rx + comp.w + 6, comp.ry + comp.h + 6);
          ctx.lineTo(comp.rx - 6, comp.ry + comp.h + 6);
          ctx.lineTo(comp.rx - 6, comp.ry - 6 + 4);
          ctx.closePath();
          ctx.stroke();
        } else if (comp.type === 'bga') {
          // Gold BGA balls array
          ctx.fillStyle = '#d97706';
          for (let bx = 6; bx <= comp.w - 6; bx += 8) {
            for (let by = 6; by <= comp.h - 6; by += 8) {
              ctx.beginPath();
              ctx.arc(comp.rx + bx, comp.ry + by, 1.4, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        } else if (comp.type === 'conn') {
          // 4 gold plated through-hole retention slots
          ctx.fillStyle = '#f59e0b';
          const slots = [
            { x: comp.rx + 3, y: comp.ry + 3 },
            { x: comp.rx + comp.w - 3, y: comp.ry + 3 },
            { x: comp.rx + 3, y: comp.ry + comp.h - 3 },
            { x: comp.rx + comp.w - 3, y: comp.ry + comp.h - 3 }
          ];
          slots.forEach((sl) => {
            ctx.beginPath();
            ctx.arc(sl.x, sl.y, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#060a0e';
            ctx.beginPath();
            ctx.arc(sl.x, sl.y, 1.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#f59e0b';
          });
        } else if (comp.type === 'smd_cap' || comp.type === 'smd_res' || comp.type === 'smd_led') {
          ctx.fillStyle = '#f59e0b';
          ctx.fillRect(comp.rx - 3, comp.ry, 3, comp.h);
          ctx.fillRect(comp.rx + comp.w, comp.ry, 3, comp.h);
        }

        // Selection Highlight
        if (isSelected) {
          ctx.strokeStyle = '#00e5ff';
          ctx.lineWidth = 2;
          ctx.setLineDash([4, 4]);
          ctx.strokeRect(comp.rx - 7, comp.ry - 7, comp.w + 14, comp.h + 14);
          ctx.setLineDash([]);
        }

        // Component Body with Realistic Colors
        if (comp.type === 'smd_led') {
          ctx.fillStyle = '#10b981';
          ctx.shadowColor = '#10b981';
          ctx.shadowBlur = 8;
        } else if (comp.type === 'conn') {
          ctx.fillStyle = '#94a3b8';
        } else if (comp.type === 'xtal') {
          ctx.fillStyle = '#cbd5e1';
        } else if (comp.type === 'smd_cap') {
          ctx.fillStyle = '#b48a60'; // Realistic tan ceramic
        } else if (comp.type === 'smd_res') {
          ctx.fillStyle = '#0f172a'; // Glossy black resistor
        } else if (comp.type === 'bga') {
          ctx.fillStyle = '#334155';
        } else {
          ctx.fillStyle = '#1e293b';
        }

        ctx.beginPath();
        ctx.roundRect(comp.rx, comp.ry, comp.w, comp.h, 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.strokeStyle = isSelected ? '#00e5ff' : '#475569';
        ctx.lineWidth = 1.0;
        ctx.stroke();

        // Silver End Caps for passives
        if (comp.type === 'smd_cap' || comp.type === 'smd_res') {
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(comp.rx, comp.ry, 2.5, comp.h);
          ctx.fillRect(comp.rx + comp.w - 2.5, comp.ry, 2.5, comp.h);
        }

        // Pin 1 Index Dot
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.arc(comp.rx + 5, comp.ry + 5, 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Silkscreen Text
        ctx.fillStyle = comp.type === 'conn' || comp.type === 'xtal' ? '#0f172a' : '#f8fafc';
        ctx.font = '700 9px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(comp.id, comp.rx + comp.w / 2, comp.ry + comp.h / 2 + 3);
      });

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [components, traces, activeLayer, activeTool, solderMask, viewMode, zoom, panOffset, selectedComp, selectedTrace, selectedNet, routingSourceId, mouseBoardPos, isolateLayer, signalsActive, rotation3D, autoRotate3D, isDragging]);

  // Pointer Down (Mouse & Touch)
  const handlePointerDown = (clientX, clientY, e) => {
    setLastMousePos({ x: clientX, y: clientY });

    if (viewMode === '3D') {
      setIsDragging(true);
      return;
    }

    if (activeTool === 'pan' || e?.button === 1 || e?.altKey) {
      setIsPanning(true);
      setPanStart({ x: clientX - panOffset.x, y: clientY - panOffset.y });
      return;
    }

    const coords = getBoardCoords(clientX, clientY);
    if (!coords) return;

    // Check Component Hit
    const clickedComp = [...components].reverse().find((c) => {
      return coords.x >= c.rx && coords.x <= c.rx + c.w && coords.y >= c.ry && coords.y <= c.ry + c.h;
    });

    if (activeTool === 'select') {
      if (clickedComp) {
        setSelectedComp(clickedComp);
        setSelectedTrace(null);
        setIsDragging(true);
        setDraggedId(clickedComp.id);
        setDragOffset({ x: coords.x - clickedComp.rx, y: coords.y - clickedComp.ry });
        setStatusText(`Selected Footprint [${clickedComp.id}] (${clickedComp.name}) • Drag to reposition with 4px grid snap`);
      } else {
        // Check Trace Hit
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
          setStatusText(`Selected Copper Net [${clickedTrace.net}] (${clickedTrace.from} ➔ ${clickedTrace.to})`);
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
          // Connect routingSourceId to clickedComp.id
          connectComponents(routingSourceId, clickedComp.id);
          setRoutingSourceId(null);
        }
      } else {
        setRoutingSourceId(null);
        setStatusText('Routing cancelled • Click component pin to start');
      }
    }
  };

  const handlePointerMove = (clientX, clientY) => {
    if (viewMode === '3D') {
      if (isDragging) {
        const dx = clientX - lastMousePos.x;
        const dy = clientY - lastMousePos.y;
        setRotation3D((prev) => ({
          x: Math.max(-85, Math.min(85, prev.x + dy * 0.45)),
          y: prev.y + dx * 0.45
        }));
        setLastMousePos({ x: clientX, y: clientY });
      }
      return;
    }

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

      // 4px CAD grid snap
      const snapRx = Math.round(rawRx / 4) * 4;
      const snapRy = Math.round(rawRy / 4) * 4;

      // Clamp inside board boundaries
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

  // Add Component from Catalog (Fully Responsive in both 2D and 3D)
  const handleAddComponent = (type) => {
    const count = components.length + 1;
    let nextId = '';
    let newComp = null;

    // Spread new components around open locations
    const offsetX = ((count * 45) % 320) - 160;
    const offsetY = ((count * 35) % 160) - 80;

    if (type === 'cap') {
      nextId = `C${count}`;
      newComp = {
        id: nextId,
        name: '0402 100nF Cap',
        desc: 'SMD MLCC Bypass',
        package: '0402',
        rx: offsetX,
        ry: offsetY,
        w: 16,
        h: 10,
        rot: 0,
        height3D: 0.8,
        pins: 2,
        type: 'smd_cap',
        silkscreen: nextId,
        netAssignments: ['PWR_3V3']
      };
    } else if (type === 'led') {
      nextId = `D${count}`;
      newComp = {
        id: nextId,
        name: '0805 Status LED',
        desc: 'Emerald Indicating Diode',
        package: '0805',
        rx: offsetX,
        ry: offsetY,
        w: 18,
        h: 11,
        rot: 0,
        height3D: 0.9,
        pins: 2,
        type: 'smd_led',
        silkscreen: nextId,
        netAssignments: ['PWR_3V3']
      };
    } else if (type === 'res') {
      nextId = `R${count}`;
      newComp = {
        id: nextId,
        name: '0603 50Ω Resistor',
        desc: 'Thick Film Terminator',
        package: '0603',
        rx: offsetX,
        ry: offsetY,
        w: 18,
        h: 10,
        rot: 0,
        height3D: 0.8,
        pins: 2,
        type: 'smd_res',
        silkscreen: nextId,
        netAssignments: ['HS_BUS']
      };
    } else if (type === 'xtal') {
      nextId = `Y${count}`;
      newComp = {
        id: nextId,
        name: '25MHz TCXO Crystal',
        desc: 'Precision Oscillator',
        package: 'SMD-3225',
        rx: offsetX,
        ry: offsetY,
        w: 24,
        h: 18,
        rot: 0,
        height3D: 1.2,
        pins: 4,
        type: 'xtal',
        silkscreen: nextId,
        netAssignments: ['CLK_25M']
      };
    } else if (type === 'mcu') {
      nextId = `U${count}`;
      newComp = {
        id: nextId,
        name: 'STM32F407 MCU',
        desc: '168MHz ARM Cortex-M4',
        package: 'LQFP-64',
        rx: offsetX,
        ry: offsetY,
        w: 68,
        h: 68,
        rot: 0,
        height3D: 2.2,
        pins: 64,
        type: 'qfp',
        silkscreen: 'STM32F4',
        netAssignments: ['HS_BUS', 'PWR_3V3', 'GND']
      };
    } else if (type === 'conn') {
      nextId = `J${count}`;
      newComp = {
        id: nextId,
        name: 'USB-C Receptacle',
        desc: '24-Pin 10Gbps Connector',
        package: 'USB-C-24P',
        rx: offsetX,
        ry: offsetY,
        w: 42,
        h: 36,
        rot: 0,
        height3D: 3.6,
        pins: 24,
        type: 'conn',
        silkscreen: 'USB-C',
        netAssignments: ['USB_DP', 'VBUS_5V', 'GND']
      };
    }

    if (newComp) {
      setComponents((prev) => [...prev, newComp]);
      setSelectedComp(newComp);
      setStatusText(`✓ Added ${newComp.id} (${newComp.name}) to PCB • Ready to wire & position`);
    }
  };

  // Connect Two Components Responsively
  const connectComponents = (fromId, toId) => {
    if (!fromId || !toId || fromId === toId) return;

    // Check if trace already exists
    const exists = traces.some(
      (t) => (t.from === fromId && t.to === toId) || (t.from === toId && t.to === fromId)
    );
    if (exists) {
      setStatusText(`Net already exists between ${fromId} and ${toId}.`);
      return;
    }

    const netName = `NET_${fromId}_${toId}`;
    const newTrace = {
      id: `TR_${Date.now()}`,
      net: netName,
      from: fromId,
      to: toId,
      layer: activeLayer,
      color: activeLayer === 'L1_TOP' ? '#ef4444' : activeLayer === 'L2_GND' ? '#06b6d4' : '#f59e0b',
      width: 2.2,
      signalType: 'diff',
      voltage: '3.3V',
      frequency: '100 MHz',
      impedance: '50.0 Ω'
    };

    setTraces((prev) => [...prev, newTrace]);
    setSelectedTrace(newTrace);
    setSelectedNet(netName);
    setStatusText(`✓ Connected Net [${fromId} ➔ ${toId}] on ${activeLayer} • Signals Active!`);
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
    setStatusText('PCB Layout reset to default mechatronics configuration.');
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
            Interactive ECAD engine: Switch between 2D high-speed layout & true 3D perspective PCB inspection with 360° orbit, component placement, interactive wire routing, and live oscilloscope signal waveforms.
          </p>
        </div>

        <div className="studio-actions-wrap" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={handleRunDRC}
            className="btn-secondary-pro"
            style={{ padding: '8px 14px', fontSize: '0.82rem' }}
          >
            <ShieldCheck size={14} color={drcPassed ? '#10b981' : '#ef4444'} />
            <span>{drcPassed ? 'Run DRC Check' : 'Inspect Violations'}</span>
          </button>

          <button
            onClick={handlePushToMCAD}
            className="btn-primary-lead"
            style={{ padding: '8px 18px', fontSize: '0.84rem' }}
          >
            <Zap size={14} />
            <span>Push to SolidWorks MCAD</span>
          </button>
        </div>
      </div>

      {/* Main Studio 3-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr 310px',
          gap: '16px',
          alignItems: 'stretch'
        }}
        className="studio-grid-mobile"
      >
        {/* Left Column: Layer Stack Manager & Color Finish */}
        <div className="pro-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              PCB LAYER STACK
            </span>
            <span className="font-mono" style={{ fontSize: '0.66rem', color: '#0284c7', fontWeight: 700 }}>
              4-LAYER HIGH-SPEED
            </span>
          </div>

          {/* Layer Selector */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem' }}>
            {[
              { id: 'L1_TOP', name: 'L1 Top Layer (Signals)', color: '#ef4444', desc: '0.035mm Cu • Microstrip' },
              { id: 'L2_GND', name: 'L2 Ground Plane (Ref)', color: '#06b6d4', desc: '0.035mm Cu • Solid Ref' },
              { id: 'L3_PWR', name: 'L3 Power Plane (3.3V/5V)', color: '#f59e0b', desc: '0.070mm Cu • Low Drop' },
              { id: 'L4_BOT', name: 'L4 Bottom Layer (Signals)', color: '#3b82f6', desc: '0.035mm Cu • Shielded' }
            ].map((layer) => {
              const isSelected = activeLayer === layer.id;
              return (
                <div
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: isSelected ? `1.5px solid ${layer.color}` : '1px solid var(--border-subtle)',
                    background: isSelected ? '#f8fafc' : '#ffffff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: layer.color }} />
                    <span style={{ fontWeight: isSelected ? 700 : 500, color: isSelected ? '#0f172a' : '#475569', fontSize: '0.75rem' }}>
                      {layer.name}
                    </span>
                  </div>
                  <span className="font-mono" style={{ fontSize: '0.64rem', color: '#64748b' }}>
                    {isSelected ? 'ACTIVE' : ''}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Solder Mask Finish */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <label className="form-label" style={{ fontSize: '0.74rem' }}>Solder Mask Color</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px', marginTop: '6px' }}>
              {Object.entries(SOLDER_MASKS).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => setSolderMask(k)}
                  style={{
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: solderMask === k ? '2px solid #0284c7' : '1px solid var(--border-subtle)',
                    background: v.bg,
                    color: '#ffffff',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: v.border }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v.name.split(' ')[1]}</span>
                </button>
              ))}
            </div>

            <div style={{ marginTop: '14px', display: 'flex', gap: '6px' }}>
              <button
                onClick={handleResetBoard}
                className="btn-secondary-pro"
                style={{ width: '100%', padding: '6px', fontSize: '0.74rem', justifyContent: 'center' }}
              >
                <RefreshCw size={12} />
                <span>Reset Board Layout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Column: Interactive 2D/3D PCB Canvas Viewport */}
        <div
          className="pro-panel"
          style={{
            minHeight: '560px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* Top Viewport Toolbar */}
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
            {/* View Mode & 2D Tools */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              {/* 2D / 3D Toggle */}
              <div style={{ display: 'flex', background: '#e2e8f0', padding: '2px', borderRadius: '6px', gap: '2px' }}>
                <button
                  onClick={() => setViewMode('2D')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: viewMode === '2D' ? '#ffffff' : 'transparent',
                    color: viewMode === '2D' ? '#0f172a' : '#64748b',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  2D CAD Layout
                </button>
                <button
                  onClick={() => setViewMode('3D')}
                  style={{
                    padding: '4px 10px',
                    borderRadius: '4px',
                    border: 'none',
                    background: viewMode === '3D' ? '#0284c7' : 'transparent',
                    color: viewMode === '3D' ? '#ffffff' : '#64748b',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Box size={12} />
                  <span>3D Realistic Board</span>
                </button>
              </div>

              {/* 2D Tools (Select vs Route) */}
              {viewMode === '2D' && (
                <div style={{ display: 'flex', gap: '4px', marginLeft: '6px' }}>
                  <button
                    onClick={() => setActiveTool('select')}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      border: activeTool === 'select' ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
                      background: activeTool === 'select' ? '#e0f2fe' : '#ffffff',
                      color: activeTool === 'select' ? '#0284c7' : '#64748b',
                      cursor: 'pointer'
                    }}
                  >
                    Select / Move
                  </button>
                  <button
                    onClick={() => {
                      setActiveTool('route');
                      setRoutingSourceId(null);
                      setStatusText('⚡ Interactive Route Net Active: Click source component pin');
                    }}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      border: activeTool === 'route' ? '1px solid #ea580c' : '1px solid var(--border-subtle)',
                      background: activeTool === 'route' ? '#fff2ed' : '#ffffff',
                      color: activeTool === 'route' ? '#ea580c' : '#64748b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Zap size={11} />
                    <span>Route Net</span>
                  </button>
                </div>
              )}

              {/* 3D Camera Controls */}
              {viewMode === '3D' && (
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginLeft: '6px' }}>
                  <button
                    onClick={() => setAutoRotate3D(!autoRotate3D)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      background: autoRotate3D ? '#ecfdf5' : '#ffffff',
                      border: autoRotate3D ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                      color: autoRotate3D ? '#059669' : '#64748b',
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Toggle 360° Turntable Auto-Orbit"
                  >
                    {autoRotate3D ? <Pause size={10} /> : <Play size={10} />}
                    <span>Auto-Orbit</span>
                  </button>

                  <button
                    onClick={() => set3DPreset('iso')}
                    style={{ padding: '3px 6px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.68rem', cursor: 'pointer' }}
                  >
                    ISO
                  </button>
                  <button
                    onClick={() => set3DPreset('top')}
                    style={{ padding: '3px 6px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.68rem', cursor: 'pointer' }}
                  >
                    TOP
                  </button>
                  <button
                    onClick={() => set3DPreset('front')}
                    style={{ padding: '3px 6px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.68rem', cursor: 'pointer' }}
                  >
                    EDGE
                  </button>
                </div>
              )}
            </div>

            {/* Right Controls: Signals & Zoom */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
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
              >
                {signalsActive ? <Play size={10} fill="#059669" /> : <Pause size={10} />}
                <span>{signalsActive ? 'Signals Live' : 'Signals Off'}</span>
              </button>

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
                >
                  <Maximize2 size={12} color="#475569" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Component Palette Bar (Add Components in 1-Click) */}
          <div style={{ padding: '6px 12px', background: '#ffffff', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '6px', alignItems: 'center', fontSize: '0.7rem', flexWrap: 'wrap' }}>
            <span className="font-mono" style={{ color: '#0284c7', fontWeight: 700 }}>+ ADD FOOTPRINT:</span>
            <button
              onClick={() => handleAddComponent('cap')}
              style={{ padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: '#0f172a' }}
            >
              + 0402 Cap
            </button>
            <button
              onClick={() => handleAddComponent('res')}
              style={{ padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: '#0f172a' }}
            >
              + 0603 Res
            </button>
            <button
              onClick={() => handleAddComponent('led')}
              style={{ padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: '#059669' }}
            >
              + 0805 LED
            </button>
            <button
              onClick={() => handleAddComponent('xtal')}
              style={{ padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: '#b45309' }}
            >
              + 25MHz TCXO
            </button>
            <button
              onClick={() => handleAddComponent('mcu')}
              style={{ padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: '#0284c7', fontWeight: 600 }}
            >
              + STM32 MCU
            </button>
            <button
              onClick={() => handleAddComponent('conn')}
              style={{ padding: '3px 8px', borderRadius: '4px', background: '#f8fafc', border: '1px solid var(--border-subtle)', cursor: 'pointer', color: '#475569', fontWeight: 600 }}
            >
              + USB-C Port
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
              cursor: viewMode === '3D' ? (isDragging ? 'grabbing' : 'grab') : activeTool === 'route' ? 'crosshair' : isDragging ? 'grabbing' : 'grab',
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
                PARTS: {components.length} | NETS: {traces.length} | ZOOM: {(zoom * 100).toFixed(0)}%
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
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
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

          {/* Responsive Connect / Inspector Panel */}
          {selectedComp ? (
            <div style={{ padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--border-subtle)', fontSize: '0.74rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <strong style={{ color: '#0f172a', fontSize: '0.88rem' }}>{selectedComp.id}</strong>
                <span className="font-mono" style={{ color: '#b45309', fontWeight: 700 }}>{selectedComp.package}</span>
              </div>
              <div style={{ color: '#0284c7', fontSize: '0.72rem', marginBottom: '8px' }}>{selectedComp.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', color: '#64748b', fontSize: '0.7rem', marginBottom: '10px' }}>
                <div>POS: <strong className="font-mono" style={{ color: '#0f172a' }}>{selectedComp.rx}, {selectedComp.ry}</strong></div>
                <div>3D HEIGHT: <strong className="font-mono" style={{ color: '#0f172a' }}>{selectedComp.height3D}mm</strong></div>
              </div>

              {/* Responsive Direct Wire / Connection Dropdown */}
              <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>
                  CONNECT TO NET:
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <select
                    value={targetConnectId}
                    onChange={(e) => setTargetConnectId(e.target.value)}
                    style={{ flex: 1, fontSize: '0.72rem', padding: '4px 6px', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}
                  >
                    <option value="">Select Target Component...</option>
                    {components
                      .filter((c) => c.id !== selectedComp.id)
                      .map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.id} ({c.name})
                        </option>
                      ))}
                  </select>
                  <button
                    onClick={() => {
                      if (targetConnectId) {
                        connectComponents(selectedComp.id, targetConnectId);
                        setTargetConnectId('');
                      }
                    }}
                    disabled={!targetConnectId}
                    className="btn-primary-lead"
                    style={{ padding: '4px 10px', fontSize: '0.7rem', borderRadius: '4px', opacity: targetConnectId ? 1 : 0.5 }}
                  >
                    <Link size={12} />
                    <span>Connect</span>
                  </button>
                </div>
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
              Select any component to wire it, move it, or inspect its real-time electrical signal waveform.
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
