export const PARTICLE_COUNT = 10000;

export interface ShapeConfig {
  name: string;
  color1: [number, number, number];
  color2: [number, number, number];
}

export const SHAPES: ShapeConfig[] = [
  { name: 'NEURAL NETWORK', color1: [0.6, 0.2, 0.9], color2: [0.9, 0.3, 0.6] },
  { name: 'SOURCE CODE', color1: [0.0, 0.8, 0.6], color2: [0.0, 0.4, 0.9] },
  { name: 'DNA HELIX', color1: [0.2, 0.9, 0.4], color2: [0.0, 0.6, 0.9] },
  { name: 'MARKET PULSE', color1: [0.9, 0.7, 0.0], color2: [0.9, 0.3, 0.0] },
  { name: 'GALAXY', color1: [0.5, 0.0, 0.9], color2: [0.9, 0.0, 0.5] },
  { name: 'ARTIFICIAL MIND', color1: [0.0, 0.7, 0.9], color2: [0.0, 0.9, 0.7] },
  { name: 'INFINITY TORUS', color1: [0.9, 0.1, 0.3], color2: [0.9, 0.5, 0.1] },
  { name: 'HYPERCUBE', color1: [0.7, 0.7, 0.9], color2: [0.3, 0.3, 0.7] },
];

export function generateShapePositions(index: number): Float32Array {
  const p = new Float32Array(PARTICLE_COUNT * 3);
  switch (index % SHAPES.length) {
    case 0: return neuralNetwork(p);
    case 1: return codeBrackets(p);
    case 2: return dnaHelix(p);
    case 3: return tradingCandles(p);
    case 4: return galaxy(p);
    case 5: return robotHead(p);
    case 6: return torusKnot(p);
    case 7: return hypercube(p);
    default: return sphere(p);
  }
}

function sphere(p: Float32Array): Float32Array {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 2.5 + Math.random() * 0.5;
    p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    p[i * 3 + 2] = r * Math.cos(phi);
  }
  return p;
}

function neuralNetwork(p: Float32Array): Float32Array {
  const layers = 5, nodes = 6, total = layers * nodes;
  const perNode = Math.floor(PARTICLE_COUNT * 0.4 / total);
  let idx = 0;
  for (let l = 0; l < layers; l++) {
    for (let n = 0; n < nodes; n++) {
      const cx = (l / (layers - 1) - 0.5) * 6;
      const cy = (n / (nodes - 1) - 0.5) * 4;
      for (let k = 0; k < perNode && idx < PARTICLE_COUNT; k++, idx++) {
        p[idx * 3] = cx + (Math.random() - 0.5) * 0.5;
        p[idx * 3 + 1] = cy + (Math.random() - 0.5) * 0.5;
        p[idx * 3 + 2] = (Math.random() - 0.5) * 0.3;
      }
    }
  }
  while (idx < PARTICLE_COUNT) {
    const l = Math.floor(Math.random() * (layers - 1));
    const n1 = Math.floor(Math.random() * nodes);
    const n2 = Math.floor(Math.random() * nodes);
    const t = Math.random();
    const x1 = (l / (layers - 1) - 0.5) * 6, y1 = (n1 / (nodes - 1) - 0.5) * 4;
    const x2 = ((l + 1) / (layers - 1) - 0.5) * 6, y2 = (n2 / (nodes - 1) - 0.5) * 4;
    p[idx * 3] = x1 + (x2 - x1) * t + (Math.random() - 0.5) * 0.03;
    p[idx * 3 + 1] = y1 + (y2 - y1) * t + (Math.random() - 0.5) * 0.03;
    p[idx * 3 + 2] = (Math.random() - 0.5) * 0.08;
    idx++;
  }
  return p;
}

function codeBrackets(p: Float32Array): Float32Array {
  const half = PARTICLE_COUNT / 2;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const isRight = i >= half;
    const t = (i % half) / half;
    let x: number, y: number;
    if (t < 0.15) {
      const s = t / 0.15;
      x = -0.8 + s * 0.3; y = 2.5;
    } else if (t < 0.5) {
      const s = (t - 0.15) / 0.35;
      x = -0.5 - Math.sin(s * Math.PI) * 1.0;
      y = 2.5 - s * 2.5;
    } else if (t < 0.85) {
      const s = (t - 0.5) / 0.35;
      x = -0.5 - Math.sin(s * Math.PI) * 1.0;
      y = 0 - s * 2.5;
    } else {
      const s = (t - 0.85) / 0.15;
      x = -0.8 + s * 0.3; y = -2.5;
    }
    if (isRight) x = -x;
    p[i * 3] = x + (Math.random() - 0.5) * 0.12;
    p[i * 3 + 1] = y + (Math.random() - 0.5) * 0.12;
    p[i * 3 + 2] = (Math.random() - 0.5) * 0.3;
  }
  return p;
}

