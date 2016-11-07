import { lerp, sample, times, direction } from './util';

const ctx = new (AudioContext || webkitAudioContext)();

const notes = {
  c: 16.35,
  cSharp: 17.32,
  d: 18.35,
  eFlat: 19.45,
  e: 20.60,
  f: 21.83,
  fSharp: 23.12,
  g: 24.50,
  gSharp: 25.96,
  a: 27.50,
  bFlat: 29.14,
  b: 30.87,
};

const chords = {
  gMajor: {
    chord: [notes.g, notes.b, notes.d],
    next: ['cMinor'],
  },
  cMinor: {
    chord: [notes.c, notes.eFlat, notes.g],
    next: ['gMinor'],
  },
  gMinor: {
    chord: [notes.d, notes.bFlat, notes.g],
    next: ['cMajor'],
  },
  cMajor: {
    chord: [notes.c, notes.e, notes.g],
    next: ['fMajor', 'bFlatMajor'],
  },
  fMajor: {
    chord: [notes.f, notes.c, notes.a],
    next: ['bFlatMajor'],
  },
  bFlatMajor: {
    chord: [notes.bFlat, notes.d, notes.f],
    next: ['aMinor'],
  },
  aMinor: {
    chord: [notes.a, notes.c, notes.e],
    next: ['gMinor'],
  },
  dMajor: {
    chord: [notes.c, notes.a, notes.d, notes.fSharp],
    next: ['gMajor'],
  },
};
let currentScale = chords.gMajor;
setInterval(() => {
  const next = sample(currentScale.next);
  console.log(next);
  currentScale = chords[next];
}, 4000);

const synths = times(8, () => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const panNode = ctx.createStereoPanner();
  const biquadFilter = ctx.createBiquadFilter();

  oscillator.type = 'sine';
  oscillator.detune.value = 100;

  // biquadFilter.type = 'lowshelf';
  // biquadFilter.frequency.value = 80;
  // biquadFilter.gain.value = 10;

  oscillator.connect(gainNode);
  // biquadFilter.connect(gainNode);
  gainNode.connect(panNode);
  panNode.connect(ctx.destination);

  gainNode.gain.value = 0;
  oscillator.frequency.value = 0;

  oscillator.start(0);
  return {
    setFrequency: (f) => {
      oscillator.frequency.value = f; //lerp(oscillator.frequency.value, f, 0.5);
    },
    setVolume: (v) => {
      gainNode.gain.value = v;
    },
    setPan: (p) => {
      panNode.pan.value = p;
    },
  };
});


const roundToC = (frequency) => {
  const chord = currentScale.chord;
  let calculatedFreqency;
  for (let i = 2; i < 8; i++) {
    for (let j = 0; j < chord.length; j++) {
      const baseNote = chord[j];
      calculatedFreqency = Math.pow(2, i) * baseNote;
      if (calculatedFreqency > frequency) {
        return calculatedFreqency;
      }
    }
  }
  return calculatedFreqency;
};

export default (state) => {
  state.agents
    .sort((agent1, agent2) => agent1.distanceToPlayer - agent2.distanceToPlayer)
    .slice(0, synths.length)
    .forEach((agent, i) => {
      const previousDistance = agent.previousDistance;
      const doppler = previousDistance ? (agent.distanceToPlayer - previousDistance) : 0;
      agent.previousDistance = agent.distanceToPlayer;
      const frequency = lerp(220, 1400, Math.pow(1 - agent.size, 2)) - doppler * 10;
      const frequencyRoundedToC = roundToC(frequency);

      synths[i].setFrequency(frequencyRoundedToC);
      // synths[i].setFrequency(frequency);
      const distanceFactor = Math.min(1, 1 / Math.pow(agent.distanceToPlayer, 2) * 1000);
      synths[i].setVolume(lerp(0, 0.4, agent.size * distanceFactor));

      const angleFromPlayerToAgent = ((direction(agent, state.player) / (Math.PI * 2)) + 2.5) % 1;
      const playerRotation = state.player.rotation / (Math.PI * 2);
      const directionFromPlayerToAgent = ((angleFromPlayerToAgent - playerRotation) + 1) % 1;
      const pan = (directionFromPlayerToAgent < 0.5) ?
        (Math.abs(directionFromPlayerToAgent - 0.25) - 0.25) * -4 :
        (Math.abs(directionFromPlayerToAgent - 0.75) - 0.25) * 4;
      synths[i].setPan(pan);
    });
//   oscillator.frequency.value = lerp(110, 130, Math.pow(state.player.speed, 2));
//   gainNode.gain.value = state.camera.zoom;
};
