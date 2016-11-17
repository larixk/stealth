import floater from './floater';
import smoke from './smoke';
import { rand, times, sample } from '../util';

const floaterTypes = [
  {
    type: 'friendly',
    color: 0xB5D6B2,
    collideWithPlayer: (theFloater, state) => {
      theFloater.hp = 0;
      theFloater.alpha = 0;
      state.player.currentPoints += theFloater.size * 1000;

      times(30 * theFloater.size, () => {
        const smokeDistance = rand(0, 400) * theFloater.size;
        const smokeDirection = rand(0, Math.PI * 2);
        const dX = Math.cos(smokeDirection) * smokeDistance;
        const dY = Math.sin(smokeDirection) * smokeDistance;
        state.smokes.push(smoke({
          position: {
            x: theFloater.position.x + dX,
            y: theFloater.position.y + dY,
          },
          dHp: rand(0.01, 0.02),
          type: 'attract',
          color: 0xB5D6B2,
          size: 20,
        }));
      });
    },
  },
  {
    // dangerous
    color: 0xF1E4E8,
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
            type: 'danger',
            dX: rand(-20, 20),
            dY: rand(-20, 20),
            color: theFloater.type.color,
          }));
        });
        state.player.currentPoints = 0;
      }
    },
  },
];

export default (state) => {
  const direction = rand(Math.PI * 2);
  const distance = rand(5500, 8000);
  // const distance = 200;
  return floater({
    type: rand(1) < 0.1 ? floaterTypes[0] : floaterTypes[1],
    position: {
      x: state.player.position.x + Math.sin(direction) * distance,
      y: state.player.position.y + Math.cos(direction) * distance,
    },
  });
};
