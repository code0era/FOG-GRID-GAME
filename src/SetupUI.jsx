import React, { useState } from 'react';

const SetupUI = ({ onStart, initialConfig }) => {
  const [rows, setRows] = useState(initialConfig.rows);
  const [cols, setCols] = useState(initialConfig.cols);
  const [pattern, setPattern] = useState(initialConfig.pattern);
  const [difficulty, setDifficulty] = useState(initialConfig.difficulty || 'MEDIUM');

  const handleSubmit = (e) => {
    e.preventDefault();
    const r = Math.max(10, parseInt(rows) || 10);
    const c = Math.max(10, parseInt(cols) || 10);
    onStart(r, c, pattern, difficulty);
  };

  return (
    <div className="fade-in" style={{
      background: 'rgba(10, 10, 15, 0.85)',
      padding: '25px',
      borderRadius: '12px',
      border: '1px solid var(--neon-blue)',
      boxShadow: '0 0 40px rgba(0,240,255,0.15)',
      backdropFilter: 'blur(10px)',
      width: '400px',
      maxWidth: '90vw',
      textAlign: 'center',
      margin: 'auto'
    }}>
      <h3 style={{ color: 'var(--neon-blue)', letterSpacing: '2px', marginBottom: '20px', textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>INITIALIZE MATRIX</h3>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontFamily: 'Orbitron', color: '#ccc', fontSize: '0.9rem' }}>ROWS (Min 10):</label>
          <input 
            type="number" 
            min="10" 
            value={rows} 
            onChange={e => setRows(e.target.value)}
            style={{ width: '80px', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--neon-blue)', color: 'white', fontFamily: 'Orbitron', textAlign: 'center' }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontFamily: 'Orbitron', color: '#ccc', fontSize: '0.9rem' }}>COLS (Min 10):</label>
          <input 
            type="number" 
            min="10" 
            value={cols} 
            onChange={e => setCols(e.target.value)}
            style={{ width: '80px', padding: '10px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--neon-blue)', color: 'white', fontFamily: 'Orbitron', textAlign: 'center' }}
          />
        </div>

        <div style={{ margin: '15px 0' }}>
          <div style={{ fontFamily: 'Orbitron', color: '#ccc', fontSize: '0.8rem', marginBottom: '10px' }}>DIFFICULTY PROTOCOL</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['EASY', 'MEDIUM', 'HARD'].map(lvl => (
              <button 
                key={lvl} type="button" onClick={() => setDifficulty(lvl)}
                style={{
                  flex: 1, padding: '8px', fontSize: '0.75rem',
                  background: difficulty === lvl ? 'rgba(0,240,255,0.2)' : 'rgba(0,0,0,0.4)',
                  border: `1px solid ${difficulty === lvl ? 'var(--neon-blue)' : '#333'}`,
                  color: difficulty === lvl ? 'var(--neon-blue)' : '#888',
                  fontFamily: 'Orbitron', cursor: 'pointer',
                  textShadow: difficulty === lvl ? '0 0 5px var(--neon-blue)' : 'none'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        <div style={{ margin: '10px 0' }}>
          <div style={{ fontFamily: 'Orbitron', color: '#ccc', fontSize: '0.8rem', marginBottom: '10px' }}>SELECT ALGORITHM</div>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[1, 2].map(pat => (
              <button 
                key={pat} type="button" onClick={() => setPattern(pat)}
                style={{
                  flex: 1, padding: '10px', 
                  background: pattern === pat ? 'rgba(0,240,255,0.2)' : 'rgba(0,0,0,0.4)',
                  border: `1px solid ${pattern === pat ? 'var(--neon-blue)' : '#444'}`,
                  color: pattern === pat ? 'var(--neon-blue)' : '#aaa',
                  fontFamily: 'Orbitron', cursor: 'pointer'
                }}
              >
                PATTERN {pat}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '10px' }}>
          ENGAGE GRID
        </button>
      </form>
    </div>
  );
};

export default SetupUI;
