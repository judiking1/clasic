"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

// ─── Shader ──────────────────────────────────────────────────

const vertexShader = `
  attribute float aOpacity;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;
  varying float vOpacity;

  void main() {
    vOpacity = aOpacity;

    #ifdef USE_INSTANCING
      mat4 localModel = modelMatrix * instanceMatrix;
    #else
      mat4 localModel = modelMatrix;
    #endif

    vNormal = normalize(mat3(localModel) * normal);
    vec4 worldPos = localModel * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPos = viewMatrix * worldPos;
    vViewPos = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uAssembly;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;
  varying float vOpacity;

  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
  vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}

  float snoise(vec2 v){
    const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
    vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
    m=m*m; m=m*m;
    vec3 x2=2.*fract(p*C.www)-1.;
    vec3 h=abs(x2)-.5;
    vec3 ox=floor(x2+.5);
    vec3 a0=x2-ox;
    m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.*dot(m,g);
  }

  float fbm(vec2 p){
    float f=0.;
    f+=.5*snoise(p); p*=2.01;
    f+=.25*snoise(p); p*=2.02;
    f+=.125*snoise(p);
    return f;
  }

  void main(){
    if (vOpacity < 0.01) discard;

    vec2 uv=vWorldPos.xz*0.35;
    float w1=fbm(uv*3.+uTime*.008);
    float w2=fbm(uv*3.+vec2(5.2,1.3)+uTime*.006);
    vec2 warped=uv+vec2(w1,w2)*.3;

    float v1=sin(warped.x*5.+fbm(warped*4.)*6.);
    v1=1.-pow(abs(v1),.25);
    float v2=sin(warped.y*8.+fbm(warped*6.+3.)*4.);
    v2=1.-pow(abs(v2),.35);
    float gv=sin(uv.x*3.+uv.y*2.+fbm(uv*2.5+7.)*5.);
    gv=pow(max(0.,1.-abs(gv)),8.);

    vec3 base=vec3(.97,.95,.92);
    vec3 vGray=vec3(.76,.73,.69);
    vec3 vDark=vec3(.62,.59,.55);
    vec3 gold=vec3(.82,.71,.50);

    vec3 col=base;
    col=mix(col,vGray,v1*.30);
    col=mix(col,vDark,pow(v1,2.5)*.18);
    col=mix(col,vGray*.95,v2*.12);
    col=mix(col,gold,gv*.20);
    col+=snoise(uv*30.)*.010;

    vec3 N=normalize(vNormal);
    vec3 V=normalize(vViewPos);
    vec3 L1=normalize(vec3(4,6,5)-vWorldPos);
    vec3 H1=normalize(L1+V);
    float d1=max(dot(N,L1),0.);
    float s1=pow(max(dot(N,H1),0.),80.);
    float d2=max(dot(N,normalize(vec3(-3,4,-3)-vWorldPos)),0.);
    float fr=pow(1.-max(dot(V,N),0.),4.);

    // Wrap diffuse — stronger wrap so back-facing surfaces still receive light
    float wrap=1.0;
    float d1w=max(0.,(dot(N,L1)+wrap)/(1.+wrap));
    float d2w=max(0.,(dot(N,normalize(vec3(-3,4,-3)-vWorldPos))+wrap)/(1.+wrap));
    // Use wrap diffuse while fragments are separate, standard when fully assembled
    float lightBlend=smoothstep(0.85,1.0,uAssembly);
    float fd1=mix(d1w,d1,lightBlend);
    float fd2=mix(d2w,d2,lightBlend);

    // Boost ambient as assembly increases — prevents dark inner faces between close fragments
    float ambient=mix(0.35,0.6,uAssembly);
    vec3 lit=col*(ambient+fd1*.40+fd2*.12);
    lit+=s1*vec3(1,.98,.95)*.35;
    lit+=fr*vec3(.95,.92,.88)*.08;
    lit=mix(lit,lit*vec3(1.02,1,.97),1.-fd1);

    // Gold edge glow on floating fragments
    lit+=(1.-uAssembly)*fr*.8*gold;

    gl_FragColor=vec4(lit, vOpacity);
  }
`;

