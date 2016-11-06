import SAT from 'sat';
import { lerp } from '../util';
import { isKeyDown } from '../input';
import { addToStage } from '../draw';

function update(state) {
  this.hitbox.rotate(-this.rotation);

  if (isKeyDown('TurnPlayerRight')) {
    this.rotation += lerp(0.01, 0.06, this.speed);
  }
  if (isKeyDown('TurnPlayerLeft')) {
    this.rotation -= lerp(0.01, 0.06, this.speed);
  }
  if (isKeyDown('MovePlayerForward')) {
    this.speed += 0.05;
    this.speed = Math.min(1, this.speed);
  }
  if (isKeyDown('MovePlayerBack')) {
    this.speed -= 0.1;
    this.speed = Math.max(-0.5, this.speed);
  }
  this.pullEffect.alpha = 0;
  if (isKeyDown('Pull')) {
    state.playerWell = { position: this.position, strength: 0.5 };
    this.pullEffect.width = this.pullEffect.height /= 1.1;
    if (this.pullEffect.width < 100) {
      this.pullEffect.width = this.pullEffect.height = 200000;
    }
    this.pullEffect.alpha = 1;
  }
  if (isKeyDown('Push')) {
    state.playerWell = { position: this.position, strength: -1 };

    this.pullEffect.width = this.pullEffect.height *= 1.1;
    if (this.pullEffect.width > 200000) {
      this.pullEffect.width = this.pullEffect.height = 100;
    }
    this.pullEffect.alpha = 1;
  }

  this.totalDistance = 0;
  // if (isKeyDown('Push')) {
  //   state.wells = null;
  // }
  // if (isKeyDown('Pull')) {
  //   console.log('dropped at ', this.position);
  //   state.wells = [{
  //     position: {
  //       x: this.position.x,
  //       y: this.position.y,
  //     },
  //     strength: 0.2,
  //   }];
  // }

  this.speed *= 0.95;
  if (Math.abs(this.speed) < 0.02) {
    this.speed = 0;
  }
  const movement = this.speed * 20;
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

  const size = 2;
  graphics.beginFill(0x111111);

  graphics.moveTo(-10 * size, -6 * size);
  graphics.lineTo(10 * size, 0 * size);
  graphics.lineTo(-10 * size, 6 * size);
  graphics.lineTo(-10 * size, -6 * size);
  graphics.endFill();

  const pullEffect = new PIXI.Graphics();

  pullEffect.beginFill(0, 0);
  pullEffect.lineStyle(200, 0xbbbbbb, 1);
  pullEffect.drawCircle(0, 0, 500);
  pullEffect.endFill();

  const player = new PIXI.Sprite();
  player.addChild(graphics);
  player.addChild(pullEffect);
  player.pullEffect = pullEffect;
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
