import React, { useRef, useEffect } from 'react';

const SHADERS = {
  vertex: `
    precision highp float;
    varying vec2 vUv;
    attribute vec2 a_position;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 u_texel;

    void main () {
      vUv = .5 * (a_position + 1.);
      vL = vUv - vec2(u_texel.x, 0.);
      vR = vUv + vec2(u_texel.x, 0.);
      vT = vUv + vec2(0., u_texel.y);
      vB = vUv - vec2(0., u_texel.y);
      gl_Position = vec4(a_position, 0., 1.);
    }
  `,
  advection: `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D u_velocity_texture;
    uniform sampler2D u_input_texture;
    uniform vec2 u_texel;
    uniform float u_dt;

    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
      vec2 st = uv / tsize - 0.5;
      vec2 iuv = floor(st);
      vec2 fuv = fract(st);
      vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
      vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
      vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
      vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
      return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }

    void main () {
      vec2 coord = vUv - u_dt * bilerp(u_velocity_texture, vUv, u_texel).xy * u_texel;
      float dissipation = .96;
      gl_FragColor = dissipation * bilerp(u_input_texture, coord, u_texel);
      gl_FragColor.a = 1.;
    }
  `,
  divergence: `
    precision highp float;
    precision highp sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D u_velocity_texture;

    void main () {
      float L = texture2D(u_velocity_texture, vL).x;
      float R = texture2D(u_velocity_texture, vR).x;
      float T = texture2D(u_velocity_texture, vT).y;
      float B = texture2D(u_velocity_texture, vB).y;
      float div = .6 * (R - L + T - B);
      gl_FragColor = vec4(div, 0., 0., 1.);
    }
  `,
  pressure: `
    precision highp float;
    precision highp sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D u_pressure_texture;
    uniform sampler2D u_divergence_texture;

    void main () {
      float L = texture2D(u_pressure_texture, vL).x;
      float R = texture2D(u_pressure_texture, vR).x;
      float T = texture2D(u_pressure_texture, vT).x;
      float B = texture2D(u_pressure_texture, vB).x;
      float divergence = texture2D(u_divergence_texture, vUv).x;
      float pressure = (L + R + B + T - divergence) * 0.25;
      gl_FragColor = vec4(pressure, 0., 0., 1.);
    }
  `,
  gradientSubtract: `
    precision highp float;
    precision highp sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D u_pressure_texture;
    uniform sampler2D u_velocity_texture;

    void main () {
      float L = texture2D(u_pressure_texture, vL).x;
      float R = texture2D(u_pressure_texture, vR).x;
      float T = texture2D(u_pressure_texture, vT).x;
      float B = texture2D(u_pressure_texture, vB).x;
      vec2 velocity = texture2D(u_velocity_texture, vUv).xy;
      velocity.xy -= vec2(R - L, T - B);
      gl_FragColor = vec4(velocity, 0., 1.);
    }
  `,
  splat: `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D u_input_texture;
    uniform float u_ratio;
    uniform vec3 u_point_value;
    uniform vec2 u_point;
    uniform float u_point_size;

    void main () {
      vec2 p = vUv - u_point.xy;
      p.x *= u_ratio;
      vec3 splat = pow(2., -dot(p, p) / u_point_size) * u_point_value;
      vec3 base = texture2D(u_input_texture, vUv).xyz;
      gl_FragColor = vec4(base + splat, 1.);
    }
  `,
  output: `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D u_output_texture;

    void main () {
      vec3 C = texture2D(u_output_texture, vUv).rgb;
      gl_FragColor = vec4(vec3(1.) - C, 1.);
    }
  `
};

function getUniform(uniforms, name) {
  return uniforms[name] ?? null;
}

/**
 * Exact Navier-Stokes Interactive WebGL Fluid Simulation from rbp-ai-saas-template.vercel.app
 * Uses inverse multiply blending (vec3(1.) - C + mix-blend-mode: multiply) for light mode backgrounds.
 */
