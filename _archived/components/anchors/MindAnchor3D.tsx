"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type MindAnchor3DProps = {
  isUntangling?: boolean;
  isResolved?: boolean;
};

const TANGLED_CONTROL_POINTS = [
  new THREE.Vector3(-2.55, 0.7, 0.95),
  new THREE.Vector3(-1.75, 1.35, -1.3),
  new THREE.Vector3(-1.2, -1.15, 1.35),
  new THREE.Vector3(-0.45, 1.2, -1.25),
  new THREE.Vector3(0.15, -1.2, 1.1),
  new THREE.Vector3(0.95, 1.15, -1.05),
  new THREE.Vector3(1.65, -0.85, 0.85),
  new THREE.Vector3(2.45, 0.35, -0.15),
];

const CALM_CONTROL_POINTS = [
  new THREE.Vector3(-2.8, 0.08, 0.0),
  new THREE.Vector3(-2.0, 0.42, 0.08),
  new THREE.Vector3(-1.25, 0.34, 0.02),
  new THREE.Vector3(-0.35, 0.12, -0.02),
  new THREE.Vector3(0.45, -0.14, -0.03),
  new THREE.Vector3(1.2, -0.08, 0.01),
  new THREE.Vector3(2.0, 0.02, 0.04),
  new THREE.Vector3(2.8, 0.04, 0.0),
];

function smoothStep01(value: number) {
  const t = THREE.MathUtils.clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function buildCurvePoints(progress: number, time: number) {
  const resolved = smoothStep01(progress);
  const livingMotion = 1 - resolved;

  return TANGLED_CONTROL_POINTS.map((from, index) => {
    const to = CALM_CONTROL_POINTS[index];
    const point = from.clone().lerp(to, resolved);

    const phase = time * 0.92 + index * 0.74;

    point.x += Math.sin(phase * 0.72) * 0.025 * livingMotion;
    point.y += Math.cos(phase * 1.03) * 0.06 * livingMotion;
    point.z += Math.sin(phase * 1.16) * 0.095 * livingMotion;

    return point;
  });
}

function replaceGeometry(mesh: THREE.Mesh, nextGeometry: THREE.TubeGeometry) {
  mesh.geometry.dispose();
  mesh.geometry = nextGeometry;
}

function createCordMaterial(core = false) {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(core ? "#f3efff" : "#d3c8ff"),
    emissive: new THREE.Color(core ? "#c6b8ff" : "#8d79ea"),
    emissiveIntensity: core ? 1.35 : 0.52,
    roughness: core ? 0.2 : 0.38,
    metalness: 0.0,
    clearcoat: core ? 0.42 : 0.08,
    clearcoatRoughness: core ? 0.2 : 0.42,
    transparent: !core,
    opacity: core ? 1 : 0.22,
  });
}

export default function MindAnchor3D({
  isUntangling = false,
  isResolved = false,
}: MindAnchor3DProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = 260;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.15);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xc7cfff, 0.58);
    scene.add(ambientLight);

    const frontKey = new THREE.DirectionalLight(0xf7f3ff, 1.85);
    frontKey.position.set(-2.8, 2.1, 4.8);
    scene.add(frontKey);

    const rimBack = new THREE.DirectionalLight(0x8778ff, 1.15);
    rimBack.position.set(2.4, -1.4, -4.8);
    scene.add(rimBack);

    const topAccent = new THREE.PointLight(0xd9d0ff, 1.1, 20);
    topAccent.position.set(0, 2.7, 2.4);
    scene.add(topAccent);

    const group = new THREE.Group();
    scene.add(group);

    const initialCurve = new THREE.CatmullRomCurve3(
      buildCurvePoints(0, 0),
      false,
      "centripetal",
      0.5
    );

    const glowGeometry = new THREE.TubeGeometry(initialCurve, 260, 0.145, 30, false);
    const coreGeometry = new THREE.TubeGeometry(initialCurve, 260, 0.082, 34, false);

    const glowTube = new THREE.Mesh(glowGeometry, createCordMaterial(false));
    const coreTube = new THREE.Mesh(coreGeometry, createCordMaterial(true));

    group.add(glowTube);
    group.add(coreTube);

    const haloPlaneGeometry = new THREE.PlaneGeometry(8.8, 3.5);
    const haloPlaneMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime: { value: 0 },
        uStrength: { value: 0.16 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uStrength;
        varying vec2 vUv;

        void main() {
          vec2 uv = vUv - 0.5;
          float radial = smoothstep(0.84, 0.0, length(uv * vec2(1.0, 1.55)));
          float pulse = 0.97 + sin(uTime * 0.8) * 0.02;
          vec3 color = vec3(0.38, 0.31, 0.72);
          gl_FragColor = vec4(color, radial * uStrength * pulse);
        }
      `,
    });

    const haloPlane = new THREE.Mesh(haloPlaneGeometry, haloPlaneMaterial);
    haloPlane.position.set(0, 0, -1.75);
    scene.add(haloPlane);

    let frameId = 0;
    let disposed = false;
    const clock = new THREE.Clock();

    const handleResize = () => {
      if (!mountRef.current) return;
      const nextWidth = mountRef.current.clientWidth;
      const nextHeight = 260;

      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mount);

    const animate = () => {
      if (disposed) return;

      const elapsed = clock.getElapsedTime();

      const targetProgress = isResolved ? 1 : isUntangling ? 0.72 : 0;

      progressRef.current = THREE.MathUtils.lerp(
        progressRef.current,
        targetProgress,
        isResolved ? 0.06 : 0.03
      );

      if (!isUntangling && !isResolved && progressRef.current < 0.002) {
        progressRef.current = 0;
      }

      const curve = new THREE.CatmullRomCurve3(
        buildCurvePoints(progressRef.current, elapsed),
        false,
        "centripetal",
        0.5
      );

      replaceGeometry(
        glowTube,
        new THREE.TubeGeometry(curve, 260, 0.145, 30, false)
      );
      replaceGeometry(
        coreTube,
        new THREE.TubeGeometry(curve, 260, 0.082, 34, false)
      );

      const stillness = smoothStep01(progressRef.current);
      const subtleAlive = 1 - stillness;

      group.position.y = Math.sin(elapsed * 0.72) * 0.012 * subtleAlive;
      group.position.x = Math.cos(elapsed * 0.46) * 0.008 * subtleAlive;

      if (haloPlane.material instanceof THREE.ShaderMaterial) {
        haloPlane.material.uniforms.uTime.value = elapsed;
        haloPlane.material.uniforms.uStrength.value = 0.13 + (1 - stillness) * 0.03;
      }

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();

      glowTube.geometry.dispose();
      coreTube.geometry.dispose();
      haloPlaneGeometry.dispose();

      if (glowTube.material instanceof THREE.Material) glowTube.material.dispose();
      if (coreTube.material instanceof THREE.Material) coreTube.material.dispose();
      haloPlaneMaterial.dispose();

      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isUntangling, isResolved]);

  return (
    <div
      ref={mountRef}
      style={{
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
        height: 260,
      }}
    />
  );
}