"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMemo, useRef } from "react";

type SheetConfig = {
  x: number;
  y: number;
  z: number;
  scaleX: number;
  scaleY: number;
  color: string;
  opacity: number;
  speed: number;
  driftX: number;
  driftY: number;
  offset: number;
  rotation: number;
};

function createSoftRadialTexture({
  innerColor,
  midColor,
  outerColor,
  size = 1024,
}: {
  innerColor: string;
  midColor: string;
  outerColor: string;
  size?: number;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.04,
    size / 2,
    size / 2,
    size / 2,
  );

  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(0.38, midColor);
  gradient.addColorStop(1, outerColor);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createNebulaTexture({
  tintA,
  tintB,
  size = 1024,
}: {
  tintA: string;
  tintB: string;
  size?: number;
}) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  ctx.clearRect(0, 0, size, size);

  const base = ctx.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.08,
    size / 2,
    size / 2,
    size / 2,
  );
  base.addColorStop(0, tintA);
  base.addColorStop(0.45, tintB);
  base.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);

  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < 18; i += 1) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const rx = size * (0.12 + Math.random() * 0.18);
    const ry = size * (0.05 + Math.random() * 0.12);

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * Math.PI);
    ctx.scale(1, ry / rx);

    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, "rgba(255,255,255,0.18)");
    g.addColorStop(0.35, "rgba(220,225,255,0.12)");
    g.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  ctx.globalCompositeOperation = "source-over";

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function createDustTexture(size = 128) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;

  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture();

  const gradient = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.25, "rgba(255,255,255,0.9)");
  gradient.addColorStop(0.55, "rgba(255,255,255,0.18)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function AtmosphericSheets() {
  const refs = useRef<THREE.Sprite[]>([]);

  const textures = useMemo(
    () => ({
      coolLarge: createNebulaTexture({
        tintA: "rgba(192, 208, 255, 0.95)",
        tintB: "rgba(102, 130, 220, 0.16)",
      }),
      indigoLarge: createNebulaTexture({
        tintA: "rgba(170, 164, 255, 0.9)",
        tintB: "rgba(118, 98, 210, 0.14)",
      }),
      blueLarge: createNebulaTexture({
        tintA: "rgba(168, 194, 255, 0.9)",
        tintB: "rgba(76, 112, 205, 0.14)",
      }),
      warmSoft: createSoftRadialTexture({
        innerColor: "rgba(255, 224, 210, 0.95)",
        midColor: "rgba(235, 170, 145, 0.18)",
        outerColor: "rgba(0,0,0,0)",
      }),
      coolSoft: createSoftRadialTexture({
        innerColor: "rgba(220, 228, 255, 0.95)",
        midColor: "rgba(150, 170, 255, 0.18)",
        outerColor: "rgba(0,0,0,0)",
      }),
    }),
    [],
  );

  const sheets = useMemo<SheetConfig[]>(
    () => [
      {
        x: 0,
        y: 2.4,
        z: -4,
        scaleX: 28,
        scaleY: 12,
        color: "#d8e1ff",
        opacity: 0.12,
        speed: 0.05,
        driftX: 0.12,
        driftY: 0.06,
        offset: 0.0,
        rotation: 0.02,
      },
      {
        x: -6.8,
        y: 0.7,
        z: -4,
        scaleX: 18,
        scaleY: 10,
        color: "#7ea2ff",
        opacity: 0.105,
        speed: 0.06,
        driftX: 0.18,
        driftY: 0.08,
        offset: 1.2,
        rotation: -0.18,
      },
      {
        x: 6.6,
        y: 0.8,
        z: -4,
        scaleX: 18,
        scaleY: 10,
        color: "#a894ff",
        opacity: 0.095,
        speed: 0.055,
        driftX: 0.18,
        driftY: 0.07,
        offset: 2.1,
        rotation: 0.16,
      },
      {
        x: 0,
        y: -1.8,
        z: -3,
        scaleX: 22,
        scaleY: 5.8,
        color: "#f0d4c8",
        opacity: 0.055,
        speed: 0.045,
        driftX: 0.08,
        driftY: 0.03,
        offset: 0.7,
        rotation: 0.0,
      },
      {
        x: -2.8,
        y: -0.8,
        z: -2,
        scaleX: 11,
        scaleY: 5.4,
        color: "#b4c5ff",
        opacity: 0.07,
        speed: 0.065,
        driftX: 0.14,
        driftY: 0.05,
        offset: 3.6,
        rotation: -0.22,
      },
      {
        x: 2.9,
        y: -0.7,
        z: -2,
        scaleX: 11,
        scaleY: 5.4,
        color: "#cfb7ff",
        opacity: 0.068,
        speed: 0.06,
        driftX: 0.13,
        driftY: 0.05,
        offset: 4.2,
        rotation: 0.22,
      },
    ],
    [],
  );

  const maps = [
    textures.coolLarge,
    textures.blueLarge,
    textures.indigoLarge,
    textures.warmSoft,
    textures.coolSoft,
    textures.coolSoft,
  ];

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    refs.current.forEach((sprite, i) => {
      const cfg = sheets[i];
      if (!sprite) return;

      sprite.position.x = cfg.x + Math.sin(t * cfg.speed + cfg.offset) * cfg.driftX;
      sprite.position.y = cfg.y + Math.cos(t * cfg.speed * 1.15 + cfg.offset) * cfg.driftY;
      sprite.material.opacity =
        cfg.opacity + Math.sin(t * (cfg.speed * 1.8) + cfg.offset) * 0.012;
      sprite.material.rotation =
        cfg.rotation + Math.sin(t * cfg.speed * 0.6 + cfg.offset) * 0.02;
    });
  });

  return (
    <group>
      {sheets.map((cfg, i) => (
        <sprite
          key={i}
          ref={(node) => {
            if (node) refs.current[i] = node;
          }}
          position={[cfg.x, cfg.y, cfg.z]}
          scale={[cfg.scaleX, cfg.scaleY, 1]}
        >
          <spriteMaterial
            map={maps[i]}
            color={cfg.color}
            transparent
            opacity={cfg.opacity}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </sprite>
      ))}
    </group>
  );
}

