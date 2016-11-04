import player from './objects/player';
import camera from './objects/camera';
import worldCamera from './camera';
import { rand, times } from './util';

export default () => {
  const agents = times(100, () => camera({ position: { x: rand(1000, 2000), y: rand(-500, 500) } }));
  return {
    player: player(),
    agents,
    camera: worldCamera(),
  };
};