function dnaHelix(p: Float32Array): Float32Array {
  const turns = 4;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = i / PARTICLE_COUNT;
    const angle = t * turns * Math.PI * 2;
    const y = (t - 0.5) * 6;
    const r = 1.2;
    if (i % 20 < 10) {
      // Strand 1
      p[i * 3] = Math.cos(angle) * r + (Math.random() - 0.5) * 0.1;
      p[i * 3 + 1] = y + (Math.random() - 0.5) * 0.05;
      p[i * 3 + 2] = Math.sin(angle) * r + (Math.random() - 0.5) * 0.1;
    } else if (i % 20 < 18) {
      // Strand 2
      p[i * 3] = Math.cos(angle + Math.PI) * r + (Math.random() - 0.5) * 0.1;
      p[i * 3 + 1] = y + (Math.random() - 0.5) * 0.05;
      p[i * 3 + 2] = Math.sin(angle + Math.PI) * r + (Math.random() - 0.5) * 0.1;
    } else {
      // Connecting rung
      const rt = Math.random();
      p[i * 3] = Math.cos(angle) * r * (1 - rt) + Math.cos(angle + Math.PI) * r * rt;
      p[i * 3 + 1] = y;
      p[i * 3 + 2] = Math.sin(angle) * r * (1 - rt) + Math.sin(angle + Math.PI) * r * rt;
    }
  }
  return p;
}

function tradingCandles(p: Float32Array): Float32Array {
  const numCandles = 18;
  const perCandle = Math.floor(PARTICLE_COUNT / numCandles);
  let idx = 0;
  for (let c = 0; c < numCandles; c++) {
    const cx = (c / (numCandles - 1) - 0.5) * 7;
    const open = (Math.random() - 0.5) * 3;
    const close = open + (Math.random() - 0.5) * 2;
    const high = Math.max(open, close) + Math.random() * 1;
    const low = Math.min(open, close) - Math.random() * 1;
    const bodyTop = Math.max(open, close);
    const bodyBot = Math.min(open, close);
    const bodyParticles = Math.floor(perCandle * 0.7);
    const wickParticles = perCandle - bodyParticles;
    // Body
    for (let j = 0; j < bodyParticles && idx < PARTICLE_COUNT; j++, idx++) {
      p[idx * 3] = cx + (Math.random() - 0.5) * 0.3;
      p[idx * 3 + 1] = bodyBot + Math.random() * (bodyTop - bodyBot);
      p[idx * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }
    // Wick
    for (let j = 0; j < wickParticles && idx < PARTICLE_COUNT; j++, idx++) {
      p[idx * 3] = cx + (Math.random() - 0.5) * 0.05;
      p[idx * 3 + 1] = low + Math.random() * (high - low);
      p[idx * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }
  }
  while (idx < PARTICLE_COUNT) {
    p[idx * 3] = (Math.random() - 0.5) * 7;
    p[idx * 3 + 1] = (Math.random() - 0.5) * 4;
    p[idx * 3 + 2] = (Math.random() - 0.5) * 0.3;
    idx++;
  }
  return p;
}

function galaxy(p: Float32Array): Float32Array {
  const arms = 4;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const arm = i % arms;
    const t = Math.pow(Math.random(), 0.5) * 3.5;
    const spiralAngle = t * 2.5 + (arm / arms) * Math.PI * 2;
    const scatter = (0.1 + t * 0.15) * (Math.random() - 0.5);
    p[i * 3] = Math.cos(spiralAngle) * t + scatter;
    p[i * 3 + 1] = (Math.random() - 0.5) * 0.3 * Math.exp(-t * 0.3);
    p[i * 3 + 2] = Math.sin(spiralAngle) * t + scatter;
  }
  return p;
}

function robotHead(p: Float32Array): Float32Array {
  let idx = 0;
  const headParticles = Math.floor(PARTICLE_COUNT * 0.5);
  const eyeParticles = Math.floor(PARTICLE_COUNT * 0.15);
  const antennaParticles = Math.floor(PARTICLE_COUNT * 0.1);
  const mouthParticles = Math.floor(PARTICLE_COUNT * 0.1);
  // Head (box outline)
  for (let i = 0; i < headParticles && idx < PARTICLE_COUNT; i++, idx++) {
    const face = Math.floor(Math.random() * 6);
    let x = (Math.random() - 0.5) * 3;
    let y = (Math.random() - 0.5) * 3;
    let z = (Math.random() - 0.5) * 2.5;
    // Project to face surface
    if (face === 0) x = -1.5; else if (face === 1) x = 1.5;
    else if (face === 2) y = -1.5; else if (face === 3) y = 1.5;
    else if (face === 4) z = -1.25; else z = 1.25;
    p[idx * 3] = x + (Math.random() - 0.5) * 0.08;
    p[idx * 3 + 1] = y + (Math.random() - 0.5) * 0.08;
    p[idx * 3 + 2] = z + (Math.random() - 0.5) * 0.08;
  }
  // Eyes (two circles)
  for (let eye = 0; eye < 2; eye++) {
    const ecx = eye === 0 ? -0.6 : 0.6;
    for (let i = 0; i < eyeParticles / 2 && idx < PARTICLE_COUNT; i++, idx++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.3 + Math.random() * 0.1;
      p[idx * 3] = ecx + Math.cos(a) * r;
      p[idx * 3 + 1] = 0.3 + Math.sin(a) * r;
      p[idx * 3 + 2] = 1.3;
    }
  }
  // Antenna
  for (let i = 0; i < antennaParticles && idx < PARTICLE_COUNT; i++, idx++) {
    const t = Math.random();
    p[idx * 3] = (Math.random() - 0.5) * 0.1;
    p[idx * 3 + 1] = 1.5 + t * 1.2;
    p[idx * 3 + 2] = (Math.random() - 0.5) * 0.1;
  }
  // Mouth
  for (let i = 0; i < mouthParticles && idx < PARTICLE_COUNT; i++, idx++) {
    p[idx * 3] = (Math.random() - 0.5) * 1.2;
    p[idx * 3 + 1] = -0.7 + (Math.random() - 0.5) * 0.15;
    p[idx * 3 + 2] = 1.3;
  }
  // Fill remaining
  while (idx < PARTICLE_COUNT) {
    const a = Math.random() * Math.PI * 2;
    const r = 2 + Math.random();
    p[idx * 3] = Math.cos(a) * r * 0.3;
    p[idx * 3 + 1] = (Math.random() - 0.5) * 3;
    p[idx * 3 + 2] = Math.sin(a) * r * 0.3;
    idx++;
  }
  return p;
}

function torusKnot(p: Float32Array): Float32Array {
  const pk = 3, qk = 2;
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = (i / PARTICLE_COUNT) * Math.PI * 2;
    const r = Math.cos(qk * t) + 2;
    const tube = 0.3;
    const tubeAngle = Math.random() * Math.PI * 2;
    const baseX = r * Math.cos(pk * t);
    const baseY = r * Math.sin(pk * t);
    const baseZ = -Math.sin(qk * t);
    p[i * 3] = baseX + Math.cos(tubeAngle) * tube * (Math.random() * 0.5 + 0.5);
    p[i * 3 + 1] = baseY + Math.sin(tubeAngle) * tube * (Math.random() * 0.5 + 0.5);
    p[i * 3 + 2] = baseZ + (Math.random() - 0.5) * tube;
  }
  return p;
}

