"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MindAnchor3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      45,
      mountRef.current.clientWidth / 260,
      0.1,
      1000
    );
    camera.position.z = 8;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(mountRef.current.clientWidth, 260);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // LIGHT
    const light = new THREE.PointLight(0xffffff, 1.5, 50);
    light.position.set(0, 0, 5);
    scene.add(light);

    // CURVE (chaotic)
    const points: THREE.Vector3[] = [];

    for (let i = 0; i < 120; i++) {
      const t = i / 120 * Math.PI * 4;

      points.push(
        new THREE.Vector3(
          Math.sin(t) * 2.2,
          Math.cos(t * 1.3) * 1.2,
          Math.sin(t * 0.7) * 1.5
        )
      );
    }

    const curve = new THREE.CatmullRomCurve3(points);

    // GEOMETRY (tube = cord)
    const geometry = new THREE.TubeGeometry(curve, 200, 0.09, 32, false);

    // MATERIAL (soft luminous)
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color("#cfd6ff"),
      emissive: new THREE.Color("#9fa8ff"),
      emissiveIntensity: 1.5,
      roughness: 0.2,
      metalness: 0.0,
    });

    const tube = new THREE.Mesh(geometry, material);
    scene.add(tube);

    // ANIMATION
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // slow organic motion
      tube.rotation.y += 0.003;
      tube.rotation.x += 0.001;

      renderer.render(scene, camera);
    };

    animate();

    // CLEANUP
    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, []);

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