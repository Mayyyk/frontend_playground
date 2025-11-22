// src/components/GlassScene.tsx
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshTransmissionMaterial, Environment, Float, Text } from '@react-three/drei';
import * as THREE from 'three';

function GlassTorus() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Używamy useFrame do ciągłej, powolnej rotacji obiektu
  // Daje to odczucie "smooth floating"
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.1;
      meshRef.current.rotation.y += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} scale={1.5}>
      {/* Skomplikowana geometria - węzeł torusa */}
      <torusKnotGeometry args={[1, 0.35, 128, 32]} />
      
      {/* MAGIA: MeshTransmissionMaterial.
        To nie jest zwykłe szkło. To materiał symulujący załamanie światła (refrakcję)
        w oparciu o to, co znajduje się za obiektem (Environment).
      */}
      <MeshTransmissionMaterial
        backside={true} // Renderuje też tylną ściankę dla lepszego efektu
        samples={16} // Jakość próbkowania (wyżej = ładniej, ale wolniej)
        thickness={1.2} // Jak "grube" jest szkło. Wpływa na zniekształcenie
        chromaticAberration={0.6} // Rozszczepienie kolorów (efekt pryzmatu) na krawędziach
        anisotropy={0.5} // Kierunkowe rozmycie
        distortion={0.5} // Dodatkowe falowanie szkła
        distortionScale={0.5}
        temporalDistortion={0.1} // Zmienność zniekształcenia w czasie
        iridescence={1} // Tęczowy połysk na powierzchni
        iridescenceIOR={1.3}
        iridescenceThicknessRange={[0, 1400]}
        roughness={0.1} // Lekka chropowatość, jak zmrożone szkło
      />
    </mesh>
  );
}

export default function GlassScene() {
  return (
    // Ustawiamy jasne tło dla kontrastu ze szkłem
    <Canvas camera={{ position: [0, 0, 5], fov: 50 }} style={{ background: '#f0f0f0' }}>
      {/* Komponent Float dodaje delikatne unoszenie się w górę i w dół */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <GlassTorus />
      </Float>

      {/* Dodajemy tekst 3D w tle */}
      <Text position={[0, 0, -2]} color="black" anchorX="center" anchorY="middle">
        GLASS
      </Text>

      {/* Environment to klucz do realistycznego szkła. 
        Szkło musi mieć COŚ do odbijania i załamywania.
        Używamy presetu "city", który ładuje mapę HDRI miasta (niewidoczną, ale wpływającą na światło).
      */}
      <Environment preset="city" blur={1} />
      
      {/* autoRotate dodaje kinowego wrażenia */}
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} enableZoom={false} />
    </Canvas>
  );
}