function hypercube(p: Float32Array): Float32Array {
  // Tesseract edges projected to 3D
  const s = 1.5;
  const verts4D: number[][] = [];
  for (let a = -1; a <= 1; a += 2)
    for (let b = -1; b <= 1; b += 2)
      for (let c = -1; c <= 1; c += 2)
        for (let d = -1; d <= 1; d += 2)
          verts4D.push([a * s, b * s, c * s, d * s]);

  const edges: [number, number][] = [];
  for (let i = 0; i < 16; i++)
    for (let j = i + 1; j < 16; j++) {
      let diff = 0;
      for (let k = 0; k < 4; k++) if (verts4D[i][k] !== verts4D[j][k]) diff++;
      if (diff === 1) edges.push([i, j]);
    }

  const project4Dto3D = (v: number[]): [number, number, number] => {
    const w = 3;
    const scale = w / (w - v[3] * 0.3);
    return [v[0] * scale, v[1] * scale, v[2] * scale];
  };

  const perEdge = Math.floor(PARTICLE_COUNT / edges.length);
  let idx = 0;
  for (const [a, b] of edges) {
    const va = project4Dto3D(verts4D[a]);
    const vb = project4Dto3D(verts4D[b]);
    for (let j = 0; j < perEdge && idx < PARTICLE_COUNT; j++, idx++) {
      const t = Math.random();
      p[idx * 3] = va[0] + (vb[0] - va[0]) * t + (Math.random() - 0.5) * 0.06;
      p[idx * 3 + 1] = va[1] + (vb[1] - va[1]) * t + (Math.random() - 0.5) * 0.06;
      p[idx * 3 + 2] = va[2] + (vb[2] - va[2]) * t + (Math.random() - 0.5) * 0.06;
    }
  }
  while (idx < PARTICLE_COUNT) {
    const v = project4Dto3D(verts4D[Math.floor(Math.random() * 16)]);
    p[idx * 3] = v[0] + (Math.random() - 0.5) * 0.2;
    p[idx * 3 + 1] = v[1] + (Math.random() - 0.5) * 0.2;
    p[idx * 3 + 2] = v[2] + (Math.random() - 0.5) * 0.2;
    idx++;
  }
  return p;
}
