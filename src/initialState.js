import createPlayer from './objects/player';
import attractor from './objects/attractor';
import flocker from './objects/flocker';
import worldCamera from './camera';
import { rand, times } from './util';



export default () => {
  const player = createPlayer();
  const agents = [];

  const wells = times(3, () => {
    const direction = rand(Math.PI * 2);
    const distance = 2000;
    return attractor({
      position: {
        x: Math.sin(direction) * distance,
        y: Math.cos(direction) * distance,
      },
      strength: 0.1,
    });
  });

  const flockers = times(100, () => {
    return flocker({
      position: {
        x: rand(-10000, 10000),
        y: rand(-10000, 10000),
      },
    });
  });
  return {
    player,
    agents,
    wells,
    smokes: [],
    flockers,
    camera: worldCamera(),
  };
};
