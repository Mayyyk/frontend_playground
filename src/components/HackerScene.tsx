// src/components/HackerScene.tsx
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMemo, useRef } from 'react';

// Helper function to generate random hacker-style text
const generateHackerText = () => {
  const chars = '0123456789ABCDEF!@#$%^&*()_+-=[]{}|;:,.<>?';
  const lines = [
    'ACCESS_DENIED', 'INITIATING_HACK', 'BYPASS_SECURITY', 'ROOT_ACCESS',
    'DECRYPTING...', 'CONNECTION_LOST', 'FIREWALL_BREACHED', '0xDEADBEEF',
    '10101011010', 'LOGIN_FAILURE', 'auth.log', 'kernel_panic',
    'sudo rm -rf /', 'SELECT * FROM users;', 'DROP TABLE passwords;'
  ];
  const randomLine = lines[Math.floor(Math.random() * lines.length)];
  let randomChars = '';
  for (let i = 0; i < 10; i++) {
    randomChars += chars[Math.floor(Math.random() * chars.length)];
  }
  return Math.random() > 0.5 ? randomLine : randomChars;
};

// A single floating code line
function CodeLine({ initialPosition }: { initialPosition: [number, number, number] }) {
  const textRef = useRef<THREE.Mesh>(null!);
  const textContent = useMemo(() => generateHackerText(), []);

  useFrame(({ clock }) => {
    if (textRef.current) {
      // Simple floating animation: move up and fade
      textRef.current.position.y += 0.1; // Speed
      
      // Reset when it goes off-screen
      if (textRef.current.position.y > 25) {
        textRef.current.position.y = -25;
      }
      
      // Optional: Add some subtle horizontal movement
      textRef.current.position.x += Math.sin(clock.getElapsedTime() + initialPosition[0]) * 0.01;
    }
  });

  return (
    <Text
      ref={textRef}
      position={initialPosition}
      fontSize={0.5}
      color="#00ff00" // Classic green hacker text
      font="https://cdn.jsdelivr.net/gh/tonsky/FiraCode/distr/ttf/FiraCode-Regular.ttf" // A good monospace font is key
      anchorX="center"
      anchorY="middle"
      material-toneMapped={false} // Makes the color glow if bloom is on
    >
      {textContent}
    </Text>
  );
}

// The main scene component
export default function HackerScene() {
    const count = 200; // Number of code lines
    const lines = useMemo(() => {
        return Array.from({ length: count }, () => {
            const x = THREE.MathUtils.randFloatSpread(30); // Spread horizontally
            const y = THREE.MathUtils.randFloatSpread(50); // Spread vertically
            const z = THREE.MathUtils.randFloatSpread(10); // Spread in depth
            return <CodeLine key={`${x}-${y}-${z}`} initialPosition={[x, y, z]} />;
        });
    }, [count]);

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} color="#00ff00" intensity={0.5}/>
      <fog attach="fog" args={['#000000', 15, 30]} />
      {/* {lines} */}
    </>
  );
}
