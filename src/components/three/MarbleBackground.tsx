"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  varying vec2 vUv;

  // Simplex-like noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                             dot(x12.zw, x12.zw)), 0.0);
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

  float marble(vec2 uv, float time) {
    float n = 0.0;
    n += 0.5 * snoise(uv * 2.0 + time * 0.05);
    n += 0.25 * snoise(uv * 4.0 - time * 0.03);
    n += 0.125 * snoise(uv * 8.0 + time * 0.07);
    n += 0.0625 * snoise(uv * 16.0 - time * 0.04);
    float vein = sin(uv.x * 6.0 + n * 6.0 + time * 0.02);
    return smoothstep(-0.1, 0.1, vein) * 0.3 + 0.7;
  }

  void main() {
    vec2 uv = vUv;

    float m = marble(uv, uTime);

    // Base marble colors - warm white to soft gray
    vec3 color1 = vec3(0.96, 0.94, 0.91); // warm white
    vec3 color2 = vec3(0.88, 0.85, 0.82); // light warm gray
    vec3 color3 = vec3(0.82, 0.78, 0.74); // medium warm gray

    vec3 color = mix(color2, color1, m);

    // Subtle secondary veining
    float m2 = marble(uv * 1.5 + 3.0, uTime * 0.7);
    color = mix(color, color3, (1.0 - m2) * 0.15);

    // Soft vignette
    float vignette = 1.0 - length((uv - 0.5) * 1.2);
    vignette = smoothstep(0.0, 0.7, vignette);
    color *= 0.9 + vignette * 0.1;

    // Subtle shimmer
    float shimmer = snoise(uv * 30.0 + uTime * 0.1) * 0.015;
    color += shimmer;

    gl_FragColor = vec4(color, 0.35);
  }
`;

function AnimatedPlane() {
  const meshRef = useRef<THREE.Mesh>(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <planeGeometry args={[12, 12, 1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <AnimatedPlane />
    </>
  );
}

export default function MarbleBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-40">
      <Suspense fallback={null}>
        <Canvas
          dpr={[1, 1]}
          camera={{ position: [0, 0, 5], fov: 50 }}
          gl={{ antialias: false, alpha: true }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
}