// Separate shader for the complete slab (no per-instance opacity needed)
const slabFragmentShader = `
  uniform float uTime;
  uniform float uAssembly;
  uniform float uSlabOpacity;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;

  vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
  vec2 mod289(vec2 x){return x-floor(x*(1./289.))*289.;}
  vec3 permute(vec3 x){return mod289(((x*34.)+1.)*x);}

  float snoise(vec2 v){
    const vec4 C=vec4(.211324865405187,.366025403784439,-.577350269189626,.024390243902439);
    vec2 i=floor(v+dot(v,C.yy));
    vec2 x0=v-i+dot(i,C.xx);
    vec2 i1=(x0.x>x0.y)?vec2(1,0):vec2(0,1);
    vec4 x12=x0.xyxy+C.xxzz; x12.xy-=i1;
    i=mod289(i);
    vec3 p=permute(permute(i.y+vec3(0,i1.y,1))+i.x+vec3(0,i1.x,1));
    vec3 m=max(.5-vec3(dot(x0,x0),dot(x12.xy,x12.xy),dot(x12.zw,x12.zw)),0.);
    m=m*m; m=m*m;
    vec3 x2=2.*fract(p*C.www)-1.;
    vec3 h=abs(x2)-.5;
    vec3 ox=floor(x2+.5);
    vec3 a0=x2-ox;
    m*=1.79284291400159-.85373472095314*(a0*a0+h*h);
    vec3 g;
    g.x=a0.x*x0.x+h.x*x0.y;
    g.yz=a0.yz*x12.xz+h.yz*x12.yw;
    return 130.*dot(m,g);
  }

  float fbm(vec2 p){
    float f=0.;
    f+=.5*snoise(p); p*=2.01;
    f+=.25*snoise(p); p*=2.02;
    f+=.125*snoise(p);
    return f;
  }

  void main(){
    if (uSlabOpacity < 0.01) discard;

    vec2 uv=vWorldPos.xz*0.35;
    float w1=fbm(uv*3.+uTime*.008);
    float w2=fbm(uv*3.+vec2(5.2,1.3)+uTime*.006);
    vec2 warped=uv+vec2(w1,w2)*.3;

    float v1=sin(warped.x*5.+fbm(warped*4.)*6.);
    v1=1.-pow(abs(v1),.25);
    float v2=sin(warped.y*8.+fbm(warped*6.+3.)*4.);
    v2=1.-pow(abs(v2),.35);
    float gv=sin(uv.x*3.+uv.y*2.+fbm(uv*2.5+7.)*5.);
    gv=pow(max(0.,1.-abs(gv)),8.);

    vec3 base=vec3(.97,.95,.92);
    vec3 vGray=vec3(.76,.73,.69);
    vec3 vDark=vec3(.62,.59,.55);
    vec3 gold=vec3(.82,.71,.50);

    vec3 col=base;
    col=mix(col,vGray,v1*.30);
    col=mix(col,vDark,pow(v1,2.5)*.18);
    col=mix(col,vGray*.95,v2*.12);
    col=mix(col,gold,gv*.20);
    col+=snoise(uv*30.)*.010;

    vec3 N=normalize(vNormal);
    vec3 V=normalize(vViewPos);
    vec3 L1=normalize(vec3(4,6,5)-vWorldPos);
    vec3 H1=normalize(L1+V);
    float d1=max(dot(N,L1),0.);
    float s1=pow(max(dot(N,H1),0.),80.);
    float d2=max(dot(N,normalize(vec3(-3,4,-3)-vWorldPos)),0.);
    float fr=pow(1.-max(dot(V,N),0.),4.);

    vec3 lit=col*(.35+d1*.45+d2*.15);
    lit+=s1*vec3(1,.98,.95)*.35;
    lit+=fr*vec3(.95,.92,.88)*.08;
    lit=mix(lit,lit*vec3(1.02,1,.97),1.-d1);

    gl_FragColor=vec4(lit, uSlabOpacity);
  }
`;