function ReflectionLayer() {
  const refs = useRef<THREE.Sprite[]>([]);

  const textures = useMemo(
    () => ({
      horizonCore: createSoftRadialTexture({
        innerColor: "rgba(255, 233, 246, 0.95)",
        midColor: "rgba(210, 180, 255, 0.18)",
        outerColor: "rgba(0,0,0,0)",
      }),
      horizonSpread: createSoftRadialTexture({
        innerColor: "rgba(180, 200, 255, 0.85)",
        midColor: "rgba(120, 140, 235, 0.16)",
        outerColor: "rgba(0,0,0,0)",
      }),
      warmPools: createSoftRadialTexture({
        innerColor: "rgba(255, 220, 198, 0.8)",
        midColor: "rgba(255, 180, 148, 0.12)",
        outerColor: "rgba(0,0,0,0)",
      }),
    }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((sprite, i) => {
      if (!sprite) return;
      const base = i === 0 ? 0.14 : i === 1 ? 0.06 : 0.04;
      const speed = i === 0 ? 0.18 : i === 1 ? 0.1 : 0.14;
      sprite.material.opacity = base + Math.sin(t * speed + i) * 0.01;
    });
  });

  return (
    <group>
      <sprite
        ref={(node) => {
          if (node) refs.current[0] = node;
        }}
        position={[0, -2.95, -1]}
        scale={[9.5, 1.35, 1]}
      >
        <spriteMaterial
          map={textures.horizonCore}
          color="#ffd8f3"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <sprite
        ref={(node) => {
          if (node) refs.current[1] = node;
        }}
        position={[0, -2.55, -2]}
        scale={[18, 4.2, 1]}
      >
        <spriteMaterial
          map={textures.horizonSpread}
          color="#aabaff"
          transparent
          opacity={0.06}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <sprite
        ref={(node) => {
          if (node) refs.current[2] = node;
        }}
        position={[4.8, -2.7, -1]}
        scale={[4.2, 1.2, 1]}
      >
        <spriteMaterial
          map={textures.warmPools}
          color="#ffd8c6"
          transparent
          opacity={0.04}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <sprite position={[-4.9, -2.78, -1]} scale={[3.6, 1.05, 1]}>
        <spriteMaterial
          map={textures.warmPools}
          color="#cfe0ff"
          transparent
          opacity={0.03}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

function SparseStars() {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 180;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 28;
      pos[i3 + 1] = -1 + Math.random() * 12;
      pos[i3 + 2] = -7 + Math.random() * 4;
    }

    return pos;
  }, []);

  const texture = useMemo(() => createDustTexture(96), []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.02) * 0.015;
    pointsRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.015) * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        color="#dce5ff"
        size={0.11}
        sizeAttenuation
        transparent
        opacity={0.42}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function ForegroundMists() {
  const refs = useRef<THREE.Sprite[]>([]);

  const textures = useMemo(
    () => ({
      frontCool: createSoftRadialTexture({
        innerColor: "rgba(205, 216, 255, 0.92)",
        midColor: "rgba(145, 160, 255, 0.16)",
        outerColor: "rgba(0,0,0,0)",
      }),
      frontIndigo: createSoftRadialTexture({
        innerColor: "rgba(196, 184, 255, 0.88)",
        midColor: "rgba(126, 112, 220, 0.14)",
        outerColor: "rgba(0,0,0,0)",
      }),
    }),
    [],
  );

  const cfg = useMemo(
    () => [
      { x: -6.8, y: -0.2, z: 0, sx: 10, sy: 13, o: 0.045, s: 0.06, off: 0.4 },
      { x: 7.1, y: 0.0, z: 0, sx: 10, sy: 13, o: 0.04, s: 0.055, off: 1.6 },
      { x: 0, y: 3.7, z: -1, sx: 14, sy: 6, o: 0.05, s: 0.04, off: 2.8 },
    ],
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    refs.current.forEach((sprite, i) => {
      const c = cfg[i];
      if (!sprite) return;
      sprite.material.opacity = c.o + Math.sin(t * c.s + c.off) * 0.008;
      sprite.position.x = c.x + Math.sin(t * c.s + c.off) * 0.08;
    });
  });

  return (
    <group>
      <sprite
        ref={(node) => {
          if (node) refs.current[0] = node;
        }}
        position={[cfg[0].x, cfg[0].y, cfg[0].z]}
        scale={[cfg[0].sx, cfg[0].sy, 1]}
      >
        <spriteMaterial
          map={textures.frontCool}
          color="#90a8ff"
          transparent
          opacity={cfg[0].o}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <sprite
        ref={(node) => {
          if (node) refs.current[1] = node;
        }}
        position={[cfg[1].x, cfg[1].y, cfg[1].z]}
        scale={[cfg[1].sx, cfg[1].sy, 1]}
      >
        <spriteMaterial
          map={textures.frontIndigo}
          color="#9e8dff"
          transparent
          opacity={cfg[1].o}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>

      <sprite
        ref={(node) => {
          if (node) refs.current[2] = node;
        }}
        position={[cfg[2].x, cfg[2].y, cfg[2].z]}
        scale={[cfg[2].sx, cfg[2].sy, 1]}
      >
        <spriteMaterial
          map={textures.frontCool}
          color="#bfd0ff"
          transparent
          opacity={cfg[2].o}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </sprite>
    </group>
  );
}

