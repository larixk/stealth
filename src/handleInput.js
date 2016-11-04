import { isKeyDown } from './input';

const controlPlayer = (state) => {
  const newState = state;
  if (isKeyDown('d')) {
    newState.player.rotation += 0.01 * Math.PI;
    newState.player.rotation %= Math.PI * 2;
  }
  if (isKeyDown('a')) {
    newState.player.rotation -= 0.01 * Math.PI;
    newState.player.rotation += Math.PI * 2;
    newState.player.rotation %= Math.PI * 2;
  }
  if (isKeyDown('w')) {
    newState.player.speed += 0.1;
    newState.player.speed = Math.min(1, newState.player.speed);
  }
  if (isKeyDown('s')) {
    newState.player.speed -= 0.1;
    newState.player.speed = Math.max(-0.5, newState.player.speed);
  }

  return newState;
};

const controlCamera = (state) => {
  const newState = state;
  if (isKeyDown('=')) {
    newState.camera.dZoom += 0.01;
  }
  if (isKeyDown('-')) {
    newState.camera.dZoom -= 0.01;
  }
  if (isKeyDown('ArrowLeft')) {
    newState.camera.dX -= 0.1;
  }
  if (isKeyDown('ArrowRight')) {
    newState.camera.dX += 0.1;
  }
  if (isKeyDown('ArrowUp')) {
    newState.camera.dY -= 0.1;
  }
  if (isKeyDown('ArrowDown')) {
    newState.camera.dY += 0.1;
  }

  return newState;
};

export default (state, dt) => controlCamera(controlPlayer(state));
