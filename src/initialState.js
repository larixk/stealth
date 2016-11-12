import createPlayer from './objects/player';
import floater from './objects/floater';
import smoke from './objects/smoke';
import attractor from './objects/attractor';
import worldCamera from './camera';
import { rand, times, sample } from './util';

const floaterTypes = [
  {
    // friendly
    color: 0xB5D6B2,
    collideWithPlayer: (theFloater, state) => {
      theFloater.hp = 0;
      theFloater.alpha = 0;
      state.player.currentPoints += theFloater.size * 1000;

      times(30 * theFloater.size, () => {
        const smokeDistance = rand(0, 200) * theFloater.size;
        const smokeDirection = rand(0, Math.PI * 2);
        const dX = Math.cos(smokeDirection) * smokeDistance;
        const dY = Math.sin(smokeDirection) * smokeDistance;
        state.smokes.push(smoke({
          position: {
            x: theFloater.position.x + dX,
            y: theFloater.position.y + dY,
          },
          dX: rand(-10, 10),
          dY: rand(-10, 10),
          color: 0xB5D6B2,
          size: 20,
        }));
      });
    },
  },
  {
    // dangerous
    color: 0x000000,
    collideWithPlayer: (theFloater, state) => {
      state.player.speed = -0.2;
      state.camera.x += rand(-10 / state.camera.zoom, 10 / state.camera.zoom);
      state.camera.y += rand(-10 / state.camera.zoom, 10 / state.camera.zoom);

      if (state.player.currentPoints > 0) {
        times(Math.min(1, state.player.currentPoints / 100) * 50, () => {
          state.smokes.push(smoke({
            position: {
              x: state.player.position.x,
              y: state.player.position.y,
            },
            dX: rand(-20, 20),
            dY: rand(-20, 20),
            color: 0,
          }));
        });
        state.player.currentPoints = 0;
      }
    },
  },
];

export default () => {
  const player = createPlayer();
  const agents = times(200, () => {
    const direction = rand(Math.PI * 2);
    const distance = rand(2000, 10000);
    // const distance = 200;
    return floater({
      type: sample(floaterTypes),
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
    smokes: [],
    camera: worldCamera(),
  };
};
