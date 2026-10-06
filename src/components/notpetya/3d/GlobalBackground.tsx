'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Stars() {
  const ref = useRef<THREE.Points>(null!);
  const count = 3000;

  const [positions, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30 - 10;
      sz[i] = Math.random();
    }
    return [pos, sz];
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.008;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.006) * 0.05;
    if (typeof window !== 'undefined') {
      ref.current.position.y = window.scrollY * 0.004;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
        <bufferAttribute attach="attributes-size"     count={count} array={sizes} itemSize={1} args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#c8d8f8" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function RedAlertNodes() {
  const ref = useRef<THREE.Points>(null!);
  const count = 60;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 70;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    return pos;
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const material = ref.current.material as THREE.PointsMaterial;
    // Subtle pulse on the red alert nodes
    material.opacity = 0.4 + Math.sin(clock.elapsedTime * 2) * 0.25;
    ref.current.rotation.y = clock.elapsedTime * 0.008;
    if (typeof window !== 'undefined') {
      ref.current.position.y = window.scrollY * 0.004;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#e63946" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function NetworkGrid() {
  const ref = useRef<THREE.LineSegments>(null!);

  const geometry = useMemo(() => {
    const pts: number[] = [];
    const nodeCount = 80;
    const nodes: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push(new THREE.Vector3(
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 15 - 5
      ));
    }

    // Connect close neighbours
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 6) {
          pts.push(nodes[i].x, nodes[i].y, nodes[i].z);
          pts.push(nodes[j].x, nodes[j].y, nodes[j].z);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * 0.008;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.006) * 0.05;
    if (typeof window !== 'undefined') {
      ref.current.position.y = window.scrollY * 0.004;
    }
  });

  return (
    <lineSegments ref={ref} geometry={geometry}>
      <lineBasicMaterial color="#2a4a7a" transparent opacity={0.18} />
    </lineSegments>
  );
}

export default function GlobalBackground() {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      zIndex: 0, pointerEvents: 'none',
      background: 'linear-gradient(160deg, #02050f 0%, #060a18 50%, #030610 100%)'
    }}>
      <Canvas camera={{ position: [0, 0, 6], fov: 55 }} style={{ position: 'absolute', inset: 0 }}>
        <Stars />
        <RedAlertNodes />
        <NetworkGrid />
      </Canvas>

      {/* Bottom gradient — keeps text readable near edges */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '30vh',
        background: 'linear-gradient(to bottom, transparent, #030610)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
