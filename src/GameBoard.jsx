import React, { useState, useEffect, useCallback } from 'react';
import { generateLevel, updateEnemies, TILE } from './patternGenerator';

const GameBoard = ({ config, onLevelComplete, onGameOver }) => {
  const { rows, cols, pattern } = config;
  
  // Game states
  const [grid, setGrid] = useState([]);
  const [enemies, setEnemies] = useState([]);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(30);
  const [pointsToCollect, setPointsToCollect] = useState(0);
  const [collectedPoints, setCollectedPoints] = useState(0);
  
  // End states
  const [showResult, setShowResult] = useState(null); // 'WIN' | 'LOSE'
  const [invincible, setInvincible] = useState(false); // Brief immunity after hit

  const redBlinkDurationMs = 300; // Time red flashes

  // Initialization
  useEffect(() => {
    const { grid: initGrid, enemies: initEnemies, totalPoints } = generateLevel(rows, cols, pattern);
    setGrid(initGrid);
    setEnemies(initEnemies);
    setPointsToCollect(totalPoints);
    setCollectedPoints(0);
    setLives(5);
    setTimeLeft(30);
  }, [rows, cols, pattern]);

  // Game Loop: Timer and Enemies
  useEffect(() => {
    if (showResult !== null) return;

    const timerInt = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setShowResult('LOSE');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    let speed = 100;
    if (config.difficulty === 'EASY') speed = 400;
    if (config.difficulty === 'HARD') speed = 40;

    const enemyInt = setInterval(() => {
      setEnemies(prev => updateEnemies(prev, rows, cols));
    }, speed); 

    return () => {
      clearInterval(timerInt);
      clearInterval(enemyInt);
    };
  }, [showResult, rows, cols, config.difficulty]);

  // Handle Win Condition
  useEffect(() => {
    if (pointsToCollect > 0 && collectedPoints >= pointsToCollect && showResult === null) {
      setShowResult('WIN');
    }
  }, [collectedPoints, pointsToCollect, showResult]);

  // Handle Tile Interaction (Swipe over)
  const handleInteraction = (r, c) => {
    if (showResult !== null) return;

    // Check Enemy collision
    const isEnemy = enemies.some(e => e.r === r && e.c === c);
    if (isEnemy) {
      if (!invincible) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) setShowResult('LOSE');
          return newLives;
        });
        
        // Blink overlay handled by grid UI if we forced it, but simply setting invincibility gives UX safety
        setInvincible(true);
        setTimeout(() => setInvincible(false), 500);
      }
      return; // Can't collect points on an enemy
    }

    // Check Point collection
    if (grid[r] && grid[r][c] === TILE.POINT) {
      // Create a new grid array to avoid mutation
      const newGrid = [...grid];
      newGrid[r] = [...newGrid[r]];
      newGrid[r][c] = TILE.EMPTY; // Clear point
      setGrid(newGrid);
      setCollectedPoints(p => p + 1);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '20px', width: '100%', maxWidth: '800px' }}>
      
      {/* HUD Panel with Modern Sci-Fi Constraints */}
      <div style={{ 
        flexShrink: 0, // PREVENT HUD FROM SQUASHING
        display: 'flex', justifyContent: 'space-between', marginBottom: '20px', 
        background: 'linear-gradient(180deg, rgba(20,20,30,0.95), rgba(10,10,15,0.95))', 
        padding: '15px 30px', borderRadius: '12px', 
        border: '1px solid rgba(0,240,255,0.4)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.8), inset 0 0 20px rgba(0,240,255,0.1)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <div style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '2px' }}>SYSTEM LIVES</div>
          <div style={{ color: 'var(--neon-green)', fontFamily: 'Orbitron', fontSize: '1.4rem', textShadow: '0 0 10px rgba(0,255,100,0.5)' }}>
            {'♥️'.repeat(lives)}{'♡'.repeat(5 - lives)}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '2px' }}>OBJECTIVE TIMER</div>
          <div style={{ color: 'white', fontFamily: 'Orbitron', fontSize: '1.4rem' }}>
            <span style={{ color: timeLeft <= 5 ? 'var(--neon-red)' : 'var(--neon-blue)', textShadow: `0 0 10px ${timeLeft <= 5 ? 'red' : '#00f0ff'}` }}>{timeLeft}s</span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', alignItems: 'flex-end' }}>
          <div style={{ fontSize: '0.7rem', color: '#aaa', letterSpacing: '2px' }}>DATA COLLECTED</div>
          <div style={{ color: 'var(--neon-blue)', fontFamily: 'Orbitron', fontSize: '1.4rem', textShadow: '0 0 10px rgba(0,240,255,0.5)' }}>
            {collectedPoints} / {pointsToCollect}
          </div>
        </div>
      </div>

      {/* Grid Container Wrapper */}
      <div 
        style={{ 
          flex: 1, 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', // Lock it explicitly to the center
          overflow: 'hidden', // Terminate internal scrollbars entirely
          position: 'relative',
          paddingBottom: '20px'
        }}
      >
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          gap: '2px',
          background: '#050508',
          padding: '12px',
          borderRadius: '12px',
          border: '2px solid rgba(0, 240, 255, 0.3)',
          boxShadow: '0 0 50px rgba(0,240,255,0.05), inset 0 0 30px rgba(0,0,0,1)',
          // Perfect bounding box mathematics
          maxHeight: '100%', 
          maxWidth: '100%',
          height: rows > cols ? '100%' : 'auto',
          width: cols >= rows ? '100%' : 'auto',
          aspectRatio: `${cols} / ${rows}`
        }}>
          {grid.map((row, r) => 
            row.map((cellType, c) => {
              const hasEnemy = enemies.some(e => e.r === r && e.c === c);
              
              let tileClass = 'tile-empty';
              if (hasEnemy) tileClass = 'tile-danger';
              else if (cellType === TILE.SAFE) tileClass = 'tile-safe';
              else if (cellType === TILE.POINT) tileClass = 'tile-point';

              return (
                <div 
                  key={`${r}-${c}`}
                  className={tileClass}
                  style={{ width: '100%', height: '100%', aspectRatio: '1/1' }}
                  onMouseEnter={() => handleInteraction(r, c)}
                  onMouseDown={() => handleInteraction(r, c)}
                  // Touch support for mobile swipe
                  onTouchMove={(e) => {
                     // Since touch doesn't fire mouseEnter easily on child nodes while dragging,
                     // we resolve element from point
                     const touch = e.touches[0];
                     const elem = document.elementFromPoint(touch.clientX, touch.clientY);
                     if (elem && elem.dataset.r) {
                        handleInteraction(parseInt(elem.dataset.r), parseInt(elem.dataset.c));
                     }
                  }}
                  data-r={r}
                  data-c={c}
                />
              )
            })
          )}
        </div>

        {/* State Overlays */}
        {showResult && (
          <div className="fade-in" style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
            zIndex: 10
          }}>
            <h1 style={{ 
              color: showResult === 'WIN' ? 'var(--neon-green)' : 'var(--neon-red)',
              fontSize: '4rem', textShadow: `0 0 30px ${showResult === 'WIN' ? 'green' : 'red'}` 
            }}>
              MISSION {showResult === 'WIN' ? 'ACCOMPLISHED' : 'FAILED'}
            </h1>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
              {showResult === 'WIN' && pattern === 1 && (
                <button className="btn-primary" onClick={onLevelComplete}>
                  PROCEED TO LEVEL 2
                </button>
              )}
              <button className="btn-primary" onClick={onGameOver}>
                RETURN TO MENU
              </button>
            </div>
          </div>
        )}

        {/* Global Damage Overlay briefly flashes red when hurt */}
        {invincible && showResult === null && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(255,0,0,0.2)', pointerEvents: 'none',
            animation: 'blinkRed 0.5s ease-out'
          }} />
        )}

      </div>
    </div>
  );
};

export default GameBoard;
