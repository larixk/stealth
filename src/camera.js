import { isKeyDown } from './input';
import { clamp, lerp } from './util';

function update(state) {
  if (isKeyDown('ZoomCameraOut')) {
    this.dZoom += 0.01;
  }
  if (isKeyDown('ZoomCameraIn')) {
    this.dZoom -= 0.01;
  }
  if (isKeyDown('MoveCameraLeft')) {
    this.dX -= 0.1;
  }
  if (isKeyDown('MoveCameraRight')) {
    this.dX += 0.1;
  }
  if (isKeyDown('MoveCameraUp')) {
    this.dY -= 0.1;
  }
  if (isKeyDown('MoveCameraDown')) {
    this.dY += 0.1;
  }
  if (isKeyDown('ResetCamera')) {
    this.dX = 0;
    this.dY = 0;
    this.dZoom = 0;
    this.zoom = 1;
    this.x = state.player.position.x;
    this.y = state.player.position.y;
  }

  this.dX *= 0.9;
  this.dX = clamp(this.dX, -1, 1);
  this.x += (20 * this.dX) / this.zoom;

  this.dY *= 0.9;
  this.dY = clamp(this.dY, -1, 1);
  this.y += (20 * this.dY) / this.zoom;

  this.dZoom *= 0.9;
  this.dZoom = clamp(this.dZoom, -0.01, 1);

  this.zoom *= 1 + this.dZoom;

  this.zoom = clamp(this.zoom, 0.001, 1);

  this.x = lerp(this.x, state.player.x, 0.04);
  this.y = lerp(this.y, state.player.y, 0.04);
  this.zoom = lerp(this.zoom, 1 - Math.pow(state.player.speed, 5), 0.01);
  this.zoom = clamp(this.zoom, 0.001, 1);
}
export default () => {
  const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    dX: 0,
    dY: 0,
    dZoom: 0,
  };
  camera.update = update.bind(camera);

  return camera;
};