const slabVertexShader = `
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying vec3 vViewPos;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
    vViewPos = -mvPos.xyz;
    gl_Position = projectionMatrix * mvPos;
  }
`;

// ─── Fragment Data ───────────────────────────────────────────

const SLAB_W = 5.0;
const SLAB_H = 0.28;
const SLAB_D = 2.8;
const COLS = 4;
const ROWS = 3;
const TOTAL = COLS * ROWS;

interface FragData {
  assembledPos: THREE.Vector3;
  stagger: number;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitTilt: number;
  yBase: number;
  bobSpeed: number;
  bobAmount: number;
  spinAxis: THREE.Vector3;
  spinSpeed: number;
}

function sr(seed: number) {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453;
  return x - Math.floor(x);
}

function genFragments(): FragData[] {
  const frags: FragData[] = [];
  const fw = SLAB_W / COLS;
  const fd = SLAB_D / ROWS;

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const i = r * COLS + c;
      const x = (c - (COLS - 1) / 2) * fw;
      const z = (r - (ROWS - 1) / 2) * fd;
      const dc = Math.sqrt(x * x + z * z);
      const mx = Math.sqrt((SLAB_W / 2) ** 2 + (SLAB_D / 2) ** 2);

      frags.push({
        assembledPos: new THREE.Vector3(x, 0, z),
        stagger: dc / mx,
        orbitRadius: 4.0 + sr(i * 13) * 5.0,
        orbitSpeed: 0.12 + sr(i * 7) * 0.2,
        orbitPhase: sr(i * 23) * Math.PI * 2,
        orbitTilt: (sr(i * 29) - 0.5) * Math.PI * 0.5,
        yBase: (sr(i * 17) - 0.5) * 3.5,
        bobSpeed: 0.3 + sr(i * 31) * 0.5,
        bobAmount: 0.3 + sr(i * 37) * 0.8,
        spinAxis: new THREE.Vector3(sr(i * 41) - .5, sr(i * 43) - .5, sr(i * 47) - .5).normalize(),
        spinSpeed: 0.2 + sr(i * 53) * 0.6,
      });
    }
  }
  return frags;
}

