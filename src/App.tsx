// src/App.tsx
import React, { useState } from 'react';
import ParticlesScene from './components/ParticlesScene';
import GlassScene from './components/GlassScene';

// Definiujemy styl dla przycisków nawigacji (żeby było ładnie)
const navStyle: React.CSSProperties = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  display: 'flex',
  gap: '10px',
  zIndex: 1000, // Musi być na wierzchu Canvasa
};

const buttonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '10px 20px',
  background: isActive ? 'white' : 'rgba(255,255,255,0.2)',
  color: isActive ? 'black' : 'white',
  border: '1px solid white',
  borderRadius: '20px',
  cursor: 'pointer',
  fontFamily: 'sans-serif',
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(5px)'
});


function App() {
  // STAN APLIKACJI: Decyduje, który widok jest aktualnie renderowany.
  // Domyślnie ustawiamy 'particles'.
  const [activeView, setActiveView] = useState<'particles' | 'glass'>('particles');

  return (
    // Kontener na całą stronę. Ważne: position relative, żeby przyciski absolute działały.
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Nawigacja */}
      <div style={navStyle}>
        <button 
          style={buttonStyle(activeView === 'particles')}
          onClick={() => setActiveView('particles')}
        >
          Cząsteczki (GPU Shader)
        </button>
        <button 
          style={buttonStyle(activeView === 'glass')}
          onClick={() => setActiveView('glass')}
        >
          Szklany Artefakt (Transmission)
        </button>
      </div>

      {/* WARUNKOWE RENDEROWANIE */}
      {/* Jeśli activeView to 'particles', pokaż ParticlesScene. W przeciwnym razie null. */}
      {activeView === 'particles' && (
         <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
             <ParticlesScene />
             {/* Stary opis dla cząsteczek */}
             <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: 'white', fontFamily: 'sans-serif', pointerEvents: 'none' }}>
                 <h1>Interaktywne Cząsteczki</h1>
                 <p style={{opacity: 0.7}}>Ruszaj myszką, aby odpychać.</p>
             </div>
         </div>
      )}

      {/* Jeśli activeView to 'glass', pokaż GlassScene. */}
      {activeView === 'glass' && (
         <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
            <GlassScene />
             {/* Nowy opis dla szkła */}
             <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: 'black', fontFamily: 'sans-serif', pointerEvents: 'none' }}>
                 <h1>Szklana Refrakcja</h1>
                 <p style={{opacity: 0.7}}>Symulacja fizyki światła w czasie rzeczywistym.</p>
             </div>
         </div>
      )}
    </div>
  );
}

export default App;