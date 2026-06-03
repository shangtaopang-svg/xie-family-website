import React, { useMemo, useRef, useEffect } from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";

/* ============================================================
   Sailboat Floating at the Center of the Universe
   Canvas 2D — stars, nebula, sailboat, cosmic particles
   ============================================================ */

// ---- Star field ----
interface Star {
  x: number;
  y: number;
  r: number;
  phase: number;
  speed: number;
  brightness: number;
}

function generateStars(w: number, h: number, count: number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r: 0.3 + Math.random() * 2.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.3 + Math.random() * 1.2,
      brightness: 0.3 + Math.random() * 0.7,
    });
  }
  return stars;
}

// ---- Nebula blobs ----
interface NebulaBlob {
  cx: number;
  cy: number;
  r: number;
  color: [number, number, number];
  driftX: number;
  driftY: number;
  phase: number;
}

function generateNebula(w: number, h: number): NebulaBlob[] {
  const colors: [number, number, number][] = [
    [80, 40, 160],   // purple
    [20, 60, 140],   // blue
    [140, 40, 120],  // magenta
    [30, 80, 130],   // cyan-blue
    [100, 30, 80],   // deep pink
  ];
  const blobs: NebulaBlob[] = [];
  for (let i = 0; i < 8; i++) {
    blobs.push({
      cx: w * 0.15 + Math.random() * w * 0.7,
      cy: h * 0.15 + Math.random() * h * 0.7,
      r: 80 + Math.random() * 250,
      color: colors[i % colors.length],
      driftX: (Math.random() - 0.5) * 0.3,
      driftY: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
    });
  }
  return blobs;
}

// ---- Cosmic particles ----
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  life: number;
  maxLife: number;
}

function generateParticles(count: number): Particle[] {
  const ps: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const dist = 50 + Math.random() * 800;
    const maxLife = 100 + Math.random() * 200;
    ps.push({
      x: 960 + Math.cos(angle) * dist,
      y: 540 + Math.sin(angle) * dist,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: 0.5 + Math.random() * 2,
      alpha: 0.2 + Math.random() * 0.5,
      life: Math.random() * maxLife,
      maxLife,
    });
  }
  return ps;
}

// ---- Sailboat hull points ----
function sailboatPoints(cx: number, cy: number, scale: number, rotation: number) {
  const cos = Math.cos(rotation);
  const sin = Math.sin(rotation);
  const rot = (x: number, y: number) => [cos * x - sin * y + cx, sin * x + cos * y + cy] as const;

  return {
    // Hull
    hull: [
      rot(-45 * scale, 0),
      rot(-35 * scale, 10 * scale),
      rot(-20 * scale, 15 * scale),
      rot(20 * scale, 15 * scale),
      rot(35 * scale, 10 * scale),
      rot(45 * scale, 0),
      rot(30 * scale, -2 * scale),
      rot(-30 * scale, -2 * scale),
    ],
    // Mast
    mastTop: rot(0, -65 * scale),
    mastBottom: rot(0, 10 * scale),
    // Main sail (curved triangle)
    mainSail: [
      rot(0, -60 * scale),
      rot(30 * scale, 5 * scale),
      rot(2 * scale, 5 * scale),
    ],
    // Jib sail
    jibSail: [
      rot(0, -55 * scale),
      rot(-25 * scale, 5 * scale),
      rot(-2 * scale, 5 * scale),
    ],
  };
}

// ---- Draw nebula glow ----
function drawNebula(ctx: CanvasRenderingContext2D, blobs: NebulaBlob[], frame: number, w: number, h: number) {
  for (const b of blobs) {
    const dx = Math.sin(frame * 0.005 + b.phase) * b.driftX * 30;
    const dy = Math.cos(frame * 0.007 + b.phase) * b.driftY * 30;
    const pulse = 1 + Math.sin(frame * 0.01 + b.phase) * 0.08;

    const gradient = ctx.createRadialGradient(
      b.cx + dx, b.cy + dy, 0,
      b.cx + dx, b.cy + dy, b.r * pulse
    );
    const [r, g, bl] = b.color;
    gradient.addColorStop(0, `rgba(${r},${g},${bl},0.06)`);
    gradient.addColorStop(0.5, `rgba(${r},${g},${bl},0.03)`);
    gradient.addColorStop(1, `rgba(${r},${g},${bl},0)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
  }
}

// ---- Draw stars ----
function drawStars(ctx: CanvasRenderingContext2D, stars: Star[], frame: number) {
  for (const s of stars) {
    const twinkle = 0.5 + 0.5 * Math.sin(frame * 0.03 * s.speed + s.phase);
    const alpha = s.brightness * (0.4 + 0.6 * twinkle);
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();

    // Glow for bright stars
    if (s.r > 1.8) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,255,${alpha * 0.15})`;
      ctx.fill();
    }
  }
}

