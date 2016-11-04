import player from './objects/player';
import floater from './objects/floater';
import worldCamera from './camera';
import { rand, times } from './util';

export default () => {
  const agents = times(500, () => floater({
    position: {
      x: rand(1000, 6000),
      y: rand(-3000, 3000),
    },
  }));
  return {
    player: player(),
    agents,
    camera: worldCamera(),
  };
};
