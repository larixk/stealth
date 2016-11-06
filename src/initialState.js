import createPlayer from './objects/player';
import floater from './objects/floater';
import attractor from './objects/attractor';
import worldCamera from './camera';
import { rand, times } from './util';

export default () => {
  const player = createPlayer();
  const agents = times(500, () => {
    const direction = rand(Math.PI * 2);
    const distance = rand(5000, 100000);
    return floater({
      position: {
        x: Math.sin(direction) * distance,
        y: Math.cos(direction) * distance,
      },
    });
  });
  const wells = [
    attractor(),
    attractor(),
    attractor(),
    attractor(),
    attractor(),
    attractor(),
    attractor(),
    attractor(),
  ];
  return {
    player,
    agents,
    wells,
    camera: worldCamera(),
  };
};