export default function FluidSimulation({
  color = { r: 0.21, g: 0.18, b: 0.51 }, // Template signature indigo (#362e82)
  className = '',
  style = {}
}) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', { alpha: true, depth: false, antialias: false });
    if (!gl) return;

    // Enable floating point textures for fluid simulation
    gl.getExtension('OES_texture_float');

    const createShader = (source, type) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(SHADERS.vertex, gl.VERTEX_SHADER);
    if (!vertShader) return;

    const createProgram = (fragSource) => {
      const fragShader = createShader(fragSource, gl.FRAGMENT_SHADER);
      if (!fragShader) return null;
      const prog = gl.createProgram();
      if (!prog) return null;
      gl.attachShader(prog, vertShader);
      gl.attachShader(prog, fragShader);
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;

      const uniforms = {};
      const count = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < count; i++) {
        const u = gl.getActiveUniform(prog, i);
        if (u) {
          uniforms[u.name] = gl.getUniformLocation(prog, u.name);
        }
      }
      return { program: prog, uniforms };
    };

    const programs = {
      splat: createProgram(SHADERS.splat),
      divergence: createProgram(SHADERS.divergence),
      pressure: createProgram(SHADERS.pressure),
      gradientSubtract: createProgram(SHADERS.gradientSubtract),
      advection: createProgram(SHADERS.advection),
      output: createProgram(SHADERS.output)
    };

    if (!Object.values(programs).every(Boolean)) return;

    // Geometry fullscreen quad
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const createFBO = (w, h, format = gl.RGBA) => {
      gl.activeTexture(gl.TEXTURE0);
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texImage2D(gl.TEXTURE_2D, 0, format, w, h, 0, format, gl.FLOAT, null);

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.viewport(0, 0, w, h);
      gl.clear(gl.COLOR_BUFFER_BIT);

      return {
        fbo,
        width: w,
        height: h,
        attach: (unit) => {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, tex);
          return unit;
        }
      };
    };

    const createDoubleFBO = (w, h, format = gl.RGBA) => {
      let fbo1 = createFBO(w, h, format);
      let fbo2 = createFBO(w, h, format);
      return {
        width: w,
        height: h,
        texelSizeX: 1 / w,
        texelSizeY: 1 / h,
        read: () => fbo1,
        write: () => fbo2,
        swap() {
          [fbo1, fbo2] = [fbo2, fbo1];
        }
      };
    };

    const blit = (dest) => {
      if (dest) {
        gl.viewport(0, 0, dest.width, dest.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, dest.fbo);
      } else {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    let velocity, density, divergence, pressure;
    const pointer = {
      x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 600,
      y: typeof window !== 'undefined' ? window.innerHeight * 0.45 : 400,
      dx: 0,
      dy: 0,
      moved: false
    };
    let isIdle = true;
    let pointSize = 4 / window.innerHeight;

    const resize = () => {
      pointSize = 4 / window.innerHeight;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const simW = Math.floor(0.25 * canvas.width);
      const simH = Math.floor(0.25 * canvas.height);

      density = createDoubleFBO(simW, simH);
      velocity = createDoubleFBO(simW, simH);
      divergence = createFBO(simW, simH, gl.RGB);
      pressure = createDoubleFBO(simW, simH, gl.RGB);
    };

    const activeSplats = [];
    let lastSplatTime = 0;

    const applyMove = (px, py) => {
      pointer.moved = true;
      pointer.dx = 5 * (px - pointer.x);
      pointer.dy = 5 * (py - pointer.y);
      pointer.x = px;
      pointer.y = py;

      if (!isIdle) {
        const now = performance.now();
        if (now - lastSplatTime > 35) {
          lastSplatTime = now;
          activeSplats.push({
            x: px,
            y: py,
            vx: pointer.dx * 0.12,
            vy: pointer.dy * 0.12,
            radius: 180,
            opacity: 1.0
          });
          if (activeSplats.length > 14) activeSplats.shift();
        }
      }
    };

    const onMouseMove = (e) => {
      isIdle = false;
      applyMove(e.pageX, e.pageY);
    };

    const onTouchMove = (e) => {
      isIdle = false;
      const t = e.targetTouches[0];
      if (t) applyMove(t.pageX, t.pageY);
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    const render = (time) => {
      // Template's exact harmonic Lissajous motion equation when user is idle
      if (time && isIdle) {
        const e = 0.5 + 0.25 * Math.sin(0.0017 * time) + 0.12 * Math.sin(0.0031 * time + 1.3) + 0.08 * Math.cos(0.0053 * time + 2.7) + 0.05 * Math.sin(0.0079 * time + 4.1);
        const t = 0.5 + 0.18 * Math.sin(0.0023 * time + 0.5) + 0.12 * Math.cos(0.0041 * time + 1.8) + 0.08 * Math.sin(0.0067 * time + 3.2) + 0.05 * Math.cos(0.0089 * time + 5);
        applyMove(e * window.innerWidth, t * window.innerHeight);
      }

      // Evolve interactive fluid splats (expansion & dissipation)
      for (let i = activeSplats.length - 1; i >= 0; i--) {
        const s = activeSplats[i];
        s.x += s.vx * 0.1;
        s.y += s.vy * 0.1;
        s.radius += 2.2;
        s.opacity *= 0.962;
        if (s.opacity < 0.04 || s.radius > 420) {
          activeSplats.splice(i, 1);
        }
      }
      if (typeof window !== 'undefined') {
        window.__FLUID_ACTIVE_SPLATS__ = activeSplats;
      }

      if (pointer.moved && velocity && density) {
        if (!isIdle) pointer.moved = false;

        const splatProg = programs.splat;
        gl.useProgram(splatProg.program);

        // Splat Velocity
        gl.uniform1i(getUniform(splatProg.uniforms, 'u_input_texture'), velocity.read().attach(1));
        gl.uniform1f(getUniform(splatProg.uniforms, 'u_ratio'), canvas.width / canvas.height);
        gl.uniform2f(getUniform(splatProg.uniforms, 'u_point'), pointer.x / canvas.width, 1 - pointer.y / canvas.height);
        gl.uniform3f(getUniform(splatProg.uniforms, 'u_point_value'), pointer.dx, -pointer.dy, 1);
        gl.uniform1f(getUniform(splatProg.uniforms, 'u_point_size'), pointSize);
        blit(velocity.write());
        velocity.swap();

        // Splat Density (Inverted color for multiply blend)
        gl.uniform1i(getUniform(splatProg.uniforms, 'u_input_texture'), density.read().attach(1));
        gl.uniform3f(getUniform(splatProg.uniforms, 'u_point_value'), 1 - color.r, 1 - color.g, 1 - color.b);
        blit(density.write());
        density.swap();
      }

      if (programs.divergence && velocity && pressure && density && divergence) {
        // Divergence
        gl.useProgram(programs.divergence.program);
        gl.uniform2f(getUniform(programs.divergence.uniforms, 'u_texel'), velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(getUniform(programs.divergence.uniforms, 'u_velocity_texture'), velocity.read().attach(1));
        blit(divergence);

        // Pressure Jacobi solve (4 iterations)
        gl.useProgram(programs.pressure.program);
        gl.uniform2f(getUniform(programs.pressure.uniforms, 'u_texel'), velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(getUniform(programs.pressure.uniforms, 'u_divergence_texture'), divergence.attach(1));
        for (let i = 0; i < 4; i++) {
          gl.uniform1i(getUniform(programs.pressure.uniforms, 'u_pressure_texture'), pressure.read().attach(2));
          blit(pressure.write());
          pressure.swap();
        }

        // Gradient Subtract
        gl.useProgram(programs.gradientSubtract.program);
        gl.uniform2f(getUniform(programs.gradientSubtract.uniforms, 'u_texel'), velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(getUniform(programs.gradientSubtract.uniforms, 'u_pressure_texture'), pressure.read().attach(1));
        gl.uniform1i(getUniform(programs.gradientSubtract.uniforms, 'u_velocity_texture'), velocity.read().attach(2));
        blit(velocity.write());
        velocity.swap();

        // Advection for Velocity
        gl.useProgram(programs.advection.program);
        gl.uniform2f(getUniform(programs.advection.uniforms, 'u_texel'), velocity.texelSizeX, velocity.texelSizeY);
        gl.uniform1i(getUniform(programs.advection.uniforms, 'u_velocity_texture'), velocity.read().attach(1));
        gl.uniform1i(getUniform(programs.advection.uniforms, 'u_input_texture'), velocity.read().attach(1));
        gl.uniform1f(getUniform(programs.advection.uniforms, 'u_dt'), 1 / 60);
        blit(velocity.write());
        velocity.swap();

        // Advection for Density
        gl.useProgram(programs.advection.program);
        gl.uniform2f(getUniform(programs.advection.uniforms, 'u_texel'), density.texelSizeX, density.texelSizeY);
        gl.uniform1i(getUniform(programs.advection.uniforms, 'u_velocity_texture'), velocity.read().attach(1));
        gl.uniform1i(getUniform(programs.advection.uniforms, 'u_input_texture'), density.read().attach(2));
        blit(density.write());
        density.swap();

        // Final output pass to screen
        gl.useProgram(programs.output.program);
        gl.uniform1i(getUniform(programs.output.uniforms, 'u_output_texture'), density.read().attach(1));
        blit(null);
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(animFrameRef.current);
      if (typeof window !== 'undefined') {
        window.__FLUID_ACTIVE_SPLATS__ = [];
      }
    };
  }, [color]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none mix-blend-multiply blur ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
        filter: 'blur(8px)',
        zIndex: 1,
        ...style
      }}
      aria-hidden="true"
    />
  );
}
