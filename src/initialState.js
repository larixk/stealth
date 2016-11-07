import createPlayer from './objects/player';
import floater from './objects/floater';
import attractor from './objects/attractor';
import worldCamera from './camera';
import { rand, times } from './util';

export default () => {
  const player = createPlayer();
  const agents = times(2000, () => {
    const direction = rand(Math.PI * 2);
    const distance = rand(2000, 50000);
    return floater({
      position: {
        x: Math.sin(direction) * distance,
        y: Math.cos(direction) * distance,
      },
    });
  });
  const wells = times(7, () => {
    const direction = rand(Math.PI * 2);
    const distance = rand(2000, 100000);
    return attractor({
      position: {
        x: Math.sin(direction) * distance,
        y: Math.cos(direction) * distance,
      },
    });
  });
  return {
    player,
    agents,
    wells,
    camera: worldCamera(),
  };
};
