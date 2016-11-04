import game from './src/gameloop';
import player from './src/player';
import handleInput from './src/handleInput';
import { draw } from './src/draw';
import { clamp } from './src/util';

const update = (state) => {
  const newState = handleInput(state);

  newState.player.speed *= 0.9;
  if (Math.abs(newState.player.speed) < 0.02) {
    newState.player.speed = 0;
  }
  const movement = newState.player.speed;
  newState.player.position.x += Math.cos(newState.player.rotation) * movement;
  newState.player.position.y += Math.sin(newState.player.rotation) * movement;

  newState.camera.dX *= 0.9;
  newState.camera.dX = clamp(newState.camera.dX, -1, 1);
  newState.camera.x += (20 * newState.camera.dX) / newState.camera.zoom;

  newState.camera.dY *= 0.9;
  newState.camera.dY = clamp(newState.camera.dY, -1, 1);
  newState.camera.y += (20 * newState.camera.dY) / newState.camera.zoom;

  newState.camera.dZoom *= 0.9;
  newState.camera.dZoom = clamp(newState.camera.dZoom, -0.01, 1);

  newState.camera.zoom *= 1 + newState.camera.dZoom;

  newState.camera.zoom = clamp(newState.camera.zoom, 0.001, 1);

  return newState;
};

const init = () => {
  const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    dX: 0,
    dY: 0,
    dZoom: 0,
  };

  const initialState = {
    player: player(),
    camera,
  };
  game({
    state: initialState,
    msPerUpdate: 1000 / 60,
    update,
    draw,
  });
};

const PIXI = window.PIXI;

PIXI.loader
  .add('img/player.png')
  .load(init);
