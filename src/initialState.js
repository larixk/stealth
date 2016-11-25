import createPlayer from './objects/player';
import steady from './objects/steady';
import worldCamera from './camera';
import { rand, times } from './util';

export default () => {
  const player = createPlayer();
  const agents = [];
  const steadies = times(2000, () => {
    return steady({ position: {
      x: rand(-10000, 10000),
      y: rand(-10000, 10000),
    }});
  });

  return {
    player,
    agents,
    steadies,
    smokes: [],
    camera: worldCamera(),
  };
};
