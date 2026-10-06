'use client';

import { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Line } from '@react-three/drei';
import * as THREE from 'three';

const NODES = [
  { id: 'dc', type: 'dc', label: 'Domain Controller', pos: [0, 2, 0] as [number,number,number] },
  { id: 'srv1', type: 'server', label: 'File Server', pos: [-2, 0.5, 0] as [number,number,number] },
  { id: 'srv2', type: 'server', label: 'Database Server', pos: [2, 0.5, 0] as [number,number,number] },
  { id: 'srv3', type: 'server', label: 'Web Server', pos: [0, 0.5, -2] as [number,number,number] },
  { id: 'pz', type: 'workstation', label: 'Patient Zero (M.E.Doc)', pos: [-3, -0.5, 1.5] as [number,number,number] },
  { id: 'ws1', type: 'workstation', label: 'Workstation 01', pos: [-3.5, -0.5, -0.5] as [number,number,number] },
  { id: 'ws2', type: 'workstation', label: 'Workstation 02', pos: [-2.5, -0.5, -2] as [number,number,number] },
  { id: 'ws3', type: 'workstation', label: 'Workstation 03', pos: [-1, -1, -3] as [number,number,number] },
  { id: 'ws4', type: 'workstation', label: 'Workstation 04', pos: [1, -1, -3] as [number,number,number] },
  { id: 'ws5', type: 'workstation', label: 'Workstation 05', pos: [2.5, -0.5, -2] as [number,number,number] },
  { id: 'ws6', type: 'workstation', label: 'Workstation 06', pos: [3.5, -0.5, -0.5] as [number,number,number] },
  { id: 'ws7', type: 'workstation', label: 'Workstation 07', pos: [3.5, -0.5, 1] as [number,number,number] },
  { id: 'ws8', type: 'workstation', label: 'Workstation 08', pos: [2, -1, 2.5] as [number,number,number] },
  { id: 'ws9', type: 'workstation', label: 'Workstation 09', pos: [0, -1, 3] as [number,number,number] },
  { id: 'ws10', type: 'workstation', label: 'Workstation 10', pos: [-2, -1, 2.5] as [number,number,number] },
];

const EDGES: [string, string][] = [
  ['dc','srv1'],['dc','srv2'],['dc','srv3'],
  ['srv1','ws1'],['srv1','ws2'],['srv1','pz'],
  ['srv2','ws5'],['srv2','ws6'],['srv2','ws7'],
  ['srv3','ws3'],['srv3','ws4'],
  ['pz','ws10'],['ws9','ws10'],['ws8','ws9'],['ws7','ws8'],
  ['ws1','ws2'],['ws2','ws3'],['ws4','ws5'],['ws5','ws6'],
];

type NodeState = 'clean' | 'infecting' | 'infected' | 'encrypting' | 'destroyed';

function resolveNodeState(id: string, simTime: number): NodeState {
  if (simTime >= 20) return 'destroyed';
  if (simTime >= 16) return 'encrypting';
  
  if (id === 'pz') {
    if (simTime >= 2) return 'infected';
    if (simTime >= 0) return 'infecting';
  }
  if (id === 'ws1' || id === 'ws10') {
    if (simTime >= 4) return 'infected';
    if (simTime >= 2) return 'infecting';
  }
  if (id === 'ws2' || id === 'ws9') {
    if (simTime >= 6) return 'infected';
    if (simTime >= 4) return 'infecting';
  }
  if (id === 'srv1') {
    if (simTime >= 8) return 'infected';
    if (simTime >= 6) return 'infecting';
  }
  if (id === 'ws3' || id === 'ws4' || id === 'ws8') {
    if (simTime >= 10) return 'infected';
    if (simTime >= 8) return 'infecting';
  }
  if (id === 'srv2' || id === 'srv3') {
    if (simTime >= 12) return 'infected';
    if (simTime >= 10) return 'infecting';
  }
  if (id === 'ws5' || id === 'ws6' || id === 'ws7') {
    if (simTime >= 14) return 'infected';
    if (simTime >= 12) return 'infecting';
  }
  if (id === 'dc') {
    if (simTime >= 16) return 'infected';
    if (simTime >= 14) return 'infecting';
  }
  
  return 'clean';
}

