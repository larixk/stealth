import SAT from 'sat';
import { lerp, rand, times, distance, direction,  rgbToColor } from '../util';
import { isKeyDown } from '../input';
import { addToStage, setBackground } from '../draw';
import smoke from './smoke';

function update(state) {
  this.hitbox.rotate(-this.rotation);

  const oldPosition = {
    x: this.position.x,
    y: this.position.y,
    rotation: this.rotation,
  };

  const drag = 0.95;
  const angularDrag = 0.8;
  const turnSpeed = 0.01;
  const power = 1;

  if (isKeyDown('TurnPlayerRight')) {
    this.dRotation += turnSpeed;
  }
  if (isKeyDown('TurnPlayerLeft')) {
    this.dRotation -= turnSpeed;
  }
  if (isKeyDown('MovePlayerForward')) {
    this.dX += Math.cos(this.rotation) * power;
    this.dY += Math.sin(this.rotation) * power;
  }
  if (isKeyDown('MovePlayerBack')) {
    this.dX -= Math.cos(this.rotation) * power;
    this.dY -= Math.sin(this.rotation) * power;
  }

  this.position.x += this.dX;
  this.position.y += this.dY;

  this.dX *= drag;
  this.dY *= drag;

  this.speed = Math.sqrt(Math.pow(this.dX, 2) + Math.pow(this.dY, 2)) / 10;

  this.movementDirection = Math.atan2(this.dY, this.dX);


  // const driftAngle = Math.abs(Math.PI - Math.abs(Math.abs((this.movementDirection % (Math.PI * 2)) - (this.rotation % (Math.PI * 2))) - Math.PI)) / Math.PI;
  // const smokeAmount = Math.pow(driftAngle, 2) * this.speed * 20;
  // if (smokeAmount > 1) {
  //   times(smokeAmount, () => {
  //     state.smokes.push(smoke({
  //       position: this.position,
  //       color: 0xF1E4E8,
  //       size: smokeAmount * 10,
  //     }));
  //   });
  // }

  this.rotation += this.dRotation * this.speed;
  this.rotation %= Math.PI * 2;
  this.dRotation *= angularDrag;

  this.hitbox.setOffset(new SAT.Vector(this.position.x, this.position.y));
  this.hitbox.rotate(this.rotation);

  state.steadies.forEach((steady) => {
    steady.alpha = 1;
    if (SAT.testPolygonPolygon(this.hitbox, steady.hitbox)) {
      this.hitbox.rotate(-this.rotation);
      steady.alpha = 0.1;
      this.dX = 0;
      this.dY = 0;
      this.dRotation = 0;
      this.speed = 0;
      this.position.x = oldPosition.x;
      this.position.y = oldPosition.y;
      this.rotation = oldPosition.rotation;
      this.hitbox.setOffset(new SAT.Vector(this.position.x, this.position.y));
      this.hitbox.rotate(this.rotation);
    }
  });
}

export default () => {
  const PIXI = window.PIXI;
  const graphics = new PIXI.Graphics();

  const size = 3;
  graphics.beginFill(0xFFEFBD);

  graphics.moveTo(-10 * size, -6 * size);
  graphics.moveTo(10 * size, -6 * size);
  graphics.lineTo(10 * size, 6 * size);
  graphics.lineTo(-10 * size, 6 * size);
  graphics.lineTo(-10 * size, -6 * size);
  graphics.endFill();

  const player = new PIXI.Sprite();
  player.addChild(graphics);
  player.speed = 0;
  player.dX = 0;
  player.dY = 0;
  player.dRotation = 0;
  player.update = update.bind(player);

  player.hitbox = new SAT.Polygon(new SAT.Vector(), [
    new SAT.Vector(-10 * size, -6 * size),
    new SAT.Vector(10 * size, -6 * size),
    new SAT.Vector(10 * size, 6 * size),
    new SAT.Vector(-10 * size, 6 * size),
  ]);

  addToStage(player);

  return player;
};
