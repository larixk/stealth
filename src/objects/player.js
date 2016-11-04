import SAT from 'sat';
import { lerp } from '../util';
import { isKeyDown } from '../input';
import { addToStage } from '../draw';

function update() {
  this.hitbox.rotate(-this.rotation);

  if (isKeyDown('TurnPlayerRight')) {
    this.rotation += lerp(0, 0.02 * Math.PI, this.speed);
  }
  if (isKeyDown('TurnPlayerLeft')) {
    this.rotation -= lerp(0, 0.02 * Math.PI, this.speed);
  }
  if (isKeyDown('MovePlayerForward')) {
    this.speed += 0.1;
    this.speed = Math.min(1, this.speed);
  }
  if (isKeyDown('MovePlayerBack')) {
    this.speed -= 0.1;
    this.speed = Math.max(-0.5, this.speed);
  }

  this.speed *= 0.9;
  if (Math.abs(this.speed) < 0.02) {
    this.speed = 0;
  }
  const movement = this.speed * 15;
  const dX = Math.cos(this.rotation) * movement;
  const dY = Math.sin(this.rotation) * movement;
  this.position.x += dX;
  this.position.y += dY;

  this.hitbox.setOffset(new SAT.Vector(this.position.x, this.position.y));
  this.hitbox.rotate(this.rotation);
}

export default () => {
  const PIXI = window.PIXI;
  const graphics = new PIXI.Graphics();

  graphics.beginFill(0x333333);
  graphics.lineStyle(4, 0x111111, 1);

  graphics.moveTo(-5, -3);
  graphics.lineTo(5, 0);
  graphics.lineTo(-5, 3);
  graphics.lineTo(-5, -3);
  graphics.endFill();

  const player = new PIXI.Sprite();
  player.addChild(graphics);
  player.speed = 0;
  player.update = update.bind(player);

  player.hitbox = new SAT.Polygon(new SAT.Vector(), [
    new SAT.Vector(5, 0),
    new SAT.Vector(-5, 3),
    new SAT.Vector(-5, -3),
  ]);

  addToStage(player);
  return player;
};
