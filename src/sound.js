import { lerp, times, direction } from './util';

const ctx = new (AudioContext || webkitAudioContext)();

const synths = times(4, () => {
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();
  const panNode = ctx.createStereoPanner();
  const biquadFilter = ctx.createBiquadFilter();

  oscillator.type = 'sine';

  biquadFilter.type = 'lowshelf';
  biquadFilter.frequency.value = 80;
  biquadFilter.gain.value = 10;

  oscillator.connect(biquadFilter);
  biquadFilter.connect(gainNode);
  gainNode.connect(panNode);
  panNode.connect(ctx.destination);

  gainNode.gain.value = 0;
  oscillator.frequency.value = 0;

  oscillator.start(0);
  return {
    setFrequency: (f) => {
      oscillator.frequency.value = lerp(oscillator.frequency.value, f, 0.1);
    },
    setVolume: (v) => {
      gainNode.gain.value = lerp(gainNode.gain.value, Math.min(0.01, v), 0.1);
    },
    setPan: (p) => {
      panNode.pan.value = p;
    },
  };
});


export default (state) => {

  state.agents.sort((agent1, agent2) => {
    return agent1.distanceToPlayer - agent2.distanceToPlayer;
  }).slice(0, 3).forEach((agent, i) => {
    const previousDistance = agent.previousDistance;
    const doppler = previousDistance ? (agent.distanceToPlayer - previousDistance) : 0;
    agent.previousDistance = agent.distanceToPlayer;
    const frequency = lerp(220, 330, 1 - agent.size) - doppler * 2;

    synths[i].setFrequency(frequency);
    synths[i].setVolume(0.2 / ((Math.pow(agent.distanceToPlayer, 2) / 3000)));
    let directionFromPlayerToAgent = direction(state.player, agent) / Math.PI;
    directionFromPlayerToAgent += 0.5;
    directionFromPlayerToAgent %= 2;
    const pan = (directionFromPlayerToAgent < 1) ?
      (Math.abs(directionFromPlayerToAgent - 0.5) - 0.5) * -2 :
      (Math.abs(directionFromPlayerToAgent - 1.5) - 0.5) * -2;
    synths[i].setPan(pan);
  });
//   oscillator.frequency.value = lerp(110, 130, Math.pow(state.player.speed, 2));
//   gainNode.gain.value = state.camera.zoom;
};
