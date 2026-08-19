"use client";

import { useEffect, useRef, useState } from "react";
import { motionOK } from "@/lib/gsap";

/**
 * Full-bleed hero background field — the landonorris.com mechanism:
 *
 *   • Persistent fluid "ink trail": wherever the cursor goes, a wet blob is
 *     splatted into a ping-pong feedback buffer, which is advected by curl
 *     noise and slowly evaporates each frame. This is what makes the reveal
 *     feel liquid, trail behind the cursor and linger after it leaves.
 *   • Drifting topographic contour lines: 3D value noise sliced into
 *     iso-lines, slowly animated in time; the trail brightens & thickens them.
 *   • Optional reveal texture: inside the trail, an image (or the ambient
 *     video's poster) shows through the contours.
 *
 * Exposes the trail via `window.__heroTrail(u,v)` so the portrait canvas can
 * share the same fluid mask for its own alt-image reveal.
 *
 * Mounts only on ≥1024px, fine pointer, motion allowed, WebGL2 present.
 */

const VERT = `#version 300 es
in vec2 aPos; out vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.,1.); }`;

// ---- Pass 1: trail update (feedback) --------------------------------------
const TRAIL_FRAG = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uPrev;
uniform vec2 uMouse, uPrevMouse;
uniform float uAspect, uTime, uActive, uDecay;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5453); }
float noise(vec2 p){
  vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);
}
// distance from p to segment ab (aspect-corrected)
float segDist(vec2 p, vec2 a, vec2 b){
  vec2 pa=p-a, ba=b-a; pa.x*=uAspect; ba.x*=uAspect;
  float h=clamp(dot(pa,ba)/max(dot(ba,ba),1e-6),0.,1.);
  return length(pa-ba*h);
}
void main(){
  // advect: sample previous frame slightly offset by curl-ish noise flow
  vec2 flow = vec2(noise(vUv*4.+uTime*0.15), noise(vUv*4.+7.3-uTime*0.12))-0.5;
  vec2 uv = vUv + flow*0.0035;
  float prev = texture(uPrev, uv).r * uDecay;
  // splat a soft capsule between prev & current mouse so fast moves don't gap
  float d = segDist(vUv, uPrevMouse, uMouse);
  float wobble = 0.85 + 0.3*noise(vUv*18.+uTime*2.);
  float splat = smoothstep(0.075*wobble, 0.0, d) * uActive;
  o = vec4(clamp(prev + splat, 0., 1.), 0., 0., 1.);
}`;

// ---- Pass 2: composite -----------------------------------------------------
const COMP_FRAG = `#version 300 es
precision highp float;
in vec2 vUv; out vec4 o;
uniform sampler2D uTrail;
uniform sampler2D uReveal;
uniform float uHasReveal;
uniform float uTime, uAspect;
uniform vec3 uBg, uLine, uAccent;

vec3 hash3(vec3 p){ p=vec3(dot(p,vec3(127.1,311.7,74.7)),dot(p,vec3(269.5,183.3,246.1)),dot(p,vec3(113.5,271.9,124.6))); return fract(sin(p)*43758.5453); }
float noise3(vec3 p){
  vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  float n000=hash3(i).x, n100=hash3(i+vec3(1,0,0)).x, n010=hash3(i+vec3(0,1,0)).x, n110=hash3(i+vec3(1,1,0)).x;
  float n001=hash3(i+vec3(0,0,1)).x, n101=hash3(i+vec3(1,0,1)).x, n011=hash3(i+vec3(0,1,1)).x, n111=hash3(i+vec3(1,1,1)).x;
  return mix(mix(mix(n000,n100,f.x),mix(n010,n110,f.x),f.y),mix(mix(n001,n101,f.x),mix(n011,n111,f.x),f.y),f.z);
}
float fbm(vec3 p){ float v=0., a=0.5; for(int i=0;i<4;i++){ v+=a*noise3(p); p*=2.02; a*=0.5; } return v; }

