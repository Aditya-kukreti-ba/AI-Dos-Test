import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

function GlowNode({ position, color, scale = 0.12 }: { position: [number, number, number]; color: string; scale?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.02);
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.9} />
    </mesh>
  );
}

function FloatingCube({ position, color, speed = 1 }: { position: [number, number, number]; color: string; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.3 * speed;
      ref.current.rotation.y += delta * 0.4 * speed;
    }
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.6}>
      <mesh ref={ref} position={position} scale={0.35}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={color} transparent opacity={0.15} wireframe emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </Float>
  );
}

function NetworkMesh() {
  const ref = useRef<THREE.Points>(null);
  const particleCount = 80;

  const positions = useRef(new Float32Array(particleCount * 3));
  const velocities = useRef(new Float32Array(particleCount * 3));

  if (positions.current[0] === 0 && positions.current[1] === 0) {
    for (let i = 0; i < particleCount; i++) {
      positions.current[i * 3]     = (Math.random() - 0.5) * 16;
      positions.current[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions.current[i * 3 + 2] = (Math.random() - 0.5) * 8 - 3;
      velocities.current[i * 3]     = (Math.random() - 0.5) * 0.003;
      velocities.current[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
      velocities.current[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
  }

  useFrame(() => {
    if (!ref.current) return;
    const pos = positions.current;
    const vel = velocities.current;
    for (let i = 0; i < particleCount; i++) {
      pos[i * 3]     += vel[i * 3];
      pos[i * 3 + 1] += vel[i * 3 + 1];
      pos[i * 3 + 2] += vel[i * 3 + 2];
      if (Math.abs(pos[i * 3])     > 8) vel[i * 3]     *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 5) vel[i * 3 + 1] *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 4) vel[i * 3 + 2] *= -1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#14b8a6" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

function HeroShapes() {
  return (
    <>
      <Float speed={1} rotationIntensity={0.15} floatIntensity={0.4}>
        <mesh position={[0, 0, -3]} scale={1.8}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial color="#14b8a6" transparent opacity={0.06} wireframe emissive="#14b8a6" emissiveIntensity={0.1} />
        </mesh>
      </Float>

      <GlowNode position={[-3.5, 1.5, -1]} color="#14b8a6" scale={0.1} />
      <GlowNode position={[3.2, -1, -2]}   color="#8b5cf6" scale={0.08} />
      <GlowNode position={[-1.5, -2, 0]}   color="#f59e0b" scale={0.06} />
      <GlowNode position={[2, 2.5, -1.5]}  color="#14b8a6" scale={0.07} />
      <GlowNode position={[0.5, -0.5, 1]}  color="#8b5cf6" scale={0.05} />

      <FloatingCube position={[-4, -1.5, -2]}  color="#8b5cf6" speed={0.6} />
      <FloatingCube position={[4.5, 2, -3]}    color="#14b8a6" speed={0.8} />
      <FloatingCube position={[1.5, 3, -1]}    color="#f59e0b" speed={0.5} />
      <FloatingCube position={[-2, 3, -2.5]}   color="#14b8a6" speed={0.7} />
    </>
  );
}

export default function HeroScene3D() {
  return (
    <Canvas camera={{ position: [0, 0, 8], fov: 50 }} style={{ position: 'absolute', inset: 0 }}>
      <ambientLight intensity={0.1} />
      <pointLight position={[5, 5, 5]}   color="#14b8a6" intensity={0.6} distance={20} />
      <pointLight position={[-5, -3, 3]} color="#8b5cf6" intensity={0.4} distance={15} />
      <pointLight position={[0, 4, -4]}  color="#f59e0b" intensity={0.3} distance={12} />

      <HeroShapes />
      <NetworkMesh />
    </Canvas>
  );
}