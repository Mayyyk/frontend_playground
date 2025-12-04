// src/App.tsx
import React, { useState } from 'react';
import ParticlesScene from './components/ParticlesScene';
import GlassScene from './components/GlassScene';
import HackerScene from './components/HackerScene';

// Style for the navigation buttons
const navStyle: React.CSSProperties = {
  position: 'absolute',
  top: '20px',
  right: '20px',
  display: 'flex',
  gap: '10px',
  zIndex: 1000, // Must be on top of the Canvas
};

const buttonStyle = (isActive: boolean): React.CSSProperties => ({
  padding: '10px 20px',
  background: isActive ? 'white' : 'rgba(255,255,255,0.2)',
  color: isActive ? 'black' : 'white',
  border: '1px solid white',
  borderRadius: '20px',
  cursor: 'pointer',
  fontFamily: "'JetBrains Mono', monospace",
  fontWeight: 'bold',
  transition: 'all 0.3s ease',
  backdropFilter: 'blur(5px)'
});


function App() {
  // APP STATE: Decides which view is currently rendered.
  // By default, set to 'particles'.
  const [activeView, setActiveView] = useState<'particles' | 'glass' | 'hacker'>('particles');

  return (
    // Container for the entire page. Important: position relative for the absolute buttons to work.
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      
      {/* Navigation */}
      <div style={navStyle}>
        <button 
          style={buttonStyle(activeView === 'particles')}
          onClick={() => setActiveView('particles')}
        >
          Particles (GPU Shader)
        </button>
        <button 
          style={buttonStyle(activeView === 'glass')}
          onClick={() => setActiveView('glass')}
        >
          Glass Artifact (Transmission)
        </button>
        <button 
          style={buttonStyle(activeView === 'hacker')}
          onClick={() => setActiveView('hacker')}
        >
          Hacker Matrix (AI)
        </button>
      </div>

      {/* CONDITIONAL RENDERING */}
      {/* If activeView is 'particles', show ParticlesScene. Otherwise null. */}
      {activeView === 'particles' && (
         <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
             <ParticlesScene />
             {/* Description for particles */}
             <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: 'white', fontFamily: "'JetBrains Mono', monospace", pointerEvents: 'none' }}>
                 <h1>Interactive Particles</h1>
                 <p style={{opacity: 0.7}}>Move the mouse to repel.</p>
             </div>
         </div>
      )}

      {/* If activeView is 'glass', show GlassScene. */}
      {activeView === 'glass' && (
         <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0}}>
            <GlassScene />
             {/* Description for glass */}
             <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: 'black', fontFamily: "'JetBrains Mono', monospace", pointerEvents: 'none' }}>
                 <h1>Glass Refraction</h1>
                 <p style={{opacity: 0.7}}>Real-time simulation of light physics.</p>
             </div>
         </div>
      )}
      
      {/* If activeView is 'hacker', show HackerScene. */}
      {activeView === 'hacker' && (
         <div style={{width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, background: '#000'}}>
            <HackerScene />
             {/* Description for hacker scene */}
             <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: '#00ff00', fontFamily: "'JetBrains Mono', monospace", pointerEvents: 'none' }}>
                 <h1>Hacker Matrix</h1>
                 <p style={{opacity: 0.7}}>Visualizing a rogue AI...</p>
             </div>
         </div>
      )}
    </div>
  );
}

export default App;