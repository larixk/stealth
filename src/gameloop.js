import { noop, now } from './util';

let playing = false;
let lastUpdateTime;

const defaults = {
  msPerUpdate: 10,
  maxTicks: 5,
  update: noop,
  draw: noop,
};

let options;

const resume = () => {
  playing = true;
  lastUpdateTime = now();
};

const pause = () => {
  playing = false;
};

const setState = (state) => {
  options.state = state;
};

const gameControls = {
  resume,
  pause,
  setState,
};

const tick = () => {
  if (playing && options.state) {
    const dt = options.msPerUpdate;
    const currentTime = now();
    lastUpdateTime = Math.max(lastUpdateTime, currentTime - (options.maxTicks * dt));
    while (lastUpdateTime < currentTime - options.msPerUpdate) {
      lastUpdateTime += options.msPerUpdate;
      options.state = options.update(options.state, dt, gameControls);
    }
  }
  if (options.state) {
    options.draw(options.state);
    if (options.sound) {
      options.sound(options.state);
    }
  }
  requestAnimationFrame(tick);
};

export default (parameters) => {
  options = Object.assign({}, defaults, parameters);
  resume();
  tick();
  return gameControls;
};
