"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function DustParticles({ count = 800 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  const speeds = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      s[i] = 0.2 + Math.random() * 0.5;
    }
    return s;
  }, [count]);

  const offsets = useMemo(() => {
    const o = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      o[i] = Math.random() * Math.PI * 2;
    }
    return o;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const positionAttr = pointsRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const array = positionAttr.array as Float32Array;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const speed = speeds[i];
      const offset = offsets[i];

      // Gentle drifting motion
      array[i3] += Math.sin(time * speed * 0.3 + offset) * 0.001;
      array[i3 + 1] += Math.cos(time * speed * 0.2 + offset) * 0.0015;
      array[i3 + 2] += Math.sin(time * speed * 0.25 + offset * 1.5) * 0.001;

      // Wrap around boundaries
      if (array[i3] > 10) array[i3] = -10;
      if (array[i3] < -10) array[i3] = 10;
      if (array[i3 + 1] > 10) array[i3 + 1] = -10;
      if (array[i3 + 1] < -10) array[i3 + 1] = 10;
      if (array[i3 + 2] > 10) array[i3 + 2] = -10;
      if (array[i3 + 2] < -10) array[i3 + 2] = 10;
    }

    positionAttr.needsUpdate = true;

    // Slow global rotation
    pointsRef.current.rotation.y = time * 0.02;
    pointsRef.current.rotation.x = Math.sin(time * 0.01) * 0.1;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#f5efe6"
        size={0.03}
        sizeAttenuation
        depthWrite={false}
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function SecondaryDust() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 400;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.elapsedTime;
    pointsRef.current.rotation.y = -time * 0.015;
    pointsRef.current.rotation.z = Math.cos(time * 0.008) * 0.05;
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#ede7db"
        size={0.02}
        sizeAttenuation
        depthWrite={false}
        opacity={0.35}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Scene() {
  return (
    <>
      <DustParticles />
      <SecondaryDust />
      <ambientLight intensity={0.1} />
    </>
  );
}

export default function ParticleField() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: false, alpha: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