function DustVeil() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const count = 240;
    const pos = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 18;
      pos[i3 + 1] = -3.2 + Math.random() * 6.2;
      pos[i3 + 2] = -1 + Math.random() * 3;
    }

    return pos;
  }, []);

  const texture = useMemo(() => createDustTexture(80), []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.03) * 0.015;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        map={texture}
        color="#ffffff"
        size={0.15}
        sizeAttenuation
        transparent
        opacity={0.14}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function SolaverseScene() {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.06) * 0.05;
    group.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.02) * 0.006;
  });

  return (
    <group ref={group}>
      <fog attach="fog" args={["#03050b", 10, 24]} />
      <ambientLight intensity={0.42} />
      <directionalLight position={[0, 5, 7]} intensity={0.26} color="#c4d3ff" />
      <AtmosphericSheets />
      <ReflectionLayer />
      <SparseStars />
      <ForegroundMists />
      <DustVeil />
    </group>
  );
}

export default function SolaverseBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 12], fov: 42 }}
      >
        <color attach="background" args={["#04060b"]} />
        <SolaverseScene />
      </Canvas>

      {/* Cinematic atmosphere overlays */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(192,205,255,0.18),transparent_20%),radial-gradient(circle_at_50%_42%,rgba(112,126,205,0.12),transparent_36%),radial-gradient(circle_at_50%_78%,rgba(120,92,170,0.08),transparent_28%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(4,6,11,0.06)_0%,rgba(4,6,11,0.02)_18%,rgba(4,6,11,0.06)_38%,rgba(4,6,11,0.2)_66%,rgba(4,6,11,0.5)_100%)]" />

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_34%,transparent_0%,transparent_44%,rgba(4,6,11,0.12)_68%,rgba(4,6,11,0.38)_100%)]" />
    </div>
  );
}