import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

// To jest "magia" AI - niestandardowy shader (program graficzny),
// który oblicza pozycje i kolory cząsteczek na karcie graficznej.
// Człowiek pisałby to godzinami, AI generuje to w sekundy.
const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  attribute float aRandom;
  varying vec3 vColor;

  // Funkcja szumu do generowania naturalnych fal
  // (autorstwa Inigo Quilez - standard w branży)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec3 pos = position;
    
    // Interakcja z myszką - odpychanie
    float dist = distance(uMouse, pos.xy);
    float influence = 1.0 - smoothstep(0.0, 2.5, dist);
    pos.z += influence * 2.0;

    // Falowanie w czasie oparte na szumie i losowości
    float noiseVal = snoise(vec2(pos.x * 0.5 + uTime * 0.2, pos.y * 0.5 + aRandom));
    pos.z += noiseVal * 1.5;
    
    // Obliczanie koloru na podstawie pozycji Z (wysokości)
    vec3 colorHigh = vec3(0.1, 0.8, 1.0); // Cyjan
    vec3 colorLow = vec3(0.8, 0.1, 0.5); // Róż
    vColor = mix(colorLow, colorHigh, (pos.z + 2.0) / 4.0);

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    // Rozmiar cząsteczki zależny od odległości od kamery
    gl_PointSize = (8.0 * (1.0 + influence * 2.0)) * (1.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  void main() {
    // Tworzymy okrągłą cząsteczkę zamiast kwadratowej
    float dist = distance(gl_PointCoord, vec2(0.5));
    if (dist > 0.5) discard;
    
    gl_FragColor = vec4(vColor, 1.0);
  }
`;

// Komponent React renderujący chmurę punktów
function Particles() {
  const meshRef = useRef<THREE.Points>(null);
  const { viewport, mouse } = useThree();

  // Generujemy dane dla 15000 cząsteczek
  const count = 15000;
  const [positions, randoms] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Rozrzucamy je w przestrzeni
      positions[i * 3] = (Math.random() - 0.5) * 10;     // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2;  // z
      randoms[i] = Math.random();
    }
    return [positions, randoms];
  }, []);

  // Uniforms to zmienne przekazywane z CPU (JS) do GPU (Shader)
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    }),
    []
  );

  // Ta pętla wykonuje się w każdej klatce animacji (np. 60 razy na sekundę)
  useFrame((state) => {
    const { clock } = state;
    if (meshRef.current) {
       // Aktualizujemy czas w shaderze
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = clock.getElapsedTime();
      
      // Konwertujemy pozycję myszki na współrzędne świata 3D
      const vector = new THREE.Vector3(mouse.x * viewport.width / 2, mouse.y * viewport.height / 2, 0);
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uMouse.value = new THREE.Vector2(vector.x, vector.y);
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
         <bufferAttribute
          attach="attributes-aRandom"
          count={randoms.length}
          array={randoms}
          itemSize={1}
        />
      </bufferGeometry>
      {/* Używamy naszego niestandardowego shadera */}
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// Główny komponent aplikacji
function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#050505' }}>
      {/* Canvas to nasze płótno 3D */}
      <Canvas camera={{ position: [0, 0, 6], fov: 75 }}>
        <Particles />
        {/* Pozwala obracać kamerą za pomocą myszki (przytrzymaj lewy przycisk) */}
        <OrbitControls enableZoom={false} />
      </Canvas>
      
      <div style={{
        position: 'absolute', 
        top: '20px', 
        left: '20px', 
        color: 'white', 
        fontFamily: 'sans-serif',
        pointerEvents: 'none'
      }}>
        <h1>AI Frontend Wow Effect</h1>
        <p>Ruszaj myszką po ekranie. Przytrzymaj i obracaj.</p>
        <p style={{opacity: 0.7, fontSize: '0.9em'}}>
          Wygenerowano 15k interaktywnych cząsteczek na GPU.
        </p>
      </div>
    </div>
  );
}

export default App;