// ─── Easing ──────────────────────────────────────────────────

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function smoothstep(a: number, b: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

// ─── Scroll Keyframes ────────────────────────────────────────

interface KF { scroll: number; pos: [number, number, number]; rot: [number, number, number]; scale: number; opacity: number; }

const keyframes: KF[] = [
  { scroll: 0.00, pos: [0, 0, 0],       rot: [0.1, 0, 0],       scale: 1.0, opacity: 0.85 },
  { scroll: 0.10, pos: [0, 0, 0],       rot: [0.1, 0.15, 0],    scale: 1.0, opacity: 0.85 },
  { scroll: 0.18, pos: [0.8, 0, 0],     rot: [0.12, 0.3, 0],    scale: 0.95, opacity: 0.8 },
  { scroll: 0.28, pos: [-1.0, 0.2, 0],  rot: [0.15, 0.6, 0.02], scale: 0.9, opacity: 0.75 },
  { scroll: 0.38, pos: [1.2, -0.1, 0],  rot: [0.3, 1.0, 0.03],  scale: 0.85, opacity: 0.7 },
  { scroll: 0.46, pos: [0, 0.2, -1],    rot: [0.2, 1.5, 0],     scale: 0.7, opacity: 0.35 },
  { scroll: 0.56, pos: [-0.3, 0.3, -1], rot: [0.2, 2.0, 0],     scale: 0.65, opacity: 0.3 },
  { scroll: 0.64, pos: [1.2, -0.1, 0],  rot: [0.12, 2.5, 0.02], scale: 0.75, opacity: 0.6 },
  { scroll: 0.72, pos: [0, 0, 0],       rot: [0.1, 3.0, 0],     scale: 0.8, opacity: 0.7 },
  { scroll: 0.80, pos: [-0.5, 0.1, 0],  rot: [0.1, 3.5, 0],     scale: 0.7, opacity: 0.55 },
  { scroll: 0.88, pos: [0, 0, 0],       rot: [0.12, 4.0, 0],    scale: 0.85, opacity: 0.7 },
  { scroll: 1.00, pos: [0, -0.2, 0],    rot: [0.12, 4.6, 0],    scale: 0.75, opacity: 0.5 },
];

function interpKF(scroll: number) {
  let k0 = keyframes[0], k1 = keyframes[keyframes.length - 1];
  for (let i = 0; i < keyframes.length - 1; i++) {
    if (scroll >= keyframes[i].scroll && scroll <= keyframes[i + 1].scroll) {
      k0 = keyframes[i]; k1 = keyframes[i + 1]; break;
    }
  }
  const range = k1.scroll - k0.scroll;
  const t = range > 0 ? smoothstep(0, 1, (scroll - k0.scroll) / range) : 0;
  return {
    pos: k0.pos.map((v, i) => THREE.MathUtils.lerp(v, k1.pos[i], t)) as [number, number, number],
    rot: k0.rot.map((v, i) => THREE.MathUtils.lerp(v, k1.rot[i], t)) as [number, number, number],
    scale: THREE.MathUtils.lerp(k0.scale, k1.scale, t),
    opacity: THREE.MathUtils.lerp(k0.opacity, k1.opacity, t),
  };
}

// ─── Reusable temp objects ───────────────────────────────────

const _orbPos = new THREE.Vector3();
const _spinQ = new THREE.Quaternion();
const _identQ = new THREE.Quaternion();
const _tiltQ = new THREE.Quaternion();
const _tiltAx = new THREE.Vector3(1, 0, 0);
const _tempVec = new THREE.Vector3();
const _mat4 = new THREE.Matrix4();
const _pos = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _scale = new THREE.Vector3(1, 1, 1);

// ─── Instanced Fragments (single draw call for all 12) ──────

function InstancedFragments({ assemblyRef }: { assemblyRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const fragments = useMemo(genFragments, []);

  const geo = useMemo(() => {
    const fw = SLAB_W / COLS;
    const fd = SLAB_D / ROWS;
    return new THREE.BoxGeometry(fw, SLAB_H, fd);
  }, []);

  // Per-instance opacity attribute
  const opacityAttr = useMemo(() => {
    const arr = new Float32Array(TOTAL);
    arr.fill(1.0);
    return new THREE.InstancedBufferAttribute(arr, 1);
  }, []);

  const mat = useMemo(() => {
    const m = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: { uTime: { value: 0 }, uAssembly: { value: 0 } },
      transparent: true,
      depthWrite: true,
    });
    return m;
  }, []);

  // Attach the custom attribute to geometry
  useMemo(() => {
    geo.setAttribute("aOpacity", opacityAttr);
  }, [geo, opacityAttr]);

  // Single useFrame updates all 12 instances
  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const assembly = assemblyRef.current;
    mat.uniforms.uTime.value = time;
    mat.uniforms.uAssembly.value = assembly;

    for (let i = 0; i < TOTAL; i++) {
      const data = fragments[i];

      const raw = (assembly - data.stagger * 0.25) / (1 - data.stagger * 0.25);
      const eased = easeInOutCubic(Math.max(0, Math.min(1, raw)));
      const floating = 1 - eased;

      // Orbital position
      const angle = data.orbitPhase + time * data.orbitSpeed * (0.2 + floating * 0.8);
      const radius = data.orbitRadius * floating;
      const bob = Math.sin(time * data.bobSpeed) * data.bobAmount * floating;
      _orbPos.set(Math.cos(angle) * radius, data.yBase * floating + bob, Math.sin(angle) * radius);
      _tiltQ.setFromAxisAngle(_tiltAx, data.orbitTilt * floating);
      _orbPos.applyQuaternion(_tiltQ);

      // Interpolate position
      _pos.lerpVectors(_orbPos, data.assembledPos, eased);

      // Interpolate rotation
      _spinQ.setFromAxisAngle(data.spinAxis, time * data.spinSpeed * floating);
      _identQ.identity();
      _quat.slerpQuaternions(_spinQ, _identQ, eased);

      // Build instance matrix
      _mat4.compose(_pos, _quat, _scale);
      meshRef.current.setMatrixAt(i, _mat4);

      // Per-instance opacity — fragments vanish quickly, then slab replaces (no overlap)
      const fragOpacity = 1 - smoothstep(0.76, 0.80, assembly);
      opacityAttr.array[i] = fragOpacity;
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    opacityAttr.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geo, mat, TOTAL]} frustumCulled={false} />
  );
}

