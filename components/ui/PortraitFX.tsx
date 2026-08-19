"use client";

import { useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motionOK } from "@/lib/gsap";

/**
 * Hero portrait canvas: reveals a second "action" image inside the fluid ink
 * trail (landonorris hover move). The trail itself is a low-res mask owned by
 * HeroField (background canvas) — this canvas reads it back once per frame
 * via a tiny readPixels and uploads it as a texture, so the reveal on the face
 * is the SAME liquid stroke as the one parting the background contours.
 * Plus the cursor-displacement ripple: UVs pushed away from the lerped cursor,
 * strength driven by cursor velocity, with a chromatic fringe — the image
 * liquefies while you move and relaxes when you stop.
 *
 * Falls back to a soft-circle lens if HeroField isn't running, and to plain
 * next/image on mobile / reduced motion / no WebGL.
 */

const VERT = `
attribute vec2 aPos; varying vec2 vUv;
void main(){ vUv = aPos*0.5+0.5; gl_Position = vec4(aPos,0.,1.); }`;

const FRAG = `
precision mediump float;
varying vec2 vUv;
uniform sampler2D uTex, uTexAlt, uMask;
uniform vec4 uRect;      /* this canvas's rect in field-uv: x,y,w,h */
uniform float uUseMask, uHover, uAspect;
uniform vec2 uMouse;     /* uv space, lerped */
uniform float uStrength; /* 0..1, cursor-velocity driven ripple */

/* sample with a small RGB split along dir — the ripple's chromatic fringe */
vec4 sampleCA(sampler2D t, vec2 uv, vec2 dir, float ca) {
  vec4 c = texture2D(t, uv);
  c.r = texture2D(t, clamp(uv - dir * ca, 0.001, 0.999)).r;
  c.b = texture2D(t, clamp(uv + dir * ca, 0.001, 0.999)).b;
  return c;
}

void main(){
  /* --- displacement ripple: pushes away from the cursor, velocity-driven --- */
  vec2 d = vUv - uMouse; d.x *= uAspect;
  float dist = length(d);
  float force = exp(-dist * 8.0) * 0.09 * uStrength;
  vec2 dir = dist > 0.0001 ? normalize(vUv - uMouse) : vec2(0.0);
  vec2 uv = clamp(vUv - dir * force, 0.001, 0.999);
  float ca = force * 0.5;

  vec4 base = sampleCA(uTex, uv, dir, ca);
  vec4 alt  = sampleCA(uTexAlt, uv, dir, ca);

  /* --- reveal mask: shared fluid trail, else soft cursor lens --- */
  float m;
  if (uUseMask > 0.5) {
    vec2 fuv = uRect.xy + vUv * uRect.zw;
    m = smoothstep(0.06, 0.55, texture2D(uMask, fuv).r);
  } else {
    m = (1.0 - smoothstep(0.14, 0.26, dist)) * uHover;
  }
  gl_FragColor = mix(base, alt, m);
}`;

const TW = 256, TH = 144; // must match HeroField's trail buffer

