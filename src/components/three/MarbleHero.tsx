"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  RoundedBox,
  Environment,
  ContactShadows,
  PresentationControls,
} from "@react-three/drei";
import * as THREE from "three";

// ---- Simplex noise for procedural marble texture ----
const vertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;

  // Simplex noise
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
           + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                             dot(x12.zw, x12.zw)), 0.0);
    m = m * m; m = m * m;
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

  // FBM (fractal brownian motion)
  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.5000 * snoise(p); p *= 2.01;
    f += 0.2500 * snoise(p); p *= 2.02;
    f += 0.1250 * snoise(p); p *= 2.03;
    f += 0.0625 * snoise(p);
    return f;
  }

  void main() {
    vec2 uv = vUv;

    // Domain warping for organic marble veins
    float warp1 = fbm(uv * 3.0 + uTime * 0.008);
    float warp2 = fbm(uv * 3.0 + vec2(5.2, 1.3) + uTime * 0.006);
    vec2 warped = uv + vec2(warp1, warp2) * 0.3;

    // Primary vein structure
    float vein1 = sin(warped.x * 5.0 + fbm(warped * 4.0) * 6.0);
    vein1 = 1.0 - pow(abs(vein1), 0.25);

    // Secondary finer veins
    float vein2 = sin(warped.y * 8.0 + fbm(warped * 6.0 + 3.0) * 4.0);
    vein2 = 1.0 - pow(abs(vein2), 0.35);

    // Gold accent veins (sparse)
    float goldVein = sin(uv.x * 3.0 + uv.y * 2.0 + fbm(uv * 2.5 + 7.0) * 5.0);
    goldVein = pow(max(0.0, 1.0 - abs(goldVein)), 8.0);

    // Color palette
    vec3 baseColor = vec3(0.97, 0.95, 0.92);   // Warm white
    vec3 veinGray = vec3(0.76, 0.73, 0.69);     // Warm gray vein
    vec3 veinDark = vec3(0.62, 0.59, 0.55);     // Dark vein
    vec3 goldColor = vec3(0.82, 0.71, 0.50);    // Gold accent

    // Compose color
    vec3 color = baseColor;
    color = mix(color, veinGray, vein1 * 0.30);
    color = mix(color, veinDark, pow(vein1, 2.5) * 0.18);
    color = mix(color, veinGray * 0.95, vein2 * 0.12);
    color = mix(color, goldColor, goldVein * 0.20);

    // Subtle micro-texture noise
    float micro = snoise(uv * 60.0 + uTime * 0.02) * 0.012;
    color += micro;

    // === Lighting ===
    vec3 lightPos1 = vec3(4.0, 6.0, 5.0);
    vec3 lightPos2 = vec3(-3.0, 4.0, -3.0);

    // Mouse-reactive spotlight
    vec3 spotPos = vec3(uMouse.x * 3.0, 4.0, uMouse.y * 3.0 + 2.0);

    vec3 N = normalize(vNormal);
    vec3 V = normalize(vViewPos);

    // Light 1 (key)
    vec3 L1 = normalize(lightPos1 - vWorldPos);
    vec3 H1 = normalize(L1 + V);
    float diff1 = max(dot(N, L1), 0.0);
    float spec1 = pow(max(dot(N, H1), 0.0), 80.0);

    // Light 2 (fill)
    vec3 L2 = normalize(lightPos2 - vWorldPos);
    float diff2 = max(dot(N, L2), 0.0);

    // Spotlight (mouse)
    vec3 LS = normalize(spotPos - vWorldPos);
    vec3 HS = normalize(LS + V);
    float diffS = max(dot(N, LS), 0.0);
    float specS = pow(max(dot(N, HS), 0.0), 120.0);

    // Fresnel rim
    float fresnel = pow(1.0 - max(dot(V, N), 0.0), 4.0);

    // Ambient
    float ambient = 0.35;

    // Compose lighting
    vec3 litColor = color * (ambient + diff1 * 0.45 + diff2 * 0.15 + diffS * 0.15);
    litColor += spec1 * vec3(1.0, 0.98, 0.95) * 0.35;
    litColor += specS * vec3(1.0, 0.95, 0.88) * 0.2;
    litColor += fresnel * vec3(0.95, 0.92, 0.88) * 0.08;

    // Subtle warm tone in shadows
    litColor = mix(litColor, litColor * vec3(1.02, 1.0, 0.97), 1.0 - diff1);

    gl_FragColor = vec4(litColor, 1.0);
  }
`;

function MarbleSlab() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { pointer } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  useFrame((state) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uMouse.value.set(
      THREE.MathUtils.lerp(uniforms.uMouse.value.x, pointer.x, 0.03),
      THREE.MathUtils.lerp(uniforms.uMouse.value.y, pointer.y, 0.03)
    );
  });

  return (
    <mesh ref={meshRef} castShadow>
      <RoundedBox args={[5.0, 0.28, 2.8]} radius={0.03} smoothness={4}>
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </RoundedBox>
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.25} color="#f5f0e8" />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.0}
        castShadow
        color="#fff8f0"
      />
      <pointLight position={[-4, 5, -4]} intensity={0.4} color="#e8ddd0" />
      <pointLight position={[0, 3, 4]} intensity={0.3} color="#f0e8d8" />

      <PresentationControls
        global
        rotation={[0.15, 0.1, 0]}
        polar={[-0.6, 0.5]}
        azimuth={[-1.4, 1.4]}
        speed={2}
        zoom={1}
        config={{ mass: 2, tension: 170, friction: 26 }}
        snap={true}
      >
        <MarbleSlab />
      </PresentationControls>

      <ContactShadows
        position={[0, -1.0, 0]}
        opacity={0.35}
        scale={14}
        blur={2.5}
        far={4}
        color="#8a8078"
      />

      <Environment preset="studio" environmentIntensity={0.3} />
    </>
  );
}

export default function MarbleHero() {
  return (
    <div className="relative h-full w-full cursor-grab active:cursor-grabbing">
      <Suspense
        fallback={
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-accent/50" />
          </div>
        }
      >
        <Canvas
          dpr={[1, 1.5]}
          camera={{ position: [0, 2.5, 6.5], fov: 38 }}
          gl={{ antialias: true, alpha: true }}
          className="!absolute inset-0"
        >
          <Scene />
        </Canvas>
      </Suspense>

      {/* Interaction hint */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 backdrop-blur-sm">
        <svg className="h-4 w-4 text-white/40 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
        </svg>
        <span className="text-[10px] font-medium tracking-[0.2em] text-white/40 uppercase">
          Drag to explore
        </span>
      </div>
    </div>
  );
}