// ─── Complete Slab (seamless, no seams) ──────────────────────

function CompleteSlab({ assemblyRef }: { assemblyRef: React.MutableRefObject<number> }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const mat = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: slabVertexShader,
    fragmentShader: slabFragmentShader,
    uniforms: { uTime: { value: 0 }, uAssembly: { value: 1 }, uSlabOpacity: { value: 0 } },
    transparent: true,
    depthWrite: true,
  }), []);
  const geo = useMemo(() => new THREE.BoxGeometry(SLAB_W, SLAB_H, SLAB_D, 8, 1, 6), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    mat.uniforms.uTime.value = state.clock.elapsedTime;

    const assembly = assemblyRef.current;
    // Slab appears right AFTER fragments vanish (no overlap)
    const slabOpacity = smoothstep(0.80, 0.84, assembly);
    mat.uniforms.uSlabOpacity.value = slabOpacity;
    meshRef.current.visible = slabOpacity > 0.01;
  });

  return <mesh ref={meshRef} geometry={geo} material={mat} />;
}

// ─── Scene ───────────────────────────────────────────────────

function MarbleScene({
  scrollProgress,
  assemblyProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
  assemblyProgress: React.MutableRefObject<number>;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const { size } = useThree();
  const isMobile = size.width < 768;
  const curOpacity = useRef(0.85);

  useFrame(() => {
    if (!groupRef.current) return;
    const kf = interpKF(scrollProgress.current);
    const g = groupRef.current;

    const mobScale = isMobile ? 0.55 : 1;
    _tempVec.set(kf.pos[0] * mobScale, kf.pos[1], kf.pos[2]);
    g.position.lerp(_tempVec, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, kf.rot[0], 0.05);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, kf.rot[1], 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, kf.rot[2], 0.05);
    const ts = kf.scale * mobScale;
    _tempVec.set(ts, ts, ts);
    g.scale.lerp(_tempVec, 0.05);

    curOpacity.current = THREE.MathUtils.lerp(curOpacity.current, kf.opacity, 0.05);
    g.visible = curOpacity.current > 0.01;
  });

  return (
    <>
      <ambientLight intensity={0.3} color="#f5f0e8" />
      <directionalLight position={[5, 8, 5]} intensity={0.8} color="#fff8f0" />
      <pointLight position={[-4, 5, -4]} intensity={0.3} color="#e8ddd0" />
      <pointLight position={[0, 3, 4]} intensity={0.25} color="#f0e8d8" />
      <group ref={groupRef}>
        <InstancedFragments assemblyRef={assemblyProgress} />
        <CompleteSlab assemblyRef={assemblyProgress} />
      </group>
      <Environment preset="studio" environmentIntensity={0.2} />
    </>
  );
}

// ─── Export ──────────────────────────────────────────────────

export default function MarbleScrollScene({
  scrollProgress,
  assemblyProgress,
}: {
  scrollProgress: React.MutableRefObject<number>;
  assemblyProgress: React.MutableRefObject<number>;
}) {
  return (
    <Suspense fallback={null}>
      <Canvas
        dpr={[1, 1.2]}
        camera={{ position: [0, 3, 9], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ pointerEvents: "none" }}
      >
        <MarbleScene scrollProgress={scrollProgress} assemblyProgress={assemblyProgress} />
      </Canvas>
    </Suspense>
  );
}
