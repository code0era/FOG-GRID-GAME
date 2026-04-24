// Utilities for generating initial grid array and moving enemies

export const TILE = {
  EMPTY: 0,
  SAFE: 1,   // Green
  POINT: 2,  // Blue
};

// Generates the static grid (Points and Safe Zones) and the initial Enemy list
export function generateLevel(rows, cols, patternMode) {
  let grid = [];
  let enemies = [];
  let totalPoints = 0;

  for (let r = 0; r < rows; r++) {
    let rowArr = [];
    for (let c = 0; c < cols; c++) {
      rowArr.push(TILE.EMPTY);
    }
    grid.push(rowArr);
  }

  if (patternMode === 1) {
    // LEVEL 1: Aggressive Helix Paths
    for (let c = 0; c < cols; c++) {
      grid[rows - 1][c] = TILE.SAFE;
    }

    // MASSIVE amounts of Blue Points scattered pseudo-randomly
    for (let r = 0; r < rows - 2; r++) {
      for(let c = 1; c < cols - 1; c++) {
         if (Math.random() > 0.4) { // Increased density to 60%!
            grid[r][c] = TILE.POINT;
            totalPoints++;
         }
      }
    }

    // Spawn massive amounts of Red Enemies that move horizontally
    for (let r = 1; r < rows - 2; r++) {
      if (Math.random() > 0.3) {
        enemies.push({
          id: `e1_${r}_a`,
          r: r, c: (r % cols),
          dr: (Math.random() > 0.5 ? 1 : -1), // Random jump variants occasionally 
          dc: (r % 2 === 0) ? 1 : -1 // Move left or right
        });
      }
    }
  } else {
    // LEVEL 2: Border safe zones, highly erratic moving tracks
    for (let r = 1; r < rows - 1; r++) {
      grid[r][1] = TILE.SAFE; grid[r][cols - 2] = TILE.SAFE;
    }
    for (let c = 1; c < cols - 1; c++) {
      grid[1][c] = TILE.SAFE; grid[rows - 2][c] = TILE.SAFE;
    }

    let mR = Math.floor(rows / 2);
    let mC = Math.floor(cols / 2);
    grid[mR-2][mC-1] = TILE.SAFE; grid[mR-2][mC] = TILE.SAFE;
    grid[mR+1][mC-1] = TILE.SAFE; grid[mR+1][mC] = TILE.SAFE;
    grid[mR-1][mC-2] = TILE.SAFE; grid[mR][mC-2] = TILE.SAFE;
    grid[mR-1][mC+1] = TILE.SAFE; grid[mR][mC+1] = TILE.SAFE;

    // Extremely heavy density of blue points!
    for (let r = 2; r < rows - 2; r++) {
      for (let c = 2; c < cols - 2; c++) {
        if (grid[r][c] === TILE.EMPTY && (r < mR-2 || r > mR+1)) {
          if (Math.random() > 0.2) { // 80% coverage
            grid[r][c] = TILE.POINT;
            totalPoints++;
          }
        }
      }
    }

    // Vastly Increased Enemies
    for(let i=0; i<8; i++){
      enemies.push({ id: `e2_outL${i}`, r: i*3, c: 0, dr: 1, dc: 0, minR: 0, maxR: rows-1 });
      enemies.push({ id: `e2_outR${i}`, r: rows-1-(i*3), c: cols-1, dr: -1, dc: 0, minR: 0, maxR: rows-1 });
    }
    
    enemies.push({ id: `e2_in1`, r: mR-1, c: mC-1, dr: 0, dc: 1, minC: mC-1, maxC: mC });
    enemies.push({ id: `e2_in2`, r: mR, c: mC, dr: 0, dc: -1, minC: mC-1, maxC: mC });
  }

  // Fallback if no points generated safely
  if (totalPoints === 0) {
    grid[Math.floor(rows/4)][Math.floor(cols/2)] = TILE.POINT;
    totalPoints = 1;
  }

  return { grid, enemies, totalPoints };
}

// Function to update enemy positions
export function updateEnemies(enemies, rows, cols) {
  return enemies.map((e) => {
    let newDr = e.dr;
    let newDc = e.dc;

    // Inject 15% chance of erratic speed bursts or spontaneous direction changes
    if (Math.random() < 0.15) {
      newDr = Math.random() > 0.5 ? e.dr : -e.dr; // Occasionally backflip
      newDc = Math.random() > 0.5 ? e.dc : -e.dc; 
    }

    let newR = e.r + newDr;
    let newC = e.c + newDc;

    const boundMinR = e.minR !== undefined ? e.minR : 0;
    const boundMaxR = e.maxR !== undefined ? e.maxR : rows - 1;
    const boundMinC = e.minC !== undefined ? e.minC : 0;
    const boundMaxC = e.maxC !== undefined ? e.maxC : cols - 1;

    // Bounce off strict vertical bounds
    if (newR < boundMinR || newR > boundMaxR) {
      newDr = -e.dr;
      newR = e.r + newDr;
      if (newR < boundMinR) newR = boundMinR;
      if (newR > boundMaxR) newR = boundMaxR;
    }
    
    // Bounce off strict horizontal bounds
    if (newC < boundMinC || newC > boundMaxC) {
      newDc = -e.dc;
      newC = e.c + newDc;
      if (newC < boundMinC) newC = boundMinC;
      if (newC > boundMaxC) newC = boundMaxC;
    }

    return { ...e, r: newR, c: newC, dr: newDr, dc: newDc };
  });
}