export default function PortraitFX({
  image,
  altImage,
  alt,
  className = "",
}: {
  image: StaticImageData;
  altImage?: StaticImageData;
  alt: string;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const nav = navigator as Navigator & { deviceMemory?: number };
    if (
      !motionOK() ||
      !window.matchMedia("(min-width: 1024px)").matches ||
      (nav.deviceMemory ?? 8) < 4
    )
      return;
    const gl = canvas.getContext("webgl", { alpha: true, premultipliedAlpha: false, antialias: false });
    if (!gl) return;

    const compile = (t: number, s: string) => { const sh = gl.createShader(t)!; gl.shaderSource(sh, s); gl.compileShader(sh); return sh; };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const U = (n: string) => gl.getUniformLocation(prog, n);
    const uRect = U("uRect"), uUseMask = U("uUseMask"), uHover = U("uHover"), uAspect = U("uAspect"), uMouse = U("uMouse"), uStrength = U("uStrength");
    gl.uniform1i(U("uTex"), 0);
    gl.uniform1i(U("uTexAlt"), 1);
    gl.uniform1i(U("uMask"), 2);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const setParams = () => {
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };

    // mask texture (uploaded from HeroField's trail each frame)
    const maskTex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE2);
    gl.bindTexture(gl.TEXTURE_2D, maskTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, TW, TH, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    setParams();
    const maskPixels = new Uint8Array(TW * TH * 4);

    let loaded = 0, ready = false;
    const loadTexture = (unit: number, src: string) => {
      const tex = gl.createTexture();
      const img = new window.Image();
      img.onload = () => {
        gl.activeTexture(gl.TEXTURE0 + unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        setParams();
        if (++loaded === 2) { ready = true; resize(); render(); setActive(true); }
      };
      img.src = src;
    };
    loadTexture(0, image.src);
    loadTexture(1, (altImage ?? image).src);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
      if (w && h && (canvas.width !== w || canvas.height !== h)) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // cursor state: lerped position + velocity-driven ripple strength
    // (hover is only used by the fallback lens when HeroField isn't running)
    const target = { x: 0.5, y: 0.5 }, mouse = { x: 0.5, y: 0.5 };
    let strength = 0, hover = 0, inside = false;
    const onMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      if (!r.width) return;
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
      inside = target.x > -0.05 && target.x < 1.05 && target.y > -0.05 && target.y < 1.05;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);

    // this canvas's rect inside the field canvas (both fill the hero card)
    let rect = [0, 0, 1, 1];
    const measure = () => {
      const field = document.querySelector<HTMLCanvasElement>("[data-hero-field]");
      if (!field) return;
      const f = field.getBoundingClientRect(), c = canvas.getBoundingClientRect();
      if (!f.width || !f.height) return;
      const x = (c.left - f.left) / f.width;
      const yTop = (c.top - f.top) / f.height;
      const w = c.width / f.width, h = c.height / f.height;
      rect = [x, 1 - yTop - h, w, h]; // flip to GL uv (origin bottom-left)
    };

    const render = () => {
      const shared = window.__heroTrail;
      let useMask = 0;
      if (shared) {
        // pull the trail from the field's GL context (tiny 256×144 readback)
        const fgl = shared.gl;
        const fb = fgl.createFramebuffer();
        fgl.bindFramebuffer(fgl.FRAMEBUFFER, fb);
        fgl.framebufferTexture2D(fgl.FRAMEBUFFER, fgl.COLOR_ATTACHMENT0, fgl.TEXTURE_2D, shared.tex, 0);
        fgl.readPixels(0, 0, TW, TH, fgl.RGBA, fgl.UNSIGNED_BYTE, maskPixels);
        fgl.bindFramebuffer(fgl.FRAMEBUFFER, null);
        fgl.deleteFramebuffer(fb);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, maskTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, TW, TH, gl.RGBA, gl.UNSIGNED_BYTE, maskPixels);
        measure();
        useMask = 1;
      }
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform4f(uRect, rect[0], rect[1], rect[2], rect[3]);
      gl.uniform1f(uUseMask, useMask);
      gl.uniform1f(uHover, hover);
      gl.uniform1f(uAspect, canvas.width / Math.max(1, canvas.height));
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uStrength, strength);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!ready || !visible) return;
      // lerped cursor; ripple strength rises with velocity, relaxes when still
      const dx = target.x - mouse.x, dy = target.y - mouse.y;
      mouse.x += dx * 0.1;
      mouse.y += dy * 0.1;
      const vel = Math.min(1, Math.hypot(dx, dy) * 14);
      strength += (vel - strength) * (vel > strength ? 0.2 : 0.05);
      hover += ((inside ? 1 : 0) - hover) * (inside ? 0.22 : 0.12);
      resize();
      render();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      io.disconnect();
      setActive(false);
    };
  }, [image.src, altImage]);

  return (
    <div className={`relative h-full ${className}`} style={{ aspectRatio: `${image.width} / ${image.height}` }}>
      <Image
        src={image}
        alt={alt}
        priority
        placeholder="blur"
        className={`h-full w-auto select-none object-contain object-bottom transition-opacity duration-300 ${active ? "opacity-0" : "opacity-100"}`}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${active ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}
