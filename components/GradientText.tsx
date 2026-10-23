"use client";

import { Fragment, useEffect, useRef, useState } from "react";

const VERTEX = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Flowing domain-warped noise, masked by the rendered text. Near the pointer the
// letters wobble and the colors swirl away from it.
const FRAGMENT = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uHover;
uniform sampler2D uMask;
uniform vec3 uC1;
uniform vec3 uC2;
uniform vec3 uC3;
uniform vec3 uC4;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  float aspect = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 0.9;
  vec2 m = (uMouse - 0.5) * vec2(aspect, 1.0) * 0.9;
  float t = uTime;

  float d = length(p - m);
  float influence = uHover * exp(-d * d * 5.0);

  vec2 wobble = vec2(snoise(uv * vec2(9.0, 4.0) + t * 0.8), snoise(uv * vec2(9.0, 4.0) - t * 0.8 + 3.1));
  float mask = texture2D(uMask, uv + wobble * 0.01 * influence).a;
  if (mask < 0.003) {
    gl_FragColor = vec4(0.0);
    return;
  }

  vec2 q = vec2(
    snoise(p * 0.6 + vec2(t * 0.05, -t * 0.04)),
    snoise(p * 0.6 + vec2(-t * 0.045, t * 0.035) + 5.2)
  );
  vec2 w = p + q * 0.65 + (p - m) * influence * 0.45;

  float wave = w.x * 0.9 + w.y * 1.4 + sin(w.y * 2.2 + t * 0.15) * 0.4 + snoise(w * 0.8 + t * 0.03) * 0.35;
  float bands = sin(wave * 3.14159);
  float ribbon = pow(1.0 - abs(sin(wave * 1.5708 + 0.4)), 9.0);
  float n = snoise(w * 1.1 - t * 0.03) * 0.5 + 0.5;

  vec3 col = mix(uC1, uC2, smoothstep(-0.9, 0.9, bands));
  col = mix(col, uC3, smoothstep(0.4, 0.95, n) * 0.85);
  col = mix(col, uC4, clamp(ribbon * 0.85 + influence * 0.35, 0.0, 1.0));

  float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * 0.06;

  gl_FragColor = vec4(col * mask, mask);
}
`;

type RGB = [number, number, number];
const STOPS = ["--g1", "--g2", "--g3", "--g4"];

function hexToRgb(hex: string): RGB {
  let h = hex.replace("#", "").trim();
  if (h.length === 3) h = [...h].map((c) => c + c).join("");
  const n = parseInt(h, 16) || 0;
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function readStops(el: Element): RGB[] {
  const style = getComputedStyle(el);
  return STOPS.map((name) => hexToRgb(style.getPropertyValue(name)));
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  return shader;
}

/**
 * Giant uppercase text that fills its container's width, with an animated WebGL
 * gradient flowing inside the letters. The real text stays in the DOM (for screen
 * readers, selection and as a CSS-gradient fallback); the canvas draws on top.
 * `words` render on one line from the md breakpoint up, one word per line below it.
 */
export function GradientText({
  words,
  as: Tag = "p",
  className = "",
  seed = 0,
}: {
  words: string[];
  as?: "h1" | "h2" | "p" | "span";
  className?: string;
  seed?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [glOn, setGlOn] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const text = textRef.current!;
    const canvas = canvasRef.current!;
    const lines = [...text.querySelectorAll<HTMLElement>("[data-word]")];
    const supportsLetterSpacing = "letterSpacing" in CanvasRenderingContext2D.prototype;
    // Without canvas letter-spacing the canvas glyphs would be wider than the DOM ones.
    if (!supportsLetterSpacing) text.style.letterSpacing = "0";

    // Size the font so the widest visual line exactly fills the container.
    let lastWidth = 0;
    const fit = () => {
      wrap.style.fontSize = "100px";
      const rows = new Map<number, { left: number; right: number }>();
      for (const el of lines) {
        const r = el.getBoundingClientRect();
        const key = Math.round(r.top);
        const row = rows.get(key);
        rows.set(key, { left: Math.min(row?.left ?? r.left, r.left), right: Math.max(row?.right ?? r.right, r.right) });
      }
      const natural = Math.max(...[...rows.values()].map((r) => r.right - r.left));
      wrap.style.fontSize = `${(wrap.clientWidth / natural) * 100 * 0.995}px`;
    };

    const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: true, alpha: true });
    const program = gl?.createProgram();
    if (gl && program) {
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, VERTEX));
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, FRAGMENT));
      gl.linkProgram(program);
    }
    const glUsable = gl && program && gl.getProgramParameter(program, gl.LINK_STATUS);

    if (!gl || !program || !glUsable) {
      // CSS gradient fallback: just keep the text fitted.
      const ro = new ResizeObserver(() => {
        if (wrap.clientWidth !== lastWidth) {
          lastWidth = wrap.clientWidth;
          fit();
        }
      });
      document.fonts.ready.then(() => ro.observe(wrap));
      return () => ro.disconnect();
    }

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(program, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    const u = (name: string) => gl.getUniformLocation(program, name);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    const uHover = u("uHover");
    const uColors = ["uC1", "uC2", "uC3", "uC4"].map(u);
    gl.uniform1i(u("uMask"), 0);

    const maskCanvas = document.createElement("canvas");
    const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
    let target = readStops(wrap);
    const current = target.map((c) => [...c] as RGB);
    const mouse = { x: 0.5, y: 0.5, hover: 0, targetHover: 0 };
    let time = seed;
    let last = 0;
    let raf = 0;
    let running = false;
    let visible = true;
    let ready = false;

    // Rasterize each word exactly where the (invisible) DOM word sits.
    const drawMask = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      maskCanvas.width = canvas.width;
      maskCanvas.height = canvas.height;
      const ctx = maskCanvas.getContext("2d")!;
      const style = getComputedStyle(text);
      const fontPx = parseFloat(style.fontSize);
      ctx.font = `${style.fontWeight} ${fontPx * dpr}px ${style.fontFamily}`;
      if (supportsLetterSpacing) {
        const ls = style.letterSpacing === "normal" ? 0 : parseFloat(style.letterSpacing);
        ctx.letterSpacing = `${ls * dpr}px`;
      }
      ctx.fillStyle = "#fff";
      ctx.textBaseline = "alphabetic";
      // CSS centers the font's ascent+descent box in the line box; mirror that so every
      // word sits on the same baseline as its DOM counterpart.
      const metrics = ctx.measureText("H");
      const ascent = metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
      const descent = metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent;
      for (const el of lines) {
        const r = el.getBoundingClientRect();
        const word = style.textTransform === "uppercase" ? el.textContent!.toUpperCase() : el.textContent!;
        const centerY = (r.top - rect.top + r.height / 2) * dpr;
        ctx.fillText(word, (r.left - rect.left) * dpr, centerY + (ascent - descent) / 2);
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCanvas);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (ease: number) => {
      current.forEach((c, i) => {
        for (let k = 0; k < 3; k++) c[k] += (target[i][k] - c[k]) * ease;
        gl.uniform3fv(uColors[i], c);
      });
      mouse.hover += (mouse.targetHover - mouse.hover) * Math.min(1, ease * 1.5);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, time);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uHover, reduceMotion.matches ? 0 : mouse.hover);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const frame = (now: number) => {
      time += Math.min((now - last) / 1000, 0.1);
      last = now;
      draw(0.06);
      raf = requestAnimationFrame(frame);
    };

    const sync = () => {
      if (!ready) return;
      const shouldRun = visible && !document.hidden && !reduceMotion.matches;
      if (shouldRun && !running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
      if (!running) draw(1);
    };

    const layout = () => {
      fit();
      drawMask();
      if (!running) draw(1);
    };

    const resizeObserver = new ResizeObserver(() => {
      if (wrap.clientWidth === lastWidth) return;
      lastWidth = wrap.clientWidth;
      layout();
    });
    const intersection = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    const themeObserver = new MutationObserver(() => {
      target = readStops(wrap);
      if (!running) draw(1);
    });
    const onPointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) / r.width;
      mouse.y = 1 - (e.clientY - r.top) / r.height;
      const pad = 80;
      const inside =
        e.clientX > r.left - pad && e.clientX < r.right + pad && e.clientY > r.top - pad && e.clientY < r.bottom + pad;
      mouse.targetHover = inside ? 1 : 0;
    };
    const onLost = (e: Event) => {
      e.preventDefault();
      running = false;
      cancelAnimationFrame(raf);
      setGlOn(false);
    };

    let cancelled = false;
    document.fonts.ready.then(() => {
      if (cancelled) return;
      lastWidth = wrap.clientWidth;
      layout();
      ready = true;
      resizeObserver.observe(wrap);
      intersection.observe(wrap);
      sync();
      setGlOn(true);
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    window.addEventListener("pointermove", onPointer, { passive: true });
    canvas.addEventListener("webglcontextlost", onLost);
    document.addEventListener("visibilitychange", sync);
    reduceMotion.addEventListener("change", sync);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      themeObserver.disconnect();
      window.removeEventListener("pointermove", onPointer);
      canvas.removeEventListener("webglcontextlost", onLost);
      document.removeEventListener("visibilitychange", sync);
      reduceMotion.removeEventListener("change", sync);
    };
  }, [seed]);

  return (
    <div
      ref={wrapRef}
      data-gl={glOn ? "on" : "off"}
      className={`relative text-[17vw] md:text-[12vw] ${className}`}
    >
      <Tag
        ref={textRef as React.Ref<HTMLHeadingElement>}
        className="gt-text block whitespace-nowrap font-display text-[length:inherit] font-extrabold uppercase leading-[0.84] tracking-[-0.045em]"
      >
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <>
                <br className="md:hidden" />
                <span className="hidden md:inline"> </span>
              </>
            )}
            <span data-word className="inline-block">
              {word}
            </span>
          </Fragment>
        ))}
      </Tag>
      <canvas
        ref={canvasRef}
        aria-hidden
        className={`pointer-events-none absolute -top-[0.12em] left-0 h-[calc(100%+0.24em)] w-full transition-opacity duration-700 ${
          glOn ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
