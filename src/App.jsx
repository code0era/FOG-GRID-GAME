import React, { useState } from 'react';
import SetupUI from './SetupUI';
import GameBoard from './GameBoard';
import GalaxyBackground from './GalaxyBackground';

function App() {
  const [gameState, setGameState] = useState('MENU'); // MENU, PLAYING
  const [config, setConfig] = useState({ rows: 20, cols: 10, pattern: 1, difficulty: 'MEDIUM' });

  const handleStart = (rows, cols, pattern, difficulty) => {
    setConfig({ rows, cols, pattern, difficulty });
    setGameState('PLAYING');
  };

  const handleMenuReturn = () => {
    setGameState('MENU');
  };

  const handleNextLevel = () => {
    setConfig(c => ({...c, pattern: 2}));
    setGameState('PLAYING');
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <GalaxyBackground />
      {/* Top Banner */}
      <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,240,255,0.2)', background: 'linear-gradient(90deg, rgba(0,0,0,0.8), rgba(0,240,255,0.05))', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--neon-blue)', letterSpacing: '4px', textShadow: '0 0 15px rgba(0,240,255,0.5)' }}>FOG DYNAMIC GRID</h2>
          <div style={{ fontSize: '0.8rem', color: '#888', marginTop: '5px' }}>ROUTING SUITE v2.0</div>
        </div>
        
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.7rem', color: '#555', letterSpacing: '1px' }}>OPERATIVE LOGGED IN</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--neon-green)', fontFamily: 'Orbitron' }}>GUEST_001</div>
          </div>
          {gameState === 'PLAYING' && (
            <button className="btn-danger" style={{ padding: '8px 20px', fontSize: '0.9rem', borderRadius: '4px' }} onClick={handleMenuReturn}>
              ABORT MISSION
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        overflowY: 'auto', 
        overflowX: 'hidden',
        paddingBottom: '20px' // Space before footer
      }}>
        {gameState === 'MENU' ? (
          <SetupUI onStart={handleStart} initialConfig={config} />
        ) : (
          <GameBoard config={config} onLevelComplete={handleNextLevel} onGameOver={handleMenuReturn} />
        )}
      </div>

      {/* Global Static Footer */}
      <div style={{
        width: '100%', 
        textAlign: 'center', pointerEvents: 'none',
        display: 'flex', flexDirection: 'column', gap: '5px',
        padding: '15px 0',
        background: 'rgba(5, 5, 8, 0.9)',
        borderTop: '2px solid var(--neon-blue)',
        boxShadow: '0 -5px 15px rgba(0, 240, 255, 0.2)'
      }}>
        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)', letterSpacing: '3px', fontFamily: 'Orbitron' }}>
          METHODS: SWIPE TO COLLECT BLUE. AVOID RED HOSTILES. SAFE ZONES IN GREEN.
        </div>
        <div style={{ fontSize: '0.65rem', color: 'var(--neon-blue)', letterSpacing: '2px', textShadow: '0 0 5px var(--neon-blue)' }}>
          © {new Date().getFullYear()} COPYRIGHT MADE BY LOVE : CODEERA PRODUCT | ESTABLISHED {new Date().toLocaleString('default', { month: 'long', year: 'numeric' }).toUpperCase()}
        </div>
      </div>
    </div>
  );
}

export default App;
