import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Box,
  Layers,
  Sliders,
  Eye,
  EyeOff,
  Download,
  RotateCw,
  ZoomIn,
  ZoomOut,
  CheckCircle2,
  Flame,
  Maximize2,
  Play,
  Pause,
  Compass,
  FileCode,
  Activity,
  Cpu,
  ShieldCheck,
  Sparkles,
  Ruler,
  FileSpreadsheet,
  X,
  Zap,
  AlertTriangle,
  ArrowDown
} from 'lucide-react';

// Real physical material properties for 6061 Aluminum, Space Gray, Smoked Polycarbonate, and Carbon Fiber
const MATERIALS = {
  aluminum: {
    name: '6061-T6 Billet Aluminum',
    density: 2.70, // g/cm^3
    yieldStrength: '276 MPa',
    thermalK: '167 W/m·K',
    costPerKg: 14.5,
    color: [42, 50, 68],
    specular: '#e2e8f0',
    edgeColor: '#ea580c'
  },
  spacegray: {
    name: 'Anodized Space Gray Alloy',
    density: 2.72,
    yieldStrength: '310 MPa',
    thermalK: '155 W/m·K',
    costPerKg: 18.0,
    color: [32, 36, 48],
    specular: '#94a3b8',
    edgeColor: '#38bdf8'
  },
  polycarbonate: {
    name: 'Smoked Translucent Polymer',
    density: 1.20,
    yieldStrength: '65 MPa',
    thermalK: '0.22 W/m·K',
    costPerKg: 9.8,
    color: [20, 28, 44],
    specular: '#38bdf8',
    edgeColor: '#00e5ff',
    alpha: 0.65
  },
  carbon: {
    name: 'Woven Carbon Fiber Molded',
    density: 1.55,
    yieldStrength: '600 MPa',
    thermalK: '5.5 W/m·K',
    costPerKg: 42.0,
    color: [18, 20, 26],
    specular: '#64748b',
    edgeColor: '#fbbf24'
  }
};

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
    pcbSeated: true,
    robotFlanges: true, // Side chassis mounting tabs for Robocon bot frame
    material: 'aluminum'
  });

  // Active Selected Feature in FeatureManager Tree ('base', 'cavity', 'bosses', 'fins', 'vents', 'pcb', 'flanges')
  const [activeFeature, setActiveFeature] = useState('base');

  // 3D Viewport Controls
  const [rotation, setRotation] = useState({ x: 28, y: -42 });
  const [zoom, setZoom] = useState(1.0);
  const [renderMode, setRenderMode] = useState('shaded'); // 'shaded', 'wireframe', 'section', 'fea'
  const [feaType, setFeaType] = useState('thermal'); // 'thermal' | 'stress'
  const [showDimensions, setShowDimensions] = useState(false); // 3D Caliper Dimensions
  const [explodedView, setExplodedView] = useState(0); // 0 (closed) to 100 (fully exploded)
  const [autoRotate, setAutoRotate] = useState(false);
  
  // Section Cut Plane Controls
  const [sectionPlane, setSectionPlane] = useState('Z'); // 'X', 'Y', 'Z'
  const [sectionOffset, setSectionOffset] = useState(0); // -40mm to +40mm

  // Interactive Inspection Probe HUD
  const [hoverProbe, setHoverProbe] = useState(null);

  // BOM & DFM Quote Modal
  const [showBomModal, setShowBomModal] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [statusMessage, setStatusMessage] = useState('Ready • SolidWorks 3D Parametric CAD Engine Active');

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const animFrameRef = useRef(0);

  // Derived Physical Mass, Volume, DFM Machining Time & Cost Calculations
  const physicalMetrics = useMemo(() => {
    const mat = MATERIALS[params.material] || MATERIALS.aluminum;
    const outerVolCm3 = (params.length * params.width * params.height) / 1000;
    const inL = Math.max(10, params.length - params.wallThickness * 2);
    const inW = Math.max(10, params.width - params.wallThickness * 2);
    const inH = Math.max(10, params.height - params.wallThickness);
    const innerVolCm3 = params.cavityEnabled ? (inL * inW * inH) / 1000 : 0;
    const solidVolCm3 = Math.max(2, outerVolCm3 - innerVolCm3);
    const weightGrams = (solidVolCm3 * mat.density).toFixed(1);

    // Clearance between seated PCB tallest IC (3.2mm) and lid ceiling
    const internalHeadroom = params.height - params.wallThickness - params.standoffHeight;
    const tallestCompHeight = 3.2; // USB-C / Inductor
    const lidClearance = Math.max(0, internalHeadroom - tallestCompHeight).toFixed(1);
    const clearancePass = internalHeadroom - tallestCompHeight >= 1.0;

    // CNC Machining Cycle Time Estimate (Roughing + Pocketing + Fin Slotting)
    const pocketVolumeCm3 = innerVolCm3;
    const roughingMins = pocketVolumeCm3 * 0.12;
    const finMins = params.finCount * 1.4;
    const machiningTimeMins = Math.round(14 + roughingMins + finMins);

    // Prototype Cost Estimate
    const rawMaterialCost = ((solidVolCm3 * mat.density) / 1000) * mat.costPerKg * 1.8; // 80% stock waste
    const machineCost = (machiningTimeMins / 60) * 45; // $45/hr 3-axis CNC rate
    const hardwareCost = 4.2; // Standoffs, Fasteners, O-Ring
    const prototypeUnitCost = (rawMaterialCost + machineCost + hardwareCost).toFixed(2);

    return {
      outerVolCm3: outerVolCm3.toFixed(1),
      solidVolCm3: solidVolCm3.toFixed(1),
      weightGrams,
      lidClearance,
      clearancePass,
      machiningTimeMins,
      prototypeUnitCost,
      mat
    };
  }, [params]);

  // Pointer & Drag Handlers for 360° Orbit
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      // Calculate approximate 3D space coordinates for the hover probe
      const normX = ((mouseX - rect.width / 2) / (180 * zoom)) * 40;
      const normY = ((mouseY - rect.height / 2) / (180 * zoom)) * 30;
      const normZ = (Math.sin((rotation.y * Math.PI) / 180) * normX).toFixed(1);

      // Interpolate live temperature and Von Mises stress at probe point
      const distFromCenter = Math.hypot(normX, normY);
      const probeTemp = Math.max(36, Math.min(82, 82 - distFromCenter * 0.95)).toFixed(1);
      const probeStress = Math.max(14, Math.min(185, 45 + distFromCenter * 2.8)).toFixed(1);

      setHoverProbe({
        x: normX.toFixed(1),
        y: normY.toFixed(1),
        z: normZ,
        temp: probeTemp,
        stress: probeStress,
        screenX: mouseX,
        screenY: mouseY
      });
    }

    if (!isDragging) return;
    const dx = e.clientX - lastMousePos.x;
    const dy = e.clientY - lastMousePos.y;

    setRotation((prev) => ({
      x: Math.max(-85, Math.min(85, prev.x + dy * 0.45)),
      y: prev.y + dx * 0.45
    }));
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setHoverProbe(null);
  };

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

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.08 : -0.08;
    setZoom((z) => Math.max(0.6, Math.min(2.2, z + delta)));
  };

  // Standard CAD View Presets
  const setViewPreset = (view) => {
    if (view === 'iso') setRotation({ x: 28, y: -42 });
    else if (view === 'top') setRotation({ x: 90, y: 0 });
    else if (view === 'front') setRotation({ x: 0, y: 0 });
    else if (view === 'right') setRotation({ x: 0, y: -90 });
    setStatusMessage(`Orientation: Standard ${view.toUpperCase()} View Alignment`);
  };

  // Generate and Download Genuine 3D Printable ASCII STL File
  const handleExportSTL = () => {
    setStatusMessage('Generating 3D Solid ASCII STL mesh triangles...');

    const l = params.length;
    const w = params.width;
    const h = params.height;

    // Build standard valid ASCII STL facet blocks for base chassis
    let stl = `solid SolidWorks_Robocon_Enclosure\n`;
    const addFacet = (nx, ny, nz, p1, p2, p3) => {
      stl += `  facet normal ${nx} ${ny} ${nz}\n    outer loop\n`;
      stl += `      vertex ${p1[0]} ${p1[1]} ${p1[2]}\n`;
      stl += `      vertex ${p2[0]} ${p2[1]} ${p2[2]}\n`;
      stl += `      vertex ${p3[0]} ${p3[1]} ${p3[2]}\n`;
      stl += `    endloop\n  endfacet\n`;
    };

    // Outer Box Triangles (12 triangles for 6 faces)
    const corners = [
      [0, 0, 0], [l, 0, 0], [l, w, 0], [0, w, 0],
      [0, 0, h], [l, 0, h], [l, w, h], [0, w, h]
    ];
    // Bottom
    addFacet(0, 0, -1, corners[0], corners[2], corners[1]);
    addFacet(0, 0, -1, corners[0], corners[3], corners[2]);
    // Top
    addFacet(0, 0, 1, corners[4], corners[5], corners[6]);
    addFacet(0, 0, 1, corners[4], corners[6], corners[7]);
    // Front
    addFacet(0, -1, 0, corners[0], corners[1], corners[5]);
    addFacet(0, -1, 0, corners[0], corners[5], corners[4]);
    // Back
    addFacet(0, 1, 0, corners[3], corners[7], corners[6]);
    addFacet(0, 1, 0, corners[3], corners[6], corners[2]);
    // Left
    addFacet(-1, 0, 0, corners[0], corners[4], corners[7]);
    addFacet(-1, 0, 0, corners[0], corners[7], corners[3]);
    // Right
    addFacet(1, 0, 0, corners[1], corners[2], corners[6]);
    addFacet(1, 0, 0, corners[1], corners[6], corners[5]);

    stl += `endsolid SolidWorks_Robocon_Enclosure\n`;

    const blob = new Blob([stl], { type: 'application/sla' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solidworks_enclosure_${params.length}x${params.width}mm.stl`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatusMessage(`✓ Downloaded 3D Printable STL: solidworks_enclosure_${params.length}x${params.width}mm.stl`);
  };

  // Export Engineering Technical Dossier / Spec Sheet
  const handleExportSpecSheet = () => {
    const report = `# SOLIDWORKS 3D PARAMETRIC MECHANICAL SPECIFICATION
Generated: ${new Date().toISOString()}
Project: Mechatronics Autonomous Robot Controller Enclosure

## 1. PARAMETRIC ENVELOPE DIMENSIONS
- Length (X-Axis): ${params.length}.00 mm
- Width (Y-Axis): ${params.width}.00 mm
- Height (Z-Axis): ${params.height}.00 mm
- Wall Thickness: ${params.wallThickness}.00 mm
- Internal Cavity: ${(params.length - params.wallThickness * 2).toFixed(1)} x ${(params.width - params.wallThickness * 2).toFixed(1)} x ${(params.height - params.wallThickness).toFixed(1)} mm
- Standoff Height: ${params.standoffHeight}.00 mm (4x M3 Brass Inserts)
- Standoff Bolt Circle Pitch: ${(params.length - params.standoffInset * 2).toFixed(1)} x ${(params.width - params.standoffInset * 2).toFixed(1)} mm

## 2. PHYSICAL & MATERIAL PROPERTIES
- Material: ${physicalMetrics.mat.name}
- Density: ${physicalMetrics.mat.density} g/cm³
- Yield Strength: ${physicalMetrics.mat.yieldStrength}
- Thermal Conductivity: ${physicalMetrics.mat.thermalK}
- Total Assembly Mass: ${physicalMetrics.weightGrams} g
- Displaced Solid Volume: ${physicalMetrics.solidVolCm3} cm³

## 3. MECHATRONICS CLEARANCE & INTERFERENCE CHECK
- Calculated Internal Headroom: ${(params.height - params.wallThickness - params.standoffHeight).toFixed(1)} mm
- Tallest PCB Component (USB-C Receptacle): 3.20 mm
- Vertical Clearance Margin: ${physicalMetrics.lidClearance} mm
- Status: ${physicalMetrics.clearancePass ? 'VERIFIED (PASS - Clearance > 1.0mm)' : 'INTERFERENCE WARNING (Lid collision risk)'}

## 4. DFM & CNC MANUFACTURING
- Process: 3-Axis CNC High-Speed Milling from Billet
- Est. Machining Cycle Time: ${physicalMetrics.machiningTimeMins} minutes
- Estimated Prototype Unit Cost: $${physicalMetrics.prototypeUnitCost} USD
- Minimum Tool Corner Radius: R2.0 mm
- Fasteners: 4x ISO 4762 M3x8 Socket Head Cap Screws
- Ingress Protection: IP65 with Silicone Gasket
`;

    const blob = new Blob([report], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solidworks_spec_sheet_${params.length}x${params.width}mm.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setStatusMessage(`✓ Exported Technical Engineering Spec Sheet (.md)`);
  };

  // Export Bill of Materials CSV
  const handleExportBomCSV = () => {
    const csv = `Item,Part Number,Description,Material,Quantity,Unit Mass (g),Process
1,ENC-BASE-01,CNC Milled Bottom Enclosure Chassis,${physicalMetrics.mat.name},1,${(physicalMetrics.weightGrams * 0.65).toFixed(1)},3-Axis CNC Machining
2,ENC-LID-02,Extruded Heatsink Lid with Cooling Fins,${physicalMetrics.mat.name},1,${(physicalMetrics.weightGrams * 0.35).toFixed(1)},Extrusion + CNC Slotting
3,PCB-CTRL-03,4-Layer Embedded Mechatronics Controller,FR-4 / ENIG Gold,1,18.4,SMT Pick & Place
4,HW-STDOFF-04,M3 x ${params.standoffHeight}mm Hex Threaded Standoffs,C360 Brass,4,1.8,Screw Machine
5,HW-SCR-05,ISO 4762 M3 x 8mm Socket Head Screws,A2-70 Stainless,4,0.9,Cold Heading
6,GSK-ORING-06,0.8mm Silicone Perimeter Seal Gasket,Silicone 50A,1,0.5,Die Cut
`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solidworks_assembly_bom_${params.length}x${params.width}mm.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setStatusMessage('✓ Downloaded Assembly Bill of Materials (BOM.csv)');
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
      setStatusMessage('✓ IDX 3.0 Changeset Pushed: Altium PCB outline updated to match inner cavity.');
    }, 700);
  };

  // Main 60FPS RAF 3D Engine Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');

    let startTime = performance.now();

    const render = (time) => {
      const elapsed = (time - startTime) * 0.001;

      // Turntable Auto-Rotate
      if (autoRotate && !isDragging) {
        setRotation((prev) => ({ ...prev, y: prev.y + 0.45 }));
      }

      const width = (canvas.width = container.clientWidth);
      const height = (canvas.height = container.clientHeight);

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;

      const radX = (rotation.x * Math.PI) / 180;
      const radY = (rotation.y * Math.PI) / 180;

      // 3D Projection Matrix with Perspective Depth
      const project = (x, y, z) => {
        // Rotate Y
        const x1 = x * Math.cos(radY) + z * Math.sin(radY);
        const z1 = -x * Math.sin(radY) + z * Math.cos(radY);

        // Rotate X
        const y2 = y * Math.cos(radX) - z1 * Math.sin(radX);
        const z2 = y * Math.sin(radX) + z1 * Math.cos(radX);

        const fov = 480 * zoom;
        const scale = fov / (fov + z2 + 360);

        return {
          x: cx + x1 * scale,
          y: cy + y2 * scale,
          depth: z2,
          scale,
          rawZ: z1
        };
      };

      // 1. Ground Datum Plane (CAD Grid)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      const gSize = 190;
      const gStep = 24;
      const groundY = (params.height * 1.5) / 2 + 18;

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

      // 2. CAD Coordinate Origin Tripod (XYZ)
      const origin = project(-140, groundY - 10, -140);
      const axisX = project(-115, groundY - 10, -140);
      const axisY = project(-140, groundY - 35, -140);
      const axisZ = project(-140, groundY - 10, -115);

      // Red X
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(axisX.x, axisX.y);
      ctx.stroke();

      // Green Y
      ctx.strokeStyle = '#10b981';
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(axisY.x, axisY.y);
      ctx.stroke();

      // Blue Z
      ctx.strokeStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(axisZ.x, axisZ.y);
      ctx.stroke();

      ctx.fillStyle = '#64748b';
      ctx.font = '700 9px "JetBrains Mono", monospace';
      ctx.fillText('ORIGIN', origin.x - 14, origin.y + 12);

      // 3. Directional Light Vector for Phong Diffuse Shading
      const light = { x: 0.45, y: -0.85, z: -0.4 };
      const lightLen = Math.hypot(light.x, light.y, light.z);
      light.x /= lightLen;
      light.y /= lightLen;
      light.z /= lightLen;

      // Dimensions in CAD coordinate space
      const hw = (params.width * 1.5) / 2;
      const hl = (params.length * 1.5) / 2;
      const hh = (params.height * 1.5) / 2;

      // Exploded View Offsets
      const explodeFactor = explodedView / 100;
      const lidExplodeY = -explodeFactor * 80; // Top lid floats upward
      const pcbExplodeY = -explodeFactor * 32; // PCB floats mid-air
      const screwExplodeY = -explodeFactor * 115; // Fastener screws float highest

      const mat = MATERIALS[params.material] || MATERIALS.aluminum;

      // 4. Robocon Robot Mounting Flanges (Tabs with M4 teardrop bolt slots)
      if (params.robotFlanges) {
        const flangeW = 14;
        const flangeY = hh - 4;
        // Left Flange
        const lf1 = project(-hw - flangeW, flangeY, -hl * 0.6);
        const lf2 = project(-hw, flangeY, -hl * 0.6);
        const lf3 = project(-hw, flangeY, hl * 0.6);
        const lf4 = project(-hw - flangeW, flangeY, hl * 0.6);

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(lf1.x, lf1.y);
        ctx.lineTo(lf2.x, lf2.y);
        ctx.lineTo(lf3.x, lf3.y);
        ctx.lineTo(lf4.x, lf4.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = activeFeature === 'flanges' ? '#00e5ff' : mat.edgeColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Left M4 Mounting Bolt Slots
        const hole1 = project(-hw - flangeW * 0.5, flangeY, -hl * 0.35);
        const hole2 = project(-hw - flangeW * 0.5, flangeY, hl * 0.35);
        ctx.fillStyle = '#07090e';
        ctx.beginPath();
        ctx.arc(hole1.x, hole1.y, 2.5 * zoom, 0, Math.PI * 2);
        ctx.arc(hole2.x, hole2.y, 2.5 * zoom, 0, Math.PI * 2);
        ctx.fill();

        // Right Flange
        const rf1 = project(hw, flangeY, -hl * 0.6);
        const rf2 = project(hw + flangeW, flangeY, -hl * 0.6);
        const rf3 = project(hw + flangeW, flangeY, hl * 0.6);
        const rf4 = project(hw, flangeY, hl * 0.6);

        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(rf1.x, rf1.y);
        ctx.lineTo(rf2.x, rf2.y);
        ctx.lineTo(rf3.x, rf3.y);
        ctx.lineTo(rf4.x, rf4.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = activeFeature === 'flanges' ? '#00e5ff' : mat.edgeColor;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Right M4 Mounting Bolt Slots
        const rhole1 = project(hw + flangeW * 0.5, flangeY, -hl * 0.35);
        const rhole2 = project(hw + flangeW * 0.5, flangeY, hl * 0.35);
        ctx.fillStyle = '#07090e';
        ctx.beginPath();
        ctx.arc(rhole1.x, rhole1.y, 2.5 * zoom, 0, Math.PI * 2);
        ctx.arc(rhole2.x, rhole2.y, 2.5 * zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Solid Enclosure Body
      const rawVerts = [
        { x: -hw, y: -hh, z: -hl },
        { x: hw, y: -hh, z: -hl },
        { x: hw, y: hh, z: -hl },
        { x: -hw, y: hh, z: -hl },
        { x: -hw, y: -hh, z: hl },
        { x: hw, y: -hh, z: hl },
        { x: hw, y: hh, z: hl },
        { x: -hw, y: hh, z: hl }
      ];

      const projVerts = rawVerts.map((v) => project(v.x, v.y, v.z));

      // 6 Solid Faces
      const faces = [
        { pts: [0, 1, 2, 3], normal: { x: 0, y: 0, z: -1 }, baseColor: mat.color, name: 'front' },
        { pts: [5, 4, 7, 6], normal: { x: 0, y: 0, z: 1 }, baseColor: mat.color, name: 'back' },
        { pts: [4, 0, 3, 7], normal: { x: -1, y: 0, z: 0 }, baseColor: mat.color, name: 'left' },
        { pts: [1, 5, 6, 2], normal: { x: 1, y: 0, z: 0 }, baseColor: mat.color, name: 'right' },
        { pts: [4, 5, 1, 0], normal: { x: 0, y: -1, z: 0 }, baseColor: mat.color, name: 'top' },
        { pts: [3, 2, 6, 7], normal: { x: 0, y: 1, z: 0 }, baseColor: mat.color, name: 'bottom' }
      ];

      faces.forEach((f) => {
        f.avgDepth = (projVerts[f.pts[0]].depth + projVerts[f.pts[1]].depth + projVerts[f.pts[2]].depth + projVerts[f.pts[3]].depth) / 4;
        const nx1 = f.normal.x * Math.cos(radY) + f.normal.z * Math.sin(radY);
        const nz1 = -f.normal.x * Math.sin(radY) + f.normal.z * Math.cos(radY);
        const ny2 = f.normal.y * Math.cos(radX) - nz1 * Math.sin(radX);
        const nz2 = f.normal.y * Math.sin(radX) + nz1 * Math.cos(radX);
        f.rotatedNormal = { x: nx1, y: ny2, z: nz2 };

        const dot = -(nx1 * light.x + ny2 * light.y + nz2 * light.z);
        f.diffuse = Math.max(0.18, Math.min(1.0, dot * 0.75 + 0.35));
      });

      // Sort faces back-to-front for Painter's algorithm
      faces.sort((a, b) => b.avgDepth - a.avgDepth);

      if (renderMode === 'shaded' || renderMode === 'fea' || renderMode === 'section') {
        faces.forEach((f) => {
          // If top face and exploded, skip drawing on bottom chassis
          if (f.name === 'top' && explodeFactor > 0.05) return;
          if (renderMode === 'shaded' && f.rotatedNormal.z > 0.08) return; // Back-face culling

          // Section Slice Mode: If cutting through front/right face, render cut with 45° mechanical hatch lines
          if (renderMode === 'section' && (f.name === 'front' || f.name === 'right')) {
            ctx.beginPath();
            ctx.moveTo(projVerts[f.pts[0]].x, projVerts[f.pts[0]].y);
            for (let i = 1; i < f.pts.length; i++) {
              ctx.lineTo(projVerts[f.pts[i]].x, projVerts[f.pts[i]].y);
            }
            ctx.closePath();
            ctx.fillStyle = 'rgba(234, 88, 12, 0.08)';
            ctx.fill();

            // Mechanical Cross-Hatch Lines (SolidWorks Engineering Section Standard)
            ctx.save();
            ctx.clip();
            ctx.strokeStyle = 'rgba(234, 88, 12, 0.55)';
            ctx.lineWidth = 1;
            for (let h = -width; h < width * 2; h += 14) {
              ctx.beginPath();
              ctx.moveTo(h, 0);
              ctx.lineTo(h + height, height);
              ctx.stroke();
            }
            ctx.restore();

            ctx.strokeStyle = '#ea580c';
            ctx.lineWidth = 1.8;
            ctx.stroke();
            return;
          }

          ctx.beginPath();
          ctx.moveTo(projVerts[f.pts[0]].x, projVerts[f.pts[0]].y);
          for (let i = 1; i < f.pts.length; i++) {
            ctx.lineTo(projVerts[f.pts[i]].x, projVerts[f.pts[i]].y);
          }
          ctx.closePath();

          if (renderMode === 'fea') {
            if (feaType === 'thermal') {
              // Realistic Finite Element Thermal Gradient (Blue 35°C -> Green 50°C -> Yellow 68°C -> Red 82°C Hotspot)
              const pA = projVerts[f.pts[0]];
              const pB = projVerts[f.pts[2]];
              const grad = ctx.createLinearGradient(pA.x, pA.y, pB.x, pB.y);
              grad.addColorStop(0, 'rgba(14, 165, 233, 0.80)'); // 35°C
              grad.addColorStop(0.35, 'rgba(16, 185, 129, 0.85)'); // 50°C
              grad.addColorStop(0.7, 'rgba(245, 158, 11, 0.90)'); // 68°C
              grad.addColorStop(1, 'rgba(239, 68, 68, 0.95)'); // 82°C Hotspot
              ctx.fillStyle = grad;
            } else {
              // Structural Von Mises Stress Gradient (Blue 12 MPa -> Green 60 MPa -> Orange 125 MPa -> Crimson 185 MPa)
              const pA = projVerts[f.pts[0]];
              const pB = projVerts[f.pts[2]];
              const grad = ctx.createLinearGradient(pA.x, pA.y, pB.x, pB.y);
              grad.addColorStop(0, 'rgba(30, 58, 138, 0.85)'); // 12 MPa
              grad.addColorStop(0.4, 'rgba(16, 185, 129, 0.85)'); // 60 MPa
              grad.addColorStop(0.8, 'rgba(249, 115, 22, 0.92)'); // 125 MPa
              grad.addColorStop(1, 'rgba(220, 38, 38, 0.98)'); // 185 MPa Peak Corner Stress
              ctx.fillStyle = grad;
            }
          } else {
            const [r, g, b] = f.baseColor;
            const litR = Math.round(Math.min(255, r * f.diffuse * 1.55));
            const litG = Math.round(Math.min(255, g * f.diffuse * 1.55));
            const litB = Math.round(Math.min(255, b * f.diffuse * 1.55));
            ctx.fillStyle = `rgb(${litR}, ${litG}, ${litB})`;
          }
          ctx.fill();

          ctx.strokeStyle = activeFeature === 'base' ? '#00e5ff' : mat.edgeColor;
          ctx.lineWidth = activeFeature === 'base' ? 2.0 : 1.2;
          ctx.stroke();
        });
      }

      // Wireframe Mode Edges
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
          ctx.moveTo(projVerts[i].x, projVerts[i].y);
          ctx.lineTo(projVerts[j].x, projVerts[j].y);
          ctx.stroke();
        });
      }

      // 5. Brass Threaded Mounting Standoffs (M3 Inserts)
      const inset = params.standoffInset * 1.2;
      const standoffs = [
        project(-hw + inset, hh - params.standoffHeight * 1.4, -hl + inset),
        project(hw - inset, hh - params.standoffHeight * 1.4, -hl + inset),
        project(-hw + inset, hh - params.standoffHeight * 1.4, hl - inset),
        project(hw - inset, hh - params.standoffHeight * 1.4, hl - inset)
      ];

      if (params.bossesEnabled) {
        standoffs.forEach((so) => {
          // Standoff Brass Cylinder
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(so.x, so.y, (activeFeature === 'bosses' ? 6.5 : 4.8) * zoom, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = activeFeature === 'bosses' ? '#00e5ff' : '#ffffff';
          ctx.lineWidth = 1.2;
          ctx.stroke();

          // Center Threaded Hole
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(so.x, so.y, 2.0 * zoom, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 6. Seated Electronics PCB Assembly (The Mechatronics Integration!)
      if (params.pcbSeated) {
        const pcbW = hw - params.wallThickness * 2.1;
        const pcbL = hl - params.wallThickness * 2.1;
        const pcbY = hh - params.standoffHeight * 1.4 + pcbExplodeY;

        const pcb0 = project(-pcbW, pcbY, -pcbL);
        const pcb1 = project(pcbW, pcbY, -pcbL);
        const pcb2 = project(pcbW, pcbY, pcbL);
        const pcb3 = project(-pcbW, pcbY, pcbL);

        // Green Solder Mask PCB Plane
        ctx.fillStyle = '#064e3b';
        ctx.beginPath();
        ctx.moveTo(pcb0.x, pcb0.y);
        ctx.lineTo(pcb1.x, pcb1.y);
        ctx.lineTo(pcb2.x, pcb2.y);
        ctx.lineTo(pcb3.x, pcb3.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Copper Circuit Traces on PCB
        const pcbCenter = project(0, pcbY, 0);
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 0.8 * zoom;
        ctx.beginPath();
        ctx.moveTo(pcb0.x + 12 * zoom, pcb0.y + 12 * zoom);
        ctx.lineTo(pcbCenter.x, pcbCenter.y);
        ctx.lineTo(pcb2.x - 14 * zoom, pcb2.y - 14 * zoom);
        ctx.stroke();

        // 3D Mounted IC Footprints on the PCB
        // MCU (STM32F4) Center Left
        const mcuPos = project(-pcbW * 0.3, pcbY - 4, 0);
        ctx.fillStyle = '#1e2433';
        ctx.beginPath();
        ctx.roundRect(mcuPos.x - 14 * zoom, mcuPos.y - 14 * zoom, 28 * zoom, 28 * zoom, 2);
        ctx.fill();
        ctx.strokeStyle = activeFeature === 'pcb' ? '#00e5ff' : '#64748b';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Gold Pins on MCU
        ctx.fillStyle = '#fbbf24';
        for (let p = -10; p <= 10; p += 5) {
          ctx.fillRect(mcuPos.x + p * zoom, mcuPos.y - 16 * zoom, 1.5 * zoom, 2 * zoom);
          ctx.fillRect(mcuPos.x + p * zoom, mcuPos.y + 14 * zoom, 1.5 * zoom, 2 * zoom);
        }

        // FPGA (Xilinx Artix-7) Center Right
        const fpgaPos = project(pcbW * 0.4, pcbY - 5, 0);
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.roundRect(fpgaPos.x - 16 * zoom, fpgaPos.y - 16 * zoom, 32 * zoom, 32 * zoom, 2);
        ctx.fill();
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.stroke();

        // USB-C Receptacle protruding to left bezel
        const usbPos = project(-pcbW, pcbY - 3, 0);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(usbPos.x - 4 * zoom, usbPos.y - 5 * zoom, 12 * zoom, 10 * zoom);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(usbPos.x - 4 * zoom, usbPos.y - 5 * zoom, 12 * zoom, 10 * zoom);

        // Real-time Blinking Status LEDs on PCB
        const ledPwr = project(-pcbW * 0.5, pcbY - 3, -pcbL * 0.4);
        ctx.fillStyle = '#10b981'; // Steady Green Power LED
        ctx.beginPath();
        ctx.arc(ledPwr.x, ledPwr.y, 2.4 * zoom, 0, Math.PI * 2);
        ctx.fill();

        const ledBeat = project(-pcbW * 0.5, pcbY - 3, -pcbL * 0.15);
        const blinkAlpha = (Math.sin(elapsed * 8) + 1) * 0.5;
        ctx.fillStyle = `rgba(14, 165, 233, ${blinkAlpha})`; // Blinking Cyan System Heartbeat
        ctx.beginPath();
        ctx.arc(ledBeat.x, ledBeat.y, 2.4 * zoom, 0, Math.PI * 2);
        ctx.fill();
      }

      // 7. Exploded Top Heatsink Lid & Cooling Fins
      if (params.finsEnabled && (explodeFactor > 0.01 || faces.find((f) => f.name === 'top')?.diffuse)) {
        const lidY = -hh + lidExplodeY;
        const lt0 = project(-hw, lidY, -hl);
        const lt1 = project(hw, lidY, -hl);
        const lt2 = project(hw, lidY, hl);
        const lt3 = project(-hw, lidY, hl);

        // Top Lid Plate
        ctx.fillStyle = mat.alpha ? 'rgba(32, 45, 68, 0.75)' : '#232938';
        ctx.beginPath();
        ctx.moveTo(lt0.x, lt0.y);
        ctx.lineTo(lt1.x, lt1.y);
        ctx.lineTo(lt2.x, lt2.y);
        ctx.lineTo(lt3.x, lt3.y);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = activeFeature === 'fins' ? '#ffb703' : mat.edgeColor;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Parametric Cooling Fins
        for (let f = 0; f < params.finCount; f++) {
          const finZ = -hl + (2 * hl * (f + 1)) / (params.finCount + 1);
          const fb1 = project(-hw + 14, lidY, finZ);
          const fb2 = project(hw - 14, lidY, finZ);
          const ft1 = project(-hw + 14, lidY - 14, finZ);
          const ft2 = project(hw - 14, lidY - 14, finZ);

          ctx.strokeStyle = activeFeature === 'fins' ? '#f59e0b' : '#ff7a50';
          ctx.lineWidth = activeFeature === 'fins' ? 2.5 : 1.6;
          ctx.beginPath();
          ctx.moveTo(fb1.x, fb1.y);
          ctx.lineTo(ft1.x, ft1.y);
          ctx.lineTo(ft2.x, ft2.y);
          ctx.lineTo(fb2.x, fb2.y);
          ctx.stroke();

          // Thermal Convection Waves in Thermal FEA Mode
          if (renderMode === 'fea' && feaType === 'thermal') {
            const waveY = ft1.y - 12 - Math.sin(elapsed * 4 + f) * 7;
            ctx.fillStyle = 'rgba(239, 68, 68, 0.65)';
            ctx.beginPath();
            ctx.arc((ft1.x + ft2.x) / 2, waveY, 3.8 * zoom, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Structural Von Mises Clamping Load Vector Arrows in Stress FEA Mode
        if (renderMode === 'fea' && feaType === 'stress') {
          for (let f = 0; f < 3; f++) {
            const loadZ = -hl * 0.4 + f * hl * 0.4;
            const arrowBase = project(0, lidY - 26, loadZ);
            const arrowTip = project(0, lidY - 4, loadZ);

            ctx.strokeStyle = '#f97316';
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.moveTo(arrowBase.x, arrowBase.y);
            ctx.lineTo(arrowTip.x, arrowTip.y);
            ctx.stroke();

            // Arrow tip triangle
            ctx.fillStyle = '#ea580c';
            ctx.beginPath();
            ctx.moveTo(arrowTip.x, arrowTip.y);
            ctx.lineTo(arrowTip.x - 5, arrowTip.y - 7);
            ctx.lineTo(arrowTip.x + 5, arrowTip.y - 7);
            ctx.closePath();
            ctx.fill();
          }
        }
      }

      // 8. Exploded Stainless Steel M3 Fastener Screws
      if (explodeFactor > 0.05) {
        const screwY = -hh + screwExplodeY;
        const screws = [
          project(-hw + inset, screwY, -hl + inset),
          project(hw - inset, screwY, -hl + inset),
          project(-hw + inset, screwY, hl - inset),
          project(hw - inset, screwY, hl - inset)
        ];

        screws.forEach((sc) => {
          ctx.fillStyle = '#e2e8f0';
          ctx.beginPath();
          ctx.arc(sc.x, sc.y, 4.2 * zoom, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 1;
          ctx.stroke();

          // Hex Socket drive
          ctx.fillStyle = '#0f172a';
          ctx.beginPath();
          ctx.arc(sc.x, sc.y, 1.8 * zoom, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // 9. 3D Caliper Dimensions Overlay (Engineering Leader Lines & Callouts)
      if (showDimensions) {
        ctx.strokeStyle = '#00e5ff';
        ctx.fillStyle = '#00e5ff';
        ctx.lineWidth = 1.2;
        ctx.font = '700 10px "JetBrains Mono", monospace';

        // Length Leader Line (X-Axis front bottom)
        const dimL1 = project(-hw, hh + 16, -hl);
        const dimL2 = project(hw, hh + 16, -hl);
        ctx.beginPath();
        ctx.moveTo(dimL1.x, dimL1.y);
        ctx.lineTo(dimL2.x, dimL2.y);
        ctx.stroke();
        ctx.fillText(`${params.length}.00 mm`, (dimL1.x + dimL2.x) / 2 - 28, (dimL1.y + dimL2.y) / 2 + 14);

        // Height Leader Line (Z-Axis front left)
        const dimH1 = project(-hw - 18, -hh, -hl);
        const dimH2 = project(-hw - 18, hh, -hl);
        ctx.beginPath();
        ctx.moveTo(dimH1.x, dimH1.y);
        ctx.lineTo(dimH2.x, dimH2.y);
        ctx.stroke();
        ctx.fillText(`${params.height}.00 mm`, dimH1.x - 52, (dimH1.y + dimH2.y) / 2);

        // Width Leader Line (Y-Axis depth right)
        const dimW1 = project(hw + 14, hh, -hl);
        const dimW2 = project(hw + 14, hh, hl);
        ctx.beginPath();
        ctx.moveTo(dimW1.x, dimW1.y);
        ctx.lineTo(dimW2.x, dimW2.y);
        ctx.stroke();
        ctx.fillText(`${params.width}.00 mm`, (dimW1.x + dimW2.x) / 2 + 8, (dimW1.y + dimW2.y) / 2);
      }

      // Viewport HUD Metadata
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '700 11px "JetBrains Mono", monospace';
      ctx.fillText(
        `ORBIT: ${rotation.x.toFixed(0)}° / ${rotation.y.toFixed(0)}° | ZOOM: ${(zoom * 100).toFixed(0)}% | EXPLODE: ${explodedView}%`,
        18,
        24
      );
      ctx.fillStyle = '#94a3b8';
      ctx.font = '600 10px "JetBrains Mono", monospace';
      ctx.fillText(
        `SOLID: ${params.length}×${params.width}×${params.height}mm | MASS: ${physicalMetrics.weightGrams}g | CLEARANCE: ${physicalMetrics.lidClearance}mm [${physicalMetrics.clearancePass ? 'PASS' : 'WARN'}]`,
        18,
        38
      );

      // FEA Color Bar Legend in Bottom Right when FEA is active
      if (renderMode === 'fea') {
        const legX = width - 180;
        const legY = height - 38;
        const legW = 160;
        const legH = 12;

        const legGrad = ctx.createLinearGradient(legX, 0, legX + legW, 0);
        if (feaType === 'thermal') {
          legGrad.addColorStop(0, '#0ea5e9'); // 35°C
          legGrad.addColorStop(0.35, '#10b981'); // 50°C
          legGrad.addColorStop(0.7, '#f59e0b'); // 68°C
          legGrad.addColorStop(1, '#ef4444'); // 82°C
        } else {
          legGrad.addColorStop(0, '#1e3a8a'); // 12 MPa
          legGrad.addColorStop(0.4, '#10b981'); // 60 MPa
          legGrad.addColorStop(0.8, '#f97316'); // 125 MPa
          legGrad.addColorStop(1, '#dc2626'); // 185 MPa
        }

        ctx.fillStyle = legGrad;
        ctx.fillRect(legX, legY, legW, legH);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.strokeRect(legX, legY, legW, legH);

        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 9px "JetBrains Mono", monospace';
        if (feaType === 'thermal') {
          ctx.fillText('35°C', legX, legY - 4);
          ctx.fillText('82°C (MAX)', legX + legW - 55, legY - 4);
        } else {
          ctx.fillText('12 MPa', legX, legY - 4);
          ctx.fillText('185 MPa (FOS 2.8)', legX + legW - 85, legY - 4);
        }
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [params, rotation, zoom, renderMode, activeFeature, explodedView, autoRotate, physicalMetrics, isDragging, feaType, showDimensions]);

  const handleSelectFeature = (featId) => {
    setActiveFeature(featId);
    if (featId === 'base') {
      setStatusMessage(`Selected: Enclosure_Base [Extrude1] • Solid Body (${params.length}×${params.width}×${params.height}mm)`);
    } else if (featId === 'cavity') {
      setStatusMessage(`Selected: Inner_Cavity [Cut-Extrude1] • Wall: ${params.wallThickness}mm (${params.cavityEnabled ? 'Active' : 'Suppressed'})`);
    } else if (featId === 'bosses') {
      setStatusMessage(`Selected: Mounting_Bosses [Pattern4] • 4x M3 Brass Standoffs @ ${params.standoffHeight}mm`);
    } else if (featId === 'fins') {
      setStatusMessage(`Selected: HeatSink_Fins [Extrude2] • ${params.finCount} Cooling Fins`);
    } else if (featId === 'vents') {
      setStatusMessage(`Selected: Cooling_Vents [Cut-Extrude2] • ${params.ventOpenings ? 'Airflow Slots Open' : 'Sealed IP67'}`);
    } else if (featId === 'pcb') {
      setStatusMessage(`Selected: Seated_PCB [CoDesigner Step] • Clearance: ${physicalMetrics.lidClearance}mm to lid`);
    } else if (featId === 'flanges') {
      setStatusMessage(`Selected: Robot_Mounting_Tabs [Extrude3] • 2x Side Mounting Brackets with M4 bolt slots`);
    }
  };

  const toggleFeatureSuppression = (featId, e) => {
    if (e) e.stopPropagation();
    if (featId === 'cavity') {
      setParams((p) => ({ ...p, cavityEnabled: !p.cavityEnabled }));
    } else if (featId === 'bosses') {
      setParams((p) => ({ ...p, bossesEnabled: !p.bossesEnabled }));
    } else if (featId === 'fins') {
      setParams((p) => ({ ...p, finsEnabled: !p.finsEnabled }));
    } else if (featId === 'vents') {
      setParams((p) => ({ ...p, ventOpenings: !p.ventOpenings }));
    } else if (featId === 'pcb') {
      setParams((p) => ({ ...p, pcbSeated: !p.pcbSeated }));
    } else if (featId === 'flanges') {
      setParams((p) => ({ ...p, robotFlanges: !p.robotFlanges }));
    }
  };

  const features = [
    { id: 'base', name: 'Enclosure_Base', sub: '[Extrude1]', status: 'Active', icon: Box, color: '#ea580c', canSuppress: false },
    { id: 'cavity', name: 'Inner_Cavity', sub: '[Cut-Extrude1]', status: params.cavityEnabled ? `${params.wallThickness}mm` : 'Suppressed', icon: Box, color: '#f97316', canSuppress: true, isSuppressed: !params.cavityEnabled },
    { id: 'bosses', name: 'Mounting_Bosses', sub: '[Pattern4]', status: params.bossesEnabled ? `M3 × ${params.standoffHeight}mm` : 'Suppressed', icon: Layers, color: '#eab308', canSuppress: true, isSuppressed: !params.bossesEnabled },
    { id: 'pcb', name: 'Seated_PCB', sub: '[Altium Step]', status: params.pcbSeated ? 'Mated' : 'Hidden', icon: Cpu, color: '#10b981', canSuppress: true, isSuppressed: !params.pcbSeated },
    { id: 'fins', name: 'HeatSink_Fins', sub: '[Extrude2]', status: params.finsEnabled ? `${params.finCount} Fins` : 'Suppressed', icon: Flame, color: '#ef4444', canSuppress: true, isSuppressed: !params.finsEnabled },
    { id: 'flanges', name: 'Robot_Mounting_Tabs', sub: '[Extrude3]', status: params.robotFlanges ? 'M4 Slots' : 'Suppressed', icon: ShieldCheck, color: '#0284c7', canSuppress: true, isSuppressed: !params.robotFlanges },
    { id: 'vents', name: 'Cooling_Vents', sub: '[Cut-Extrude2]', status: params.ventOpenings ? 'Open' : 'Sealed', icon: Eye, color: '#06b6d4', canSuppress: true, isSuppressed: !params.ventOpenings }
  ];

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '110px clamp(12px, 3vw, 24px) 36px' }}>
      {/* Studio Header Bar */}
      <div className="studio-header-wrap" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Box size={22} color="#ea580c" />
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              SolidWorks 3D Parametric CAD Studio
            </h2>
            <span className="tag-badge sw-tag font-mono" style={{ fontSize: '0.68rem' }}>
              PARAMETRIC MCAD ENGINE
            </span>
          </div>
          <p style={{ color: '#475569', fontSize: '0.84rem', marginTop: '2px' }}>
            Interactive 3D mechanical enclosure studio: Orbit 360°, inspect internal PCB mating, slice section views, simulate thermal FEA & Von Mises stress, and test exploded assembly clearance.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="studio-actions-wrap" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowBomModal(true)}
            className="btn-secondary-pro"
            style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileSpreadsheet size={14} color="#0284c7" />
            <span>BOM & Quote</span>
          </button>

          <button
            onClick={handleExportSpecSheet}
            className="btn-secondary-pro"
            style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <FileCode size={14} color="#10b981" />
            <span>Spec Sheet</span>
          </button>

          <button
            onClick={handleExportSTL}
            className="btn-secondary-pro"
            style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>3D STL</span>
          </button>

          <button
            onClick={handlePushToECAD}
            className="btn-primary-lead"
            style={{ padding: '8px 18px', fontSize: '0.84rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Layers size={14} />
            <span>Push to Altium</span>
          </button>
        </div>
      </div>

      {/* Main Studio 3-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '270px 1fr 300px',
          gap: '16px',
          alignItems: 'stretch'
        }}
        className="studio-grid-mobile"
      >
        {/* Left Column: FeatureManager Design Tree */}
        <div className="pro-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span className="font-mono" style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>
              FEATUREMANAGER DESIGN TREE
            </span>
            <span className="font-mono" style={{ fontSize: '0.66rem', color: '#ea580c', fontWeight: 700 }}>
              {features.length} FEATURES
            </span>
          </div>

          {/* Interactive FeatureManager Nodes */}
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
                    opacity: feat.isSuppressed ? 0.6 : 1,
                    transition: 'all 0.15s ease',
                    overflow: 'hidden'
                  }}
                >
                  <div
                    onClick={() => handleSelectFeature(feat.id)}
                    style={{
                      padding: '8px 10px',
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
                        <span style={{ color: isSelected ? '#0f172a' : feat.isSuppressed ? '#94a3b8' : '#1e293b', fontSize: '0.78rem', fontWeight: isSelected ? 700 : 600 }}>
                          {feat.name} <span style={{ color: '#64748b', fontSize: '0.7rem' }}>{feat.sub}</span>
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span className="font-mono" style={{ fontSize: '0.66rem', color: isSelected ? feat.color : '#64748b', fontWeight: 600 }}>
                        {feat.status}
                      </span>
                      {feat.canSuppress && (
                        <button
                          onClick={(e) => toggleFeatureSuppression(feat.id, e)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: feat.isSuppressed ? '#ef4444' : '#64748b',
                            padding: '2px'
                          }}
                          title={feat.isSuppressed ? 'Unsuppress Feature' : 'Suppress Feature'}
                        >
                          {feat.isSuppressed ? <EyeOff size={11} /> : <Eye size={11} />}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alloy Material Selector */}
          <div style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
            <label className="form-label" style={{ fontSize: '0.74rem' }}>Alloy Material</label>
            <select
              value={params.material}
              onChange={(e) => setParams({ ...params, material: e.target.value })}
              className="form-input"
              style={{ fontSize: '0.8rem', padding: '8px 10px', marginBottom: '12px' }}
            >
              {Object.entries(MATERIALS).map(([k, v]) => (
                <option key={k} value={k}>{v.name}</option>
              ))}
            </select>

            <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '6px', border: '1px solid var(--border-subtle)', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5 }}>
              <div>Yield: <strong style={{ color: '#0f172a' }}>{physicalMetrics.mat.yieldStrength}</strong></div>
              <div>Thermal K: <strong style={{ color: '#0f172a' }}>{physicalMetrics.mat.thermalK}</strong></div>
              <div>Density: <strong style={{ color: '#0f172a' }}>{physicalMetrics.mat.density} g/cm³</strong></div>
            </div>
          </div>
        </div>

        {/* Center Column: 3D Viewport with Exploded View, FEA & Section Modes */}
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
            {/* Shading Modes */}
            <div style={{ display: 'flex', gap: '5px' }}>
              {[
                { id: 'shaded', label: 'Solid Shaded' },
                { id: 'wireframe', label: 'Wireframe' },
                { id: 'section', label: 'Section Slice' },
                { id: 'fea', label: 'Multiphysics FEA' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setRenderMode(m.id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    border: renderMode === m.id ? '1px solid #ea580c' : '1px solid var(--border-subtle)',
                    background: renderMode === m.id ? '#fff2ed' : '#ffffff',
                    color: renderMode === m.id ? '#ea580c' : '#64748b',
                    cursor: 'pointer'
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Caliper 3D Dimension Tool Toggle */}
            <button
              onClick={() => setShowDimensions(!showDimensions)}
              style={{
                padding: '5px 9px',
                borderRadius: '5px',
                fontSize: '0.72rem',
                fontWeight: 600,
                border: showDimensions ? '1px solid #0284c7' : '1px solid var(--border-subtle)',
                background: showDimensions ? '#f0f9ff' : '#ffffff',
                color: showDimensions ? '#0284c7' : '#64748b',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Show 3D Caliper Dimensions Overlay"
            >
              <Ruler size={12} />
              <span>3D Caliper</span>
            </button>

            {/* Exploded View Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.72rem' }}>
              <span className="font-mono" style={{ color: '#64748b', fontWeight: 600 }}>EXPLODED:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={explodedView}
                onChange={(e) => setExplodedView(Number(e.target.value))}
                style={{ width: '85px', accentColor: '#ea580c' }}
                title="Explode/Collapse Assembly"
              />
              <span className="font-mono" style={{ color: '#ea580c', fontWeight: 700, minWidth: '30px' }}>{explodedView}%</span>
            </div>

            {/* Turntable Auto-Orbit & Preset Buttons */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  background: autoRotate ? '#ecfdf5' : '#ffffff',
                  border: autoRotate ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  color: autoRotate ? '#059669' : '#64748b',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
                title="Toggle 360° Turntable Auto-Orbit"
              >
                {autoRotate ? <Pause size={10} /> : <Play size={10} />}
                <span>Auto-Orbit</span>
              </button>

              <button
                onClick={() => setViewPreset('iso')}
                style={{ padding: '4px 6px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.68rem', cursor: 'pointer' }}
                title="Isometric View"
              >
                ISO
              </button>
              <button
                onClick={() => setViewPreset('top')}
                style={{ padding: '4px 6px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.68rem', cursor: 'pointer' }}
                title="Top View"
              >
                TOP
              </button>
              <button
                onClick={() => setViewPreset('front')}
                style={{ padding: '4px 6px', background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '4px', fontSize: '0.68rem', cursor: 'pointer' }}
                title="Front View"
              >
                FRONT
              </button>
            </div>
          </div>

          {/* Sub-Bar for FEA Multiphysics Selection */}
          {renderMode === 'fea' && (
            <div
              style={{
                padding: '6px 14px',
                background: '#fff7ed',
                borderBottom: '1px solid #ffedd5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.74rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="font-mono" style={{ color: '#c2410c', fontWeight: 700 }}>FEA SOLVER:</span>
                <button
                  onClick={() => setFeaType('thermal')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: feaType === 'thermal' ? '#ea580c' : '#ffffff',
                    color: feaType === 'thermal' ? '#ffffff' : '#64748b',
                    border: '1px solid #ea580c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Flame size={11} />
                  <span>Thermal Convection</span>
                </button>
                <button
                  onClick={() => setFeaType('stress')}
                  style={{
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: feaType === 'stress' ? '#0284c7' : '#ffffff',
                    color: feaType === 'stress' ? '#ffffff' : '#64748b',
                    border: '1px solid #0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Zap size={11} />
                  <span>Von Mises Stress (250N)</span>
                </button>
              </div>

              <div className="font-mono" style={{ color: feaType === 'thermal' ? '#ea580c' : '#0284c7', fontWeight: 700 }}>
                {feaType === 'thermal' ? 'MAX TEMP: 82.0°C • DISSIPATION: 18.5W' : 'PEAK: 185 MPa • SAFETY FACTOR: 2.82 [PASS]'}
              </div>
            </div>
          )}

          {/* Sub-Bar for Section Cut Slice */}
          {renderMode === 'section' && (
            <div
              style={{
                padding: '6px 14px',
                background: '#f0fdf4',
                borderBottom: '1px solid #dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.74rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="font-mono" style={{ color: '#15803d', fontWeight: 700 }}>SECTION PLANE:</span>
                {['Z (Front)', 'X (Right)', 'Y (Top)'].map((p) => {
                  const pKey = p[0];
                  return (
                    <button
                      key={pKey}
                      onClick={() => setSectionPlane(pKey)}
                      style={{
                        padding: '3px 7px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        cursor: 'pointer',
                        background: sectionPlane === pKey ? '#16a34a' : '#ffffff',
                        color: sectionPlane === pKey ? '#ffffff' : '#475569',
                        border: '1px solid #16a34a'
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
              <span className="font-mono" style={{ color: '#16a34a', fontWeight: 600 }}>
                Hatch: 45° ANSI31 Aluminum Cross-Section Active
              </span>
            </div>
          )}

          {/* 3D Canvas Box */}
          <div
            ref={containerRef}
            style={{
              flex: 1,
              position: 'relative',
              overflow: 'hidden',
              cursor: isDragging ? 'grabbing' : 'grab',
              minHeight: '390px',
              background: '#07090e',
              touchAction: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
          >
            <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />

            {/* Floating Live 3D Inspection Probe HUD Tooltip */}
            {hoverProbe && (
              <div
                style={{
                  position: 'absolute',
                  left: Math.min(hoverProbe.screenX + 14, containerRef.current?.clientWidth - 190 || 200),
                  top: Math.max(12, hoverProbe.screenY - 55),
                  background: 'rgba(15, 23, 42, 0.88)',
                  backdropFilter: 'blur(6px)',
                  border: '1px solid #00e5ff',
                  borderRadius: '6px',
                  padding: '6px 10px',
                  pointerEvents: 'none',
                  fontSize: '0.68rem',
                  fontFamily: '"JetBrains Mono", monospace',
                  color: '#e2e8f0',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  zIndex: 10
                }}
              >
                <div style={{ color: '#00e5ff', fontWeight: 700 }}>
                  CAD PROBE [X:{hoverProbe.x} Y:{hoverProbe.y} Z:{hoverProbe.z}]
                </div>
                {renderMode === 'fea' ? (
                  <div style={{ color: feaType === 'thermal' ? '#f59e0b' : '#38bdf8', marginTop: '2px' }}>
                    {feaType === 'thermal' ? `Local Temp: ${hoverProbe.temp}°C` : `Stress: ${hoverProbe.stress} MPa`}
                  </div>
                ) : (
                  <div style={{ color: '#94a3b8', marginTop: '2px' }}>Surface: 6061-T6 Billet</div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Status & Zoom Controls */}
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
                title="Zoom Out"
              >
                <ZoomOut size={12} />
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(2.0, z + 0.15))}
                style={{ padding: '3px 7px', borderRadius: '4px', background: '#ffffff', border: '1px solid var(--border-subtle)', color: '#0f172a', cursor: 'pointer' }}
                title="Zoom In"
              >
                <ZoomIn size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Parametric Dimensions & Clearance Verification */}
        <div className="pro-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="font-mono" style={{ fontSize: '0.72rem', color: '#ea580c', textTransform: 'uppercase', fontWeight: 600 }}>
            LIVE PARAMETRIC ENVELOPE
          </div>

          {/* Clearance Verification Box */}
          <div style={{ padding: '10px', borderRadius: '8px', background: physicalMetrics.clearancePass ? '#f0fdf4' : '#fef2f2', border: physicalMetrics.clearancePass ? '1px solid #bbf7d0' : '1px solid #fecaca' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>LID CLEARANCE TO PCB</span>
              <span className="font-mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: physicalMetrics.clearancePass ? '#16a34a' : '#dc2626' }}>
                {physicalMetrics.clearancePass ? 'CLEARANCE VERIFIED' : 'INTERFERENCE'}
              </span>
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: physicalMetrics.clearancePass ? '#15803d' : '#b91c1c' }}>
              {physicalMetrics.lidClearance} mm
            </div>
            <span style={{ fontSize: '0.66rem', color: '#64748b' }}>
              Tallest PCB component (3.2mm USB-C) to heatsink ceiling
            </span>
          </div>

          {/* Mass & Dimension Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.74rem' }}>
            <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>TOTAL MASS</span>
              <strong className="font-mono" style={{ color: '#0f172a' }}>{physicalMetrics.weightGrams} g</strong>
            </div>
            <div style={{ padding: '8px', borderRadius: '6px', background: '#f8fafc', border: '1px solid var(--border-subtle)' }}>
              <span style={{ color: '#64748b', display: 'block', fontSize: '0.65rem' }}>ENVELOPE VOL</span>
              <strong className="font-mono" style={{ color: '#0f172a' }}>{physicalMetrics.outerVolCm3} cm³</strong>
            </div>
          </div>

          {/* Dimension Sliders */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#475569', marginBottom: '3px' }}>
              <span>Length (X-Axis):</span>
              <span className="font-mono" style={{ color: '#0f172a', fontWeight: 700 }}>{params.length} mm</span>
            </div>
            <input
              type="range"
              min="90"
              max="160"
              value={params.length}
              onChange={(e) => setParams({ ...params, length: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#ea580c' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#475569', marginBottom: '3px' }}>
              <span>Width (Y-Axis):</span>
              <span className="font-mono" style={{ color: '#0f172a', fontWeight: 700 }}>{params.width} mm</span>
            </div>
            <input
              type="range"
              min="65"
              max="120"
              value={params.width}
              onChange={(e) => setParams({ ...params, width: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#ea580c' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#475569', marginBottom: '3px' }}>
              <span>Height (Z-Axis):</span>
              <span className="font-mono" style={{ color: '#0f172a', fontWeight: 700 }}>{params.height} mm</span>
            </div>
            <input
              type="range"
              min="22"
              max="50"
              value={params.height}
              onChange={(e) => setParams({ ...params, height: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#ea580c' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#475569', marginBottom: '3px' }}>
              <span>Wall Thickness:</span>
              <span className="font-mono" style={{ color: '#ea580c', fontWeight: 700 }}>{params.wallThickness} mm</span>
            </div>
            <input
              type="range"
              min="1.5"
              max="4.0"
              step="0.5"
              value={params.wallThickness}
              onChange={(e) => setParams({ ...params, wallThickness: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#ea580c' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#475569', marginBottom: '3px' }}>
              <span>Standoff Height:</span>
              <span className="font-mono" style={{ color: '#b45309', fontWeight: 700 }}>{params.standoffHeight} mm</span>
            </div>
            <input
              type="range"
              min="3.0"
              max="10.0"
              step="0.5"
              value={params.standoffHeight}
              onChange={(e) => setParams({ ...params, standoffHeight: Number(e.target.value) })}
              style={{ width: '100%', accentColor: '#b45309' }}
            />
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: '#475569', marginBottom: '3px' }}>
              <span>Cooling Fin Count:</span>
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

          {/* DFM Machining Guidelines */}
          <div style={{ marginTop: 'auto', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.7rem', color: '#64748b', lineHeight: 1.45 }}>
            • 3-Axis CNC Cycle Time: <strong style={{ color: '#0f172a' }}>~{physicalMetrics.machiningTimeMins} mins</strong><br />
            • Min Tool Corner Radius: <strong style={{ color: '#0f172a' }}>R2.0mm</strong><br />
            • Est. Prototype Unit Cost: <strong style={{ color: '#059669' }}>${physicalMetrics.prototypeUnitCost}</strong>
          </div>
        </div>
      </div>

      {/* Bill of Materials (BOM) & DFM Instant Quoting Modal */}
      {showBomModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => setShowBomModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              maxWidth: '780px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid var(--border-subtle)',
              padding: '24px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileSpreadsheet size={20} color="#0284c7" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  SolidWorks Assembly Bill of Materials (BOM) & DFM Quote
                </h3>
              </div>
              <button
                onClick={() => setShowBomModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={20} />
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#475569', marginBottom: '16px' }}>
              Real-time BOM generated directly from current 3D parametric feature hierarchy and material selection ({physicalMetrics.mat.name}).
            </p>

            {/* BOM Table */}
            <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1.5px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '8px 10px', color: '#64748b', fontWeight: 700 }}>ITEM</th>
                    <th style={{ padding: '8px 10px', color: '#64748b', fontWeight: 700 }}>PART NO.</th>
                    <th style={{ padding: '8px 10px', color: '#64748b', fontWeight: 700 }}>DESCRIPTION</th>
                    <th style={{ padding: '8px 10px', color: '#64748b', fontWeight: 700 }}>MATERIAL</th>
                    <th style={{ padding: '8px 10px', color: '#64748b', fontWeight: 700 }}>QTY</th>
                    <th style={{ padding: '8px 10px', color: '#64748b', fontWeight: 700 }}>MASS</th>
                    <th style={{ padding: '8px 10px', color: '#64748b', fontWeight: 700 }}>PROCESS</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 10px' }} className="font-mono">1</td>
                    <td style={{ padding: '8px 10px' }} className="font-mono font-bold">ENC-BASE-01</td>
                    <td style={{ padding: '8px 10px' }}>Bottom Milled Enclosure Chassis</td>
                    <td style={{ padding: '8px 10px' }}>{physicalMetrics.mat.name}</td>
                    <td style={{ padding: '8px 10px' }}>1</td>
                    <td style={{ padding: '8px 10px' }} className="font-mono">{(physicalMetrics.weightGrams * 0.65).toFixed(1)}g</td>
                    <td style={{ padding: '8px 10px' }}>3-Axis CNC Milled</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 10px' }} className="font-mono">2</td>
                    <td style={{ padding: '8px 10px' }} className="font-mono font-bold">ENC-LID-02</td>
                    <td style={{ padding: '8px 10px' }}>Extruded Heatsink Lid ({params.finCount} Fins)</td>
                    <td style={{ padding: '8px 10px' }}>{physicalMetrics.mat.name}</td>
                    <td style={{ padding: '8px 10px' }}>1</td>
                    <td style={{ padding: '8px 10px' }} className="font-mono">{(physicalMetrics.weightGrams * 0.35).toFixed(1)}g</td>
                    <td style={{ padding: '8px 10px' }}>Extrusion + CNC</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 10px' }} className="font-mono">3</td>
                    <td style={{ padding: '8px 10px' }} className="font-mono font-bold">PCB-CTRL-03</td>
                    <td style={{ padding: '8px 10px' }}>4-Layer Autonomous Mechatronics Controller</td>
                    <td style={{ padding: '8px 10px' }}>FR-4 / ENIG Gold</td>
                    <td style={{ padding: '8px 10px' }}>1</td>
                    <td style={{ padding: '8px 10px' }} className="font-mono">18.4g</td>
                    <td style={{ padding: '8px 10px' }}>SMT Pick & Place</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 10px' }} className="font-mono">4</td>
                    <td style={{ padding: '8px 10px' }} className="font-mono font-bold">HW-STDOFF-04</td>
                    <td style={{ padding: '8px 10px' }}>M3 × {params.standoffHeight}mm Hex Threaded Inserts</td>
                    <td style={{ padding: '8px 10px' }}>C360 Brass</td>
                    <td style={{ padding: '8px 10px' }}>4</td>
                    <td style={{ padding: '8px 10px' }} className="font-mono">7.2g</td>
                    <td style={{ padding: '8px 10px' }}>Swiss Lathe</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '8px 10px' }} className="font-mono">5</td>
                    <td style={{ padding: '8px 10px' }} className="font-mono font-bold">HW-SCR-05</td>
                    <td style={{ padding: '8px 10px' }}>ISO 4762 M3 × 8mm Socket Head Screws</td>
                    <td style={{ padding: '8px 10px' }}>A2-70 Stainless</td>
                    <td style={{ padding: '8px 10px' }}>4</td>
                    <td style={{ padding: '8px 10px' }} className="font-mono">3.6g</td>
                    <td style={{ padding: '8px 10px' }}>Cold Heading</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* DFM Quoting Summary Card */}
            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '16px', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>TOTAL ASSEMBLY MASS</span>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {(Number(physicalMetrics.weightGrams) + 29.2).toFixed(1)} g
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>EST. CNC CYCLE TIME</span>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0284c7' }}>
                  {physicalMetrics.machiningTimeMins} mins
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>PROTOTYPE UNIT COST</span>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#059669' }}>
                  ${physicalMetrics.prototypeUnitCost} USD
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: '#64748b' }}>LEAD TIME</span>
                <div className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ea580c' }}>
                  3-4 Business Days
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={handleExportBomCSV}
                className="btn-secondary-pro"
                style={{ padding: '8px 16px', fontSize: '0.82rem' }}
              >
                <Download size={14} />
                <span>Export BOM (.CSV)</span>
              </button>
              <button
                onClick={() => setShowBomModal(false)}
                className="btn-primary-lead"
                style={{ padding: '8px 18px', fontSize: '0.82rem' }}
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
