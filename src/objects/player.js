import SAT from 'sat';
import { lerp, rand, times, distance, rgbToColor } from '../util';
import { isKeyDown } from '../input';
import { addToStage, setBackground } from '../draw';
import smoke from './smoke';

function update(state) {
  this.hitbox.rotate(-this.rotation);

  if (isKeyDown('TurnPlayerRight')) {
    this.rotation += lerp(0.01, 0.06, this.speed);
    this.rotation %= Math.PI * 2;
  }
  if (isKeyDown('TurnPlayerLeft')) {
    this.rotation -= lerp(0.01, 0.06, this.speed);
    this.rotation += Math.PI * 2;
    this.rotation %= Math.PI * 2;
  }
  if (isKeyDown('MovePlayerForward')) {
    this.speed += 0.03;
    this.speed = Math.min(1, this.speed);
    times(1, () => {
      const smokeDistance = rand(5, 30) * (this.speed + 1);
      const dX = Math.cos(this.rotation) * -smokeDistance + rand(-15, 15) * this.speed;
      const dY = Math.sin(this.rotation) * -smokeDistance + rand(-15, 15) * this.speed;
      state.smokes.push(smoke({
        position: {
          x: this.position.x + dX,
          y: this.position.y + dY,
        }
      }));
    });
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
      this.pullEffect.width = this.pullEffect.height = 10000;
    }
    this.pullEffect.alpha = 1;
  }
  if (isKeyDown('Push')) {
    state.playerWell = { position: this.position, strength: -1 };

    this.pullEffect.width = this.pullEffect.height *= 1.1;
    if (this.pullEffect.width > 10000) {
      this.pullEffect.width = this.pullEffect.height = 100;
    }
    this.pullEffect.alpha = 1;
  }
  if (this.pullEffect.alpha === 0) {
    this.pullEffect.height = 100;
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

  this.speed *= 0.97;
  if (Math.abs(this.speed) < 0.02) {
    this.speed = 0;
  }
  const movement = this.speed * 30;
  const dX = Math.cos(this.rotation) * movement;
  const dY = Math.sin(this.rotation) * movement;
  this.position.x += dX;
  this.position.y += dY;

  this.redshift.alpha = this.speed;

  this.hitbox.setOffset(new SAT.Vector(this.position.x, this.position.y));
  this.hitbox.rotate(this.rotation);
}

export default () => {
  const PIXI = window.PIXI;
  const graphics = new PIXI.Graphics();

  const size = 2;
  graphics.beginFill(0xFFEFBD);

  graphics.moveTo(-10 * size, -6 * size);
  graphics.lineTo(10 * size, 0 * size);
  graphics.lineTo(-10 * size, 6 * size);
  graphics.lineTo(-10 * size, -6 * size);
  graphics.endFill();

  const redshift = new PIXI.Sprite();
  const redshiftGraphics = new PIXI.Graphics();
  redshiftGraphics.beginFill(0xffffff);

  redshiftGraphics.moveTo(-10 * size, -6 * size);
  redshiftGraphics.lineTo(10 * size, 0 * size);
  redshiftGraphics.lineTo(-10 * size, 6 * size);
  redshiftGraphics.lineTo(-10 * size, -6 * size);
  redshiftGraphics.endFill();
  redshift.addChild(redshiftGraphics);

  const pullEffect = new PIXI.Graphics();

  pullEffect.beginFill(0, 0);
  pullEffect.lineStyle(200, 0xFFFACC, 1);
  pullEffect.drawCircle(0, 0, 500);
  pullEffect.endFill();

  const player = new PIXI.Sprite();
  player.addChild(graphics);
  player.addChild(redshift);
  player.redshift = redshift;
  player.addChild(pullEffect);
  player.pullEffect = pullEffect;
  player.speed = 0;
  player.size = 0.1;
  player.dX = 0;
  player.dY = 0;
  player.update = update.bind(player);

  player.hitbox = new SAT.Polygon(new SAT.Vector(), [
    new SAT.Vector(5, 0),
    new SAT.Vector(-5, 3),
    new SAT.Vector(-5, -3),
  ]);

  addToStage(player);

  return player;
};
