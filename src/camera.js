import { isKeyDown } from './input';
import { clamp, lerp, rand } from './util';

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

  this.dX *= 0.9;
  this.dX = clamp(this.dX, -1, 1);
  this.x += (20 * this.dX) / this.zoom;

  this.dY *= 0.9;
  this.dY = clamp(this.dY, -1, 1);
  this.y += (20 * this.dY) / this.zoom;

  this.dZoom *= 0.9;
  this.dZoom = clamp(this.dZoom, -0.01, 1);

  this.zoom *= 1 + this.dZoom;

  this.zoom = clamp(this.zoom, 0.0001, 1);

  const cameraTargetX = state.player.x + Math.cos(state.player.rotation) * state.player.speed * 200;
  const cameraTargetY = state.player.y + Math.sin(state.player.rotation) * state.player.speed * 200;

  this.x = lerp(this.x, cameraTargetX, 0.02);
  this.y = lerp(this.y, cameraTargetY, 0.02);
  if (state.player.isPulling) {
    this.x += rand(-20, 20) * state.player.speed;
    this.y += rand(-20, 20) * state.player.speed;
  }
  this.zoom = lerp(this.zoom, 1 - Math.pow(state.player.speed, 3), 0.005);
  this.zoom = clamp(this.zoom, 0.2, 0.5);
  const twoPi = Math.PI * 2;
  const targetRotation = -state.player.rotation - (Math.PI / 2);
  const currentRotation = this.rotation % twoPi;
  let dRotation = targetRotation - currentRotation;
  while (dRotation < -Math.PI) {
    dRotation += twoPi;
  }
  while (dRotation > Math.PI) {
    dRotation -= twoPi;
  }
  this.rotation += dRotation * 0.02;
}
export default () => {
  const camera = {
    x: 0,
    y: 0,
    zoom: 1,
    rotation: 0,
    dX: 0,
    dY: 0,
    dZoom: 0,
  };
  camera.update = update.bind(camera);

  return camera;
};
