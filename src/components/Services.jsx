import React, { Suspense, useRef, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls, Float, Points } from "@react-three/drei";
import * as THREE from "three";

// Sparkles around each panel
function PanelSparkles({ position, color }) {
  const pointsRef = useRef();
  const count = 60;
  const positions = new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 1.5);

  useFrame(() => {
    if (pointsRef.current) pointsRef.current.rotation.y += 0.005;
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.05} sizeAttenuation />
    </points>
  );
}

// Panels with 3D image and floating effect
function ServicePanel({ position, color, title, description, image }) {
  const meshRef = useRef();
  const { mouse } = useThree();
  const [hovered, setHovered] = useState(false);

  const texture = useMemo(() => new THREE.TextureLoader().load(image), [image]);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.003;
    meshRef.current.position.y = position[1] + Math.sin(Date.now() / 1000) * 0.15;

    const dx = meshRef.current.position.x - mouse.x * 10;
    const dz = meshRef.current.position.z - mouse.y * 10;
    const dist = Math.sqrt(dx * dx + dz * dz);

    const scale = hovered ? 1.3 : 1 + Math.max(0, 0.5 - dist * 0.05);
    meshRef.current.scale.set(scale, scale, scale);

    meshRef.current.material.emissiveIntensity = hovered
      ? 0.9
      : Math.min(0.7, Math.max(0.2, 0.7 - dist * 0.05));
  });

  return (
    <>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh
          ref={meshRef}
          position={position}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          {/* Taller panel */}
          <boxGeometry args={[3, 3.5, 0.3]} />
          <meshStandardMaterial
            color={color}
            transparent
            opacity={0.75}
            metalness={0.8}
            roughness={0.2}
            emissive={color}
            emissiveIntensity={0.2}
            map={texture}
          />
          <Html center>
            <div className="w-64 p-4 bg-white/70 backdrop-blur-md rounded-xl shadow-lg text-center pointer-events-none">
              <img src={image} alt={title} className="w-full h-28 object-cover rounded-lg mb-2" />
              <h3 className="font-serif text-2xl mb-1" style={{ color: "#8B0000" }}>{title}</h3>
              <p className="text-sm text-gray-700">{description}</p>
            </div>
          </Html>
        </mesh>
      </Float>
      <PanelSparkles position={position} color={color} />
    </>
  );
}

export default function Services3D() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const services = [
    { title: "Intimate Celebrations", description: "Small, personal gatherings with elegance.", color: "#B22222", image: "public/images/intimate.jpg" },
    { title: "Grand Events", description: "Lavish weddings, corporate galas, and more.", color: "#FFD700", image: "public/images/grand.jpg" },
    { title: "Decoration Services", description: "Creative floral, lighting, and theme decor.", color: "#DAA520", image: "public/images/decor.jpg" },
    { title: "Full Event Management", description: "Complete planning and execution of your events.", color: "#CD853F", image: "public/images/management.jpg" },
  ];

  const radius = 6;
  const positions = services.map((_, i) => [
    Math.cos((i / services.length) * 2 * Math.PI) * radius,
    0,
    Math.sin((i / services.length) * 2 * Math.PI) * radius,
  ]);

  return (
    <div
      className="w-full h-[900px] my-20 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #E6B8A2 0%, #FFD966 50%, #C49A6C 100%)" }}
      onMouseMove={(e) => setCursorPos({ x: e.clientX, y: e.clientY })}
    >
      {/* ================== Event-Themed Custom Cursor ================== */}
      <div
        style={{
          position: "fixed",
          top: cursorPos.y - 32,
          left: cursorPos.x - 32,
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "radial-gradient(circle, #FFD700, #B22222)",
          pointerEvents: "none",
          zIndex: 9999,
          mixBlendMode: "screen",
          filter: "blur(20px)",
          transition: "top 0.02s, left 0.02s",
        }}
      />

      {/* ================== Heading ================== */}
      <h2
        className="absolute top-6 left-1/2 -translate-x-1/2 text-5xl font-serif font-bold drop-shadow-lg z-10 tracking-wide"
        style={{ color: "#8B0000" }}
      >
        Our Services
      </h2>

      {/* ================== 3D Canvas ================== */}
      <Canvas
        camera={{ position: [0, 3, 14], fov: 55 }}
        style={{ background: "transparent" }} // Transparent canvas
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <Suspense fallback={null}>
          {/* Golden stars */}
          <Points
            positions={Array.from({ length: 300 }, () => [
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 50,
              (Math.random() - 0.5) * 50,
            ])}
            stride={3}
          >
            <pointsMaterial color="#FFD700" size={0.1} sizeAttenuation />
          </Points>

          {services.map((service, i) => (
            <ServicePanel
              key={i}
              position={positions[i]}
              title={service.title}
              description={service.description}
              color={service.color}
              image={service.image}
            />
          ))}
        </Suspense>
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.4} />
      </Canvas>
    </div>
  );
}
