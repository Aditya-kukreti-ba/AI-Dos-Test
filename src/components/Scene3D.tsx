import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function FloatingShape({ 
  position, 
  color, 
  geometry, 
  speed = 1,
  scale = 1 
}: { 
  position: [number, number, number]; 
  color: string; 
  geometry: 'icosahedron' | 'torus' | 'octahedron' | 'dodecahedron';
  speed?: number;
  scale?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15 * speed;
      meshRef.current.rotation.y += delta * 0.2 * speed;
    }
  });

  const geometryElement = {
    icosahedron: <icosahedronGeometry args={[1, 0]} />,
    torus: <torusGeometry args={[1, 0.35, 16, 32]} />,
    octahedron: <octahedronGeometry args={[1, 0]} />,
    dodecahedron: <dodecahedronGeometry args={[1, 0]} />,
  }[geometry];

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {geometryElement}
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.12}
          wireframe
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

export default function Scene3D() {
  return (
    <div className="canvas-bg">
      <Canvas camera={{ position: [0, 0, 12], fov: 55 }}>
        <ambientLight intensity={0.15} />
        <pointLight position={[5, 5, 5]} color="#2dd4bf" intensity={0.8} />
        <pointLight position={[-5, -3, 3]} color="#a78bfa" intensity={0.6} />
        <pointLight position={[0, 3, -5]} color="#f472b6" intensity={0.4} />

        <FloatingShape position={[-4, 2, -2]} color="#2dd4bf" geometry="icosahedron" scale={1.5} speed={0.8} />
        <FloatingShape position={[4, -1, -3]} color="#a78bfa" geometry="torus" scale={1.3} speed={1.2} />
        <FloatingShape position={[-2, -3, -1]} color="#f472b6" geometry="octahedron" scale={1.1} speed={0.6} />
        <FloatingShape position={[3, 3, -4]} color="#fbbf24" geometry="dodecahedron" scale={0.9} speed={1} />
        <FloatingShape position={[0, 0, -6]} color="#2dd4bf" geometry="torus" scale={2} speed={0.4} />
      </Canvas>
    </div>
  );
}
