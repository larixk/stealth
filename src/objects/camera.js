import SAT from 'sat';
import { clamp, rand } from '../util';
import { addToStage } from '../draw';

function update(state) {
  this.hitbox.rotate(-this.rotation);
  this.dRotation += rand(-0.005, 0.005);
  this.dRotation = clamp(this.dRotation, -0.01, 0.01);
  this.rotation += this.dRotation;

  this.speed += rand(-0.1, 0.1);
  this.speed *= 0.99;
  this.speed = clamp(this.speed, 0, 1);

  const movement = this.speed * 2;
  const dX = Math.cos(this.rotation) * movement;
  const dY = Math.sin(this.rotation) * movement;
  this.position.x += dX;
  this.position.y += dY;

  this.alpha = 1;
  this.hitbox.setOffset(new SAT.Vector(this.position.x, this.position.y));
  this.hitbox.rotate(this.rotation);

  if (this.intersectsWith(state.player)) {
    this.hitbox.rotate(-this.rotation);
    this.alpha = 0.5;
    this.rotation += 3;
    // state.reset();
    this.hitbox.setOffset(new SAT.Vector(this.position.x, this.position.y));
    this.hitbox.rotate(this.rotation);
  }


}
function intersectsWith(sprite) {
  return SAT.testPolygonPolygon(this.hitbox, sprite.hitbox);
}

export default (startingValues) => {
  const PIXI = window.PIXI;
  const graphics = new PIXI.Graphics();

  graphics.beginFill(rand(0xffffff));

  const size = rand(0.5, 1.5);

  graphics.moveTo(0, 0);
  graphics.lineTo(100 * size, -50 * size);
  graphics.lineTo(100 * size, 50 * size);
  graphics.lineTo(0, 0);
  graphics.endFill();
  graphics.cacheAsBitmap = true;

  // const camera = Object.assign(new PIXI.Sprite(), startingValues);
  const camera = new PIXI.Sprite();
  camera.position = startingValues.position;
  camera.opacity = 0.5;
  camera.addChild(graphics);
  camera.anchor.y = camera.anchor.x = 0.5;
  camera.speed = 0;
  camera.dRotation = 0;
  camera.update = update.bind(camera);
  camera.intersectsWith = intersectsWith.bind(camera);

  camera.hitbox = new SAT.Polygon(new SAT.Vector(), [
    new SAT.Vector(),
    new SAT.Vector(100 * size, 50 * size),
    new SAT.Vector(100 * size, -50 * size),
  ]);

  camera.cacheAsBitmap = true;

  addToStage(camera);

  return camera;
};