function getNodeColor(state: NodeState): string {
  switch (state) {
    case 'clean': return '#1e3448';
    case 'infecting': return '#8b3820';
    case 'infected': return '#c41e2a';
    case 'encrypting': return '#8b1a1a';
    case 'destroyed': return '#120808';
  }
}

function SimNode({ node, simTime, onClick, isSelected }: { node: typeof NODES[0], simTime: number, onClick: () => void, isSelected: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const state = resolveNodeState(node.id, simTime);
  const color = getNodeColor(state);
  
  const size = node.type === 'dc' ? 0.25 : node.type === 'server' ? 0.18 : 0.12;

  useFrame(() => {
    if (!meshRef.current) return;
    if (state === 'infecting') {
      const scale = 1 + Math.sin(Date.now() * 0.01) * 0.15;
      meshRef.current.scale.setScalar(scale);
    } else {
      meshRef.current.scale.setScalar(1);
    }
  });

  return (
    <group position={node.pos}>
      <mesh ref={meshRef} onClick={(e) => { e.stopPropagation(); onClick(); }}>
        {node.type === 'dc' && <octahedronGeometry args={[size]} />}
        {node.type === 'server' && <boxGeometry args={[size*1.5, size*1.5, size*1.5]} />}
        {node.type === 'workstation' && <sphereGeometry args={[size, 16, 16]} />}
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={state === 'infecting' || state === 'infected' ? 0.8 : 0.2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {isSelected && (
        <mesh>
          <ringGeometry args={[size * 1.5, size * 1.7, 32]} />
          <meshBasicMaterial color="#ffffff" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}

function SimEdges({ simTime }: { simTime: number }) {
  return (
    <group>
      {EDGES.map((edge, i) => {
        const n1 = NODES.find(n => n.id === edge[0])!;
        const n2 = NODES.find(n => n.id === edge[1])!;
        const s1 = resolveNodeState(n1.id, simTime);
        const s2 = resolveNodeState(n2.id, simTime);
        
        let color = '#1a3040';
        let linewidth = 1;
        
        if ((s1 === 'infecting' && s2 === 'infected') || (s1 === 'infected' && s2 === 'infecting')) {
          color = '#c41e2a';
          linewidth = 3;
        } else if (s1 === 'infected' && s2 === 'infected') {
          color = '#5a1e2a';
        }

        return (
          <Line
            key={i}
            points={[n1.pos, n2.pos]}
            color={color}
            lineWidth={linewidth}
            transparent
            opacity={0.6}
          />
        );
      })}
    </group>
  );
}

export function NetworkSimScene({ simTime, onNodeClick, selectedNode }: { simTime: number, onNodeClick: (id: string, label: string) => void, selectedNode: string | null }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={1} color="#aaccff" />
      
      <SimEdges simTime={simTime} />
      
      {NODES.map(node => (
        <SimNode 
          key={node.id} 
          node={node} 
          simTime={simTime} 
          onClick={() => onNodeClick(node.id, node.label)} 
          isSelected={selectedNode === node.id}
        />
      ))}

      {/* Ground plane for context */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -1.5, 0]}>
        <planeGeometry args={[12, 12]} />
        <meshBasicMaterial color="#081018" transparent opacity={0.5} />
      </mesh>
      <gridHelper args={[12, 12, '#1a3040', '#0a1520']} position={[0, -1.49, 0]} />
    </>
  );
}

export default function NetworkSim({ simTime, onNodeClick, selectedNode }: { simTime: number, onNodeClick: (id: string, label: string) => void, selectedNode: string | null }) {
  return (
    <Canvas camera={{ position: [0, 4, 8], fov: 45 }}>
      <NetworkSimScene simTime={simTime} onNodeClick={onNodeClick} selectedNode={selectedNode} />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={simTime === 0} autoRotateSpeed={0.5} maxPolarAngle={Math.PI/2 - 0.1} />
    </Canvas>
  );
}
