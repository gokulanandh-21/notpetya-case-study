'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const NODE_COUNT  = 120;
const RADIUS      = 2.4;
const CONNECT_DIST = 0.75;
const PATIENT_ZERO = 22;

function fibonacciSphere(n: number, r: number): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  const golden = (1 + Math.sqrt(5)) / 2;
  for (let i = 0; i < n; i++) {
    const theta = Math.acos(1 - (2 * (i + 0.5)) / n);
    const phi   = (2 * Math.PI * i) / golden;
    pts.push(new THREE.Vector3(
      r * Math.sin(theta) * Math.cos(phi),
      r * Math.sin(theta) * Math.sin(phi),
      r * Math.cos(theta)
    ));
  }
  return pts;
}

function GlobeScene() {
  const groupRef  = useRef<THREE.Group>(null!);
  const meshRef   = useRef<THREE.InstancedMesh>(null!);
  const lineRef   = useRef<THREE.LineSegments>(null!);
  const pulse     = useRef(0);
  const infected  = useRef<Set<number>>(new Set([PATIENT_ZERO]));

  const nodes = useMemo(() => fibonacciSphere(NODE_COUNT, RADIUS), []);

  const edgeGeo = useMemo(() => {
    const verts: number[] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodes[i].distanceTo(nodes[j]) < CONNECT_DIST) {
          verts.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3));
    return g;
  }, [nodes]);

  const nodeGeo = useMemo(() => new THREE.SphereGeometry(0.045, 7, 7), []);
  const dummy   = useMemo(() => new THREE.Object3D(), []);

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    // Slow majestic rotation
    groupRef.current.rotation.y += delta * 0.04;
    groupRef.current.rotation.x  = Math.sin(Date.now() * 0.0002) * 0.1;
    pulse.current += delta;

    // Restart cycle every 9 seconds
    if (pulse.current > 9) {
      pulse.current = 0;
      infected.current = new Set([PATIENT_ZERO]);
    }

    // Propagate infection wave outward
    const t = pulse.current;
    if (t > 0.5) {
      for (let i = 0; i < NODE_COUNT; i++) {
        if (infected.current.has(i)) continue;
        if (nodes[PATIENT_ZERO].distanceTo(nodes[i]) < t * 0.9) {
          infected.current.add(i);
        }
      }
    }

    const cClean    = new THREE.Color('#1a3a5c');
    const cInfected = new THREE.Color('#e63946');
    const cPatient  = new THREE.Color('#ff6b6b');

    for (let i = 0; i < NODE_COUNT; i++) {
      let col: THREE.Color;
      let scale = 1;
      const isInfected = infected.current.has(i);

      if (i === PATIENT_ZERO) {
        col = cPatient;
        scale = 1.6 + 0.5 * Math.sin(Date.now() * 0.005);
      } else if (isInfected) {
        const flicker = 0.7 + 0.3 * Math.sin(Date.now() * 0.007 + i);
        col = cInfected.clone().multiplyScalar(flicker);
        scale = 1.25 + 0.1 * Math.sin(Date.now() * 0.004 + i * 0.5);
      } else {
        col = cClean;
        scale = 0.9;
      }

      dummy.position.copy(nodes[i]);
      dummy.scale.setScalar(scale);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
      meshRef.current.setColorAt(i, col);
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    // Fade edge color based on infection ratio
    if (lineRef.current) {
      const ratio = infected.current.size / NODE_COUNT;
      (lineRef.current.material as THREE.LineBasicMaterial).color.set(
        new THREE.Color().lerpColors(new THREE.Color('#1a3a5c'), new THREE.Color('#c41e2a'), ratio * 0.4)
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Outer wireframe sphere — subtle topology */}
      <mesh>
        <icosahedronGeometry args={[RADIUS, 3]} />
        <meshBasicMaterial color="#0e2035" wireframe transparent opacity={0.1} />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[RADIUS * 0.98, 32, 32]} />
        <meshBasicMaterial color="#061220" transparent opacity={0.18} side={THREE.BackSide} />
      </mesh>

      {/* Connection edges */}
      <lineSegments ref={lineRef} geometry={edgeGeo}>
        <lineBasicMaterial color="#1a3a5c" transparent opacity={0.35} />
      </lineSegments>

      {/* Nodes */}
      <instancedMesh ref={meshRef} args={[nodeGeo, undefined, NODE_COUNT]}>
        <meshBasicMaterial vertexColors />
      </instancedMesh>
    </group>
  );
}

export default function HeroGlobeCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0.5, 6.5], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      style={{ background: 'transparent' }}
    >
      <ambientLight color="#0a1828" intensity={0.8} />
      <pointLight position={[5, 6, 4]}  color="#c8dfff" intensity={1.2} />
      <pointLight position={[-4, -3, 2]} color="#e63946" intensity={0.4} />
      <GlobeScene />
    </Canvas>
  );
}
