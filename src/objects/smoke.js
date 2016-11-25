import { rand, distance, lerp } from '../util';
import { addToStage } from '../draw';

function update(state) {
  this.alpha -= 0.003;
  // this.height += 0.02;
  this.height /= 1.02;
  this.hp -= this.dHp;
  this.width = this.height;


  if (this.type === 'attract') {
    this.position.x = lerp(this.position.x, state.player.position.x, 1 - this.hp);
    this.position.y = lerp(this.position.y, state.player.position.y, 1 - this.hp);
  } else {
    this.position.x += this.dX;
    this.position.y += this.dY;
  }

  if (this.hp <= 0) {
    this.removeFromStage();
    state.smokes = state.smokes.filter((otherSmoke) => otherSmoke !== this);
  }
}

export default ({ type, position, dX, dY, dHp, color, size = rand(10, 30) }) => {
  const PIXI = window.PIXI;
  const smoke = new PIXI.Sprite();
  smoke.position = position;


  const graphics = new PIXI.Graphics();
  graphics.beginFill(color);
  if (type !== 'danger') {
    graphics.drawCircle(0, 0, size * 10);
  } else {
    graphics.moveTo(-10 * size, -12 * size);
    graphics.lineTo(10 * size, 0 * size);
    graphics.lineTo(-10 * size, 12 * size);
    graphics.lineTo(-10 * size, -12 * size);
  }
  graphics.endFill();
  smoke.addChild(graphics);

  smoke.type = type;

  smoke.width = smoke.height = rand(0.03, 0.1);
  smoke.alpha = 1;
  smoke.rotation = rand(Math.PI * 2);
  smoke.dX = dX || rand(-2, 2);
  smoke.dY = dY || rand(-2, 2);
  smoke.dHp = dHp || 0.01;
  smoke.hp = 1;

  smoke.removeFromStage = addToStage(smoke);

  smoke.update = update;

  return smoke;
};
