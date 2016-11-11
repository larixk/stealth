import { rand, distance, lerp } from '../util';
import { addToStage } from '../draw';

function update(state) {
  // this.alpha -= 0.003;
  // this.height += 0.02;
  this.height /= 1.01;
  this.width = this.height;

this.position.x += this.dX;
this.position.y += this.dY;

  if (this.height <= 0.02) {
    this.removeFromStage();
    state.smokes = state.smokes.filter((otherSmoke) => otherSmoke !== this);
  }
}

export default ({ position, dX, dY }) => {
  const PIXI = window.PIXI;
  const smoke = new PIXI.Sprite();
  smoke.position = position;

  console.log('creating smoke');


  const graphics = new PIXI.Graphics();
  graphics.beginFill(0xF1E4E8);
  const size = rand(10, 30);
  graphics.moveTo(-5 * size, -6 * size);
  graphics.lineTo(5 * size, 0 * size);
  graphics.lineTo(-5 * size, 6 * size);
  graphics.lineTo(-5 * size, -6 * size);
  graphics.endFill();
  smoke.addChild(graphics);

  smoke.width = smoke.height = rand(0.03, 0.1);
  smoke.alpha = 1;
  smoke.rotation = rand(Math.PI * 2);
  smoke.dX = rand(-2, 2);
  smoke.dY = rand(-2, 2);;
  smoke.hp = 1;

  smoke.removeFromStage = addToStage(smoke);

  smoke.update = update;

  return smoke;
};
