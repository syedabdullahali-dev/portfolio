'use client';

import { useEffect, useRef } from 'react';
import { useRichVisuals } from '@/lib/hooks';

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

/**
 * Domain-warped fbm. Two warp passes give the slow, liquid drift;
 * the cursor nudges the warp centre so the field leans toward the pointer.
 */
const FRAG = `
precision highp float;

uniform vec2  uRes;
uniform float uTime;
uniform vec2  uMouse;
uniform float uIntro;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < 5; i++) {
    v += amp * noise(p);
    p *= 2.02;
    amp *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes.xy) / uRes.y;

  float t = uTime * 0.045;
  vec2 m = uMouse * 0.35;

  // Two-pass domain warp
  vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 + vec2(3.2, 1.7) - t));
  vec2 r = vec2(
    fbm(p * 1.9 + 3.4 * q + m + vec2(1.7, 9.2) + t * 1.4),
    fbm(p * 1.9 + 3.4 * q - m + vec2(8.3, 2.8) - t * 1.1)
  );
  float f = fbm(p * 2.1 + 3.6 * r);

  vec3 deep  = vec3(0.090, 0.071, 0.059);  // #17120F espresso — the page ground
  vec3 ember = vec3(0.408, 0.176, 0.078);  // #682D14 burnt ember
  vec3 terra = vec3(0.788, 0.353, 0.180);  // #C95A2E terracotta
  vec3 amber = vec3(0.937, 0.639, 0.243);  // #EFA33E amber
  vec3 flare = vec3(0.980, 0.827, 0.545);  // #FAD38B blush, the brightest veins

  // Four bands rather than three, spread further apart in both value and
  // chroma. Each one is gated by a smoothstep rather than a linear ramp: that
  // keeps the troughs of the flow down at espresso and lets only the ridges
  // climb to amber, which is the difference between lit glass and a flat wash.
  vec3 col = deep;
  col = mix(col, ember, smoothstep(0.30, 0.92, f));
  col = mix(col, terra, smoothstep(0.55, 1.15, length(r)) * 0.88);
  col = mix(col, amber, smoothstep(0.62, 0.98, q.x) * 0.82);
  // Tightest gate of the four, so the highlight stays a thread through the
  // flow instead of flooding it.
  col = mix(col, flare, smoothstep(0.80, 1.00, q.y) * 0.50);

  // Glow that follows the cursor: a broad terracotta wash with a tighter
  // amber core, so pushing the pointer around visibly heats the field.
  float glow = 1.0 - smoothstep(0.0, 0.85, length(p - uMouse * 0.9));
  col += terra * glow * 0.22;
  col += amber * pow(glow, 3.0) * 0.18;

  // Keep the centre down so the headline stays readable — but only down, not
  // out; at 0.26 the middle of the hero was going flat.
  float centre = smoothstep(0.0, 0.80, length(p * vec2(0.58, 1.0)));
  col *= mix(0.34, 1.0, centre);

  // Vignette + bottom fade into the page background
  col *= 1.0 - 0.55 * smoothstep(0.40, 1.20, length(p));
  col *= smoothstep(0.0, 0.38, uv.y * 1.05);

  // Final chroma lift. Everything above stays inside the lamplit palette; this
  // is what stops the mixes averaging back out to mud.
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  col = clamp(mix(vec3(lum), col, 1.25), 0.0, 1.0);

  // Dither to kill banding on large flat gradients
  col += (hash(gl_FragCoord.xy) - 0.5) * 0.012;

  gl_FragColor = vec4(col * uIntro, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

export default function ShaderField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rich = useRichVisuals();

  useEffect(() => {
    if (!rich) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      powerPreference: 'low-power',
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]), // fullscreen triangle
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, 'uRes');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uIntro = gl.getUniformLocation(prog, 'uIntro');

    // Cap the buffer at 1.5x DPR — retina at 3x costs a lot for a blurry field.
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = canvas;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e: MouseEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMove, { passive: true });

    // Pause when scrolled away — no point burning GPU on an offscreen canvas.
    let visible = true;
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting), {
      threshold: 0.01,
    });
    io.observe(canvas);

    const start = performance.now();
    let raf = 0;
    let painted = false;
    const render = (now: number) => {
      raf = requestAnimationFrame(render);
      if (!visible || document.hidden) return;

      const elapsed = (now - start) / 1000;
      current.x += (target.x - current.x) * 0.045;
      current.y += (target.y - current.y) * 0.045;

      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, current.x, current.y);
      gl.uniform1f(uIntro, Math.min(1, elapsed / 1.4)); // fade up on load
      gl.drawArrays(gl.TRIANGLES, 0, 3);

      // The canvas is opaque black until the first frame lands, which would
      // otherwise blank out the CSS gradient underneath it.
      if (!painted) {
        painted = true;
        canvas.style.opacity = '1';
      }
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMove);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [rich]);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* CSS fallback — also what mobile and reduced-motion users get. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(72% 52% at 16% 6%, #B2571F, transparent 62%), radial-gradient(62% 48% at 88% 20%, #7A3313, transparent 58%), radial-gradient(52% 40% at 62% 94%, #D9682F, transparent 64%), var(--color-bg)',
        }}
      />
      {/* Mirrors the shader's centre knock-down, so the headline sits on the
          same depth of ground whether or not WebGL is running. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(46% 44% at 50% 46%, color-mix(in oklab, var(--color-bg) 88%, transparent), transparent 72%)',
        }}
      />
      {rich && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full opacity-0 transition-opacity duration-700"
          aria-hidden
        />
      )}
      <div className="noise absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg" />
    </div>
  );
}