void main(){
  vec2 p = vUv; p.x *= uAspect;
  float trail = texture(uTrail, vUv).r;
  // slow-drifting height field → contour iso-lines
  float h = fbm(vec3(p*1.6, uTime*0.045));
  float bands = 9.0 + trail*6.0;                 // trail densifies the contours
  float f = fract(h*bands);
  float w = fwidth(h*bands)*1.4;
  float line = 1.0 - smoothstep(0.0, w*2.5, min(f, 1.0-f));
  // faint edge glow around the trail
  float glow = smoothstep(0.02, 0.6, trail);
  vec3 col = uBg;
  vec3 lineCol = mix(uLine, uAccent, glow*0.85);
  col = mix(col, lineCol, line * (0.35 + glow*0.65));
  // reveal texture inside the trail
  if (uHasReveal > 0.5) {
    vec3 tex = texture(uReveal, vUv).rgb;
    col = mix(col, tex, smoothstep(0.08, 0.7, trail)*0.9);
    col = mix(col, lineCol, line * glow * 0.4);
  }
  o = vec4(col, 1.0);
}`;

declare global {
  interface Window {
    __heroTrail?: { tex: WebGLTexture; gl: WebGL2RenderingContext } | null;
    __heroMouse?: { x: number; y: number; active: boolean };
  }
}

export default function HeroField({
  revealSrc,
  className = "",
}: {
  revealSrc?: string | null;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Gate on width + memory + motion only. (Not `pointer: fine` — it can
    // evaluate false at mount in some environments; on touch devices the
    // trail simply never gets splatted, which is a fine outcome anyway.)
    const nav = navigator as Navigator & { deviceMemory?: number };
    if (
      !motionOK() ||
      !window.matchMedia("(min-width: 1024px)").matches ||
      (nav.deviceMemory ?? 8) < 4
    )
      return;
    const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
    if (!gl) return;

    // ---- helpers ----
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error(gl.getShaderInfoLog(s));
      return s;
    };
    const program = (fs: string) => {
      const p = gl.createProgram()!;
      gl.attachShader(p, compile(gl.VERTEX_SHADER, VERT));
      gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fs));
      gl.linkProgram(p);
      return p;
    };
    const trailProg = program(TRAIL_FRAG);
    const compProg = program(COMP_FRAG);
    if (
      !gl.getProgramParameter(trailProg, gl.LINK_STATUS) ||
      !gl.getProgramParameter(compProg, gl.LINK_STATUS)
    )
      return;

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    for (const p of [trailProg, compProg]) {
      const loc = gl.getAttribLocation(p, "aPos");
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    }

    // ---- ping-pong trail buffers (low-res: fluid is soft anyway) ----
    const TW = 256, TH = 144;
    const mkTarget = () => {
      const tex = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TW, TH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer()!;
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return { tex, fb };
    };
    let a = mkTarget(), b = mkTarget();
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    // ---- optional reveal texture ----
    let revealTex: WebGLTexture | null = null;
    if (revealSrc) {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        revealTex = gl.createTexture();
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, revealTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      };
      img.src = revealSrc;
    }

    // ---- uniforms ----
    const U = (p: WebGLProgram, n: string) => gl.getUniformLocation(p, n);
    const tU = {
      prev: U(trailProg, "uPrev"), mouse: U(trailProg, "uMouse"), pmouse: U(trailProg, "uPrevMouse"),
      aspect: U(trailProg, "uAspect"), time: U(trailProg, "uTime"), active: U(trailProg, "uActive"), decay: U(trailProg, "uDecay"),
    };
    const cU = {
      trail: U(compProg, "uTrail"), reveal: U(compProg, "uReveal"), has: U(compProg, "uHasReveal"),
      time: U(compProg, "uTime"), aspect: U(compProg, "uAspect"),
      bg: U(compProg, "uBg"), line: U(compProg, "uLine"), accent: U(compProg, "uAccent"),
    };
    const hex = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255) as [number, number, number];
    const bg = hex("#0b0c0a"), lineC = hex("#f4f4ef"), acc = hex("#c6f24e");

    // ---- sizing ----
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ---- pointer (shared with the portrait canvas via window.__heroMouse) ----
    const target = { x: 0.5, y: 0.5 };
    const mouse = { x: 0.5, y: 0.5 };
    const prevMouse = { x: 0.5, y: 0.5 };
    let inside = false;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
      inside = target.x >= 0 && target.x <= 1 && target.y >= 0 && target.y <= 1;
    };
    const onLeave = () => { inside = false; };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    let raf = 0;
    const t0 = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const time = (performance.now() - t0) / 1000;
      prevMouse.x = mouse.x; prevMouse.y = mouse.y;
      mouse.x += (target.x - mouse.x) * 0.35;
      mouse.y += (target.y - mouse.y) * 0.35;
      window.__heroMouse = { x: mouse.x, y: mouse.y, active: inside };
      resize();
      const aspect = canvas.width / Math.max(1, canvas.height);

      // pass 1: trail feedback  a -> b
      gl.bindFramebuffer(gl.FRAMEBUFFER, b.fb);
      gl.viewport(0, 0, TW, TH);
      gl.useProgram(trailProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, a.tex);
      gl.uniform1i(tU.prev, 0);
      gl.uniform2f(tU.mouse, mouse.x, mouse.y);
      gl.uniform2f(tU.pmouse, prevMouse.x, prevMouse.y);
      gl.uniform1f(tU.aspect, aspect);
      gl.uniform1f(tU.time, time);
      gl.uniform1f(tU.active, inside ? 1 : 0);
      gl.uniform1f(tU.decay, 0.965);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // pass 2: composite to screen
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(compProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, b.tex);
      gl.uniform1i(cU.trail, 0);
      gl.activeTexture(gl.TEXTURE1);
      if (revealTex) gl.bindTexture(gl.TEXTURE_2D, revealTex);
      gl.uniform1i(cU.reveal, 1);
      gl.uniform1f(cU.has, revealTex ? 1 : 0);
      gl.uniform1f(cU.time, time);
      gl.uniform1f(cU.aspect, aspect);
      gl.uniform3f(cU.bg, ...bg);
      gl.uniform3f(cU.line, ...lineC);
      gl.uniform3f(cU.accent, ...acc);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      window.__heroTrail = { tex: b.tex, gl };
      [a, b] = [b, a];
    };
    raf = requestAnimationFrame(tick);
    setActive(true);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      ro.disconnect();
      io.disconnect();
      window.__heroTrail = null;
      setActive(false);
    };
  }, [revealSrc]);

  return (
    <canvas
      ref={canvasRef}
      data-hero-field
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-700 ${
        active ? "opacity-100" : "opacity-0"
      } ${className}`}
    />
  );
}
