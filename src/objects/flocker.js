import { rand, distance, lerp, normalize } from '../util';
import { addToStage } from '../draw';

function update(state) {
  if (this.hp <= 0) {
    this.removeFromStage();
    state.flockers = state.flockers.filter(otherflocker => otherflocker !== this);
  }

  const closeOthers = state.flockers.filter(
    otherflocker => otherflocker !== this && distance(this, otherflocker) < 200
  );

  let flockingX = 0;
  let flockingY = 0;

  // Alignment
  const alignmentWeight = 2;
  closeOthers.forEach((otherflocker) => {
    flockingX += (otherflocker.dX / (closeOthers.length + 1)) * alignmentWeight;
    flockingY += (otherflocker.dY / (closeOthers.length + 1)) * alignmentWeight;
  });
  flockingX += Math.cos(state.player.rotation) * 0.01 * alignmentWeight;
  flockingY += Math.sin(state.player.rotation) * 0.01 * alignmentWeight;

  // Cohesion
  const cohesionWeight = 0.01;
  closeOthers.forEach((otherflocker) => {
    flockingX += ((otherflocker.x - this.x) / (closeOthers.length + 1)) * cohesionWeight;
    flockingY += ((otherflocker.y - this.y) / (closeOthers.length + 1)) * cohesionWeight;
  });
  flockingX += (state.player.x - this.x) * 0.01 * cohesionWeight;
  flockingY += (state.player.y - this.y) * 0.01 * cohesionWeight;

  // // Separation
  const separationWeight = 10;
  const separatingOthers = state.flockers.filter(
    otherflocker => otherflocker !== this && distance(this, otherflocker) < 150
  );
  separatingOthers.forEach((otherflocker) => {
    flockingX += ((this.x - otherflocker.x) / (separatingOthers.length + 1)) * separationWeight;
    flockingY += ((this.y - otherflocker.y) / (separatingOthers.length + 1)) * separationWeight;
  });
  if (distance(this, state.player < 150)) {
    flockingX += (this.x - state.player.x) * separationWeight * 0.001;
    flockingY += (this.y - state.player.y) * separationWeight * 0.001;
  }

  const dPosition = normalize(flockingX, flockingY);
  flockingX = dPosition.x * 0.5 * this.size;
  flockingY = dPosition.y * 0.5 * this.size;

  this.dX = lerp(this.dX, flockingX, 0.1);
  this.dY = lerp(this.dY, flockingY, 0.1);


  const twoPi = Math.PI * 2;
  const targetRotation = -Math.atan2(this.dX, this.dY) + (Math.PI * 0.5);
  const currentRotation = this.rotation % twoPi;
  let dRotation = targetRotation - currentRotation;
  while (dRotation < -Math.PI) {
    dRotation += twoPi;
  }
  while (dRotation > Math.PI) {
    dRotation -= twoPi;
  }
  this.rotation += dRotation * 0.1;

  this.x += this.dX;
  this.y += this.dY;
}

export default ({ position, dX, dY, size = rand(10, 30) }) => {
  const PIXI = window.PIXI;
  const flocker = new PIXI.Sprite();
  flocker.position = position;

  const graphics = new PIXI.Graphics();
  graphics.beginFill(0xff0000);
  graphics.moveTo(-50 * size, -12 * size);
  graphics.lineTo(50 * size, 0 * size);
  graphics.lineTo(-50 * size, 12 * size);
  graphics.lineTo(-50 * size, -12 * size);
  graphics.endFill();
  flocker.addChild(graphics);
  flocker.size = size;
  flocker.anchor.y = flocker.anchor.x = 0.5;

  flocker.width = flocker.height = 0.1;
  flocker.rotation = rand(Math.PI * 2);
  flocker.dX = dX || rand(-2, 2);
  flocker.dY = dY || rand(-2, 2);
  flocker.hp = 1;

  flocker.removeFromStage = addToStage(flocker);

  flocker.update = update;

  return flocker;
};