// ---- Draw cosmic particles ----
function drawParticles(ctx: CanvasRenderingContext2D, particles: Particle[], frame: number, w: number, h: number) {
  for (const p of particles) {
    const age = (frame + p.life) % p.maxLife;
    const progress = age / p.maxLife;
    if (progress > 0.95) continue;

    const x = p.x + p.vx * age;
    const y = p.y + p.vy * age;
    const alpha = p.alpha * (1 - progress);

    ctx.beginPath();
    ctx.arc(x, y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(180,200,255,${alpha})`;
    ctx.fill();
  }
}

// ---- Draw sailboat ----
function drawSailboat(ctx: CanvasRenderingContext2D, frame: number, w: number, h: number) {
  const cx = w / 2;
  const cy = h / 2;

  // Gentle bobbing and rotation
  const bobY = Math.sin(frame * 0.025) * 4;
  const bobRot = Math.sin(frame * 0.02) * 0.03;

  const scale = 2.8;
  const parts = sailboatPoints(cx, cy + bobY, scale, bobRot);

  // ---- Glow behind sailboat ----
  const glowGrad = ctx.createRadialGradient(cx, cy + bobY, 0, cx, cy + bobY, 200);
  glowGrad.addColorStop(0, "rgba(100,150,255,0.08)");
  glowGrad.addColorStop(0.5, "rgba(100,150,255,0.03)");
  glowGrad.addColorStop(1, "rgba(100,150,255,0)");
  ctx.fillStyle = glowGrad;
  ctx.fillRect(0, 0, w, h);

  // ---- Hull ----
  ctx.beginPath();
  ctx.moveTo(parts.hull[0][0], parts.hull[0][1]);
  for (let i = 1; i < parts.hull.length; i++) {
    ctx.lineTo(parts.hull[i][0], parts.hull[i][1]);
  }
  ctx.closePath();
  ctx.fillStyle = "#2a1a0a";
  ctx.fill();
  ctx.strokeStyle = "rgba(180,140,100,0.6)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // ---- Deck line ----
  ctx.beginPath();
  ctx.moveTo(parts.hull[6][0], parts.hull[6][1]);
  ctx.lineTo(parts.hull[7][0], parts.hull[7][1]);
  ctx.strokeStyle = "rgba(200,160,120,0.4)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // ---- Mast ----
  ctx.beginPath();
  ctx.moveTo(parts.mastBottom[0], parts.mastBottom[1]);
  ctx.lineTo(parts.mastTop[0], parts.mastTop[1]);
  ctx.strokeStyle = "rgba(180,140,100,0.7)";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // ---- Main sail (right) ----
  ctx.beginPath();
  ctx.moveTo(parts.mainSail[0][0], parts.mainSail[0][1]);
  ctx.quadraticCurveTo(
    (parts.mainSail[0][0] + parts.mainSail[1][0]) / 2 + 15 * scale,
    (parts.mainSail[0][1] + parts.mainSail[1][1]) / 2 - 5 * scale,
    parts.mainSail[1][0], parts.mainSail[1][1]
  );
  ctx.lineTo(parts.mainSail[2][0], parts.mainSail[2][1]);
  ctx.closePath();

  const sailGrad = ctx.createLinearGradient(0, parts.mainSail[0][1], 0, parts.mainSail[1][1]);
  sailGrad.addColorStop(0, "rgba(255,255,255,0.9)");
  sailGrad.addColorStop(0.5, "rgba(240,240,245,0.7)");
  sailGrad.addColorStop(1, "rgba(200,200,220,0.4)");
  ctx.fillStyle = sailGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(180,180,200,0.3)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // ---- Jib sail (left) ----
  ctx.beginPath();
  ctx.moveTo(parts.jibSail[0][0], parts.jibSail[0][1]);
  ctx.quadraticCurveTo(
    (parts.jibSail[0][0] + parts.jibSail[1][0]) / 2 - 12 * scale,
    (parts.jibSail[0][1] + parts.jibSail[1][1]) / 2,
    parts.jibSail[1][0], parts.jibSail[1][1]
  );
  ctx.lineTo(parts.jibSail[2][0], parts.jibSail[2][1]);
  ctx.closePath();
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fill();
  ctx.strokeStyle = "rgba(180,180,200,0.2)";
  ctx.lineWidth = 1;
  ctx.stroke();

  // ---- Mast top glow ----
  const mastGlow = ctx.createRadialGradient(
    parts.mastTop[0], parts.mastTop[1], 0,
    parts.mastTop[0], parts.mastTop[1], 15
  );
  mastGlow.addColorStop(0, "rgba(200,220,255,0.3)");
  mastGlow.addColorStop(1, "rgba(200,220,255,0)");
  ctx.fillStyle = mastGlow;
  ctx.fillRect(parts.mastTop[0] - 15, parts.mastTop[1] - 15, 30, 30);

  // ---- Light reflection on water (bottom glow) ----
  const reflGrad = ctx.createRadialGradient(cx, cy + bobY + 30 * scale, 0, cx, cy + bobY + 30 * scale, 60);
  reflGrad.addColorStop(0, "rgba(150,200,255,0.06)");
  reflGrad.addColorStop(1, "rgba(150,200,255,0)");
  ctx.fillStyle = reflGrad;
  ctx.fillRect(cx - 60, cy + bobY + 30 * scale - 60, 120, 120);
}

// ============================================================

export const SailboatUniverse: React.FC = () => {
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const stars = useMemo(() => generateStars(width, height, 600), [width, height]);
  const nebula = useMemo(() => generateNebula(width, height), [width, height]);
  const particles = useMemo(() => generateParticles(120), []);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const w = width;
    const h = height;

    // ---- Background ----
    const bgGrad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.8);
    bgGrad.addColorStop(0, "#0a0a2e");
    bgGrad.addColorStop(0.3, "#060620");
    bgGrad.addColorStop(0.6, "#030314");
    bgGrad.addColorStop(1, "#010108");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);

    // ---- Nebula ----
    drawNebula(ctx, nebula, frame, w, h);

    // ---- Stars ----
    drawStars(ctx, stars, frame);

    // ---- Particles ----
    drawParticles(ctx, particles, frame, w, h);

    // ---- Sailboat ----
    drawSailboat(ctx, frame, w, h);

  }, [frame, width, height, stars, nebula, particles]);

  return (
    <AbsoluteFill>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{ width, height }}
      />
    </AbsoluteFill>
  );
};
