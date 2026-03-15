"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  RoundedBox,
  Environment,
  ContactShadows,
  Float,
  Sparkles,
  MeshReflectorMaterial,
} from "@react-three/drei";
import * as THREE from "three";

function MarbleSlab() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Slow auto-rotation on Y axis
    meshRef.current.rotation.y += delta * 0.15;

    // Mouse-follow subtle rotation
    meshRef.current.rotation.x = THREE.MathUtils.lerp(
      meshRef.current.rotation.x,
      pointer.y * 0.15,
      0.05
    );
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -pointer.x * 0.1,
      0.05
    );
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <mesh ref={meshRef} castShadow>
        <RoundedBox
          args={[3.5, 0.3, 2.2]}
          radius={0.04}
          smoothness={4}
        >
          <meshPhysicalMaterial
            color="#f0ede8"
            roughness={0.35}
            metalness={0.05}
            clearcoat={0.8}
            clearcoatRoughness={0.2}
            envMapIntensity={0.6}
            sheen={0.3}
            sheenRoughness={0.4}
            sheenColor={new THREE.Color("#d4cfc7")}
          />
        </RoundedBox>
      </mesh>
    </Float>
  );
}

function MarbleVeins() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  // Thin veins on the marble slab surface
  const veins = Array.from({ length: 8 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 2.5,
      0.16 + Math.random() * 0.01,
      (Math.random() - 0.5) * 1.5,
    ] as [number, number, number],
    rotation: [0, Math.random() * Math.PI, 0] as [number, number, number],
    scale: [0.8 + Math.random() * 1.5, 0.005, 0.02 + Math.random() * 0.03] as [
      number,
      number,
      number,
    ],
    color: i % 2 === 0 ? "#c8c0b4" : "#b8b0a4",
  }));

  return (
    <group ref={groupRef}>
      {veins.map((vein, i) => (
        <mesh
          key={i}
          position={vein.position}
          rotation={vein.rotation}
          scale={vein.scale}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={vein.color}
            roughness={0.5}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#e8e0d4" />

      <MarbleSlab />
      <MarbleVeins />

      <Sparkles
        count={60}
        scale={10}
        size={1.5}
        speed={0.3}
        opacity={0.4}
        color="#f5f0e8"
      />

      <ContactShadows
        position={[0, -1.2, 0]}
        opacity={0.4}
        scale={12}
        blur={2.5}
        far={4}
        color="#8a8078"
      />

      <Environment preset="studio" environmentIntensity={0.5} />
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-stone-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-2 border-stone-700 border-t-stone-300" />
        <p className="text-sm text-stone-400">로딩 중...</p>
      </div>
    </div>
  );
}

export default function MarbleHero() {
  return (
    <div className="relative h-full w-full">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 2, 5], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
          className="!absolute inset-0"
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
