export const calculateXG = (x: number, y: number, team: 'A' | 'B'): number => {
  // Normalize y so that attacking goal is always at y = 0
  // Team A attacks bottom (y=100), so normalizedY = 100 - y
  // Team B attacks top (y=0), so normalizedY = y
  const normalizedY = team === 'A' ? 100 - y : y;
  const normalizedX = x; // 50 is center

  const angleRad = Math.atan2(normalizedY, Math.abs(normalizedX - 50));
  const angleDeg = angleRad * (180 / Math.PI);

  let basexg = 0.1;

  // 6-yard box (approximate)
  if (normalizedY < 6 && normalizedX > 37 && normalizedX < 63) {
    basexg = 0.7 + (Math.random() * 0.2); // 0.7 - 0.9
  } 
  // Penalty box (approximate)
  else if (normalizedY < 17 && normalizedX > 21 && normalizedX < 79) {
    basexg = 0.2 + (Math.random() * 0.3); // 0.2 - 0.5
  }
  // Outside box
  else {
    basexg = 0.05 + (Math.random() * 0.1); // 0.05 - 0.15
  }

  // Reduce xG for wide angles
  if (angleDeg < 30) {
    basexg *= 0.5;
  } else if (angleDeg < 45) {
    basexg *= 0.8;
  }

  return parseFloat(basexg.toFixed(2));
};
