import SAT from 'sat';
import { lerp, rand, distance } from '../util';
import { addToStage } from '../draw';

const PIXI = window.PIXI;

function update(state) {
  return true;
}

function intersectsWith(sprite) {
  return SAT.testPolygonPolygon(this.hitbox, sprite.hitbox);
}

export default ({ position }) => {
  const size = rand(0.2, 1);

  const vertices = [];
  let currentAngle = 0;
  const vertexSize = rand(40, 60) * Math.pow(size, 3) * 10;
  while (currentAngle < Math.PI * 2) {
    vertices.push({
      x: Math.cos(currentAngle) * vertexSize,
      y: Math.sin(currentAngle) * vertexSize,
    });
    currentAngle += Math.PI / 2;
  }
  const satVectors = [];

  const graphics = new PIXI.Graphics();

  graphics.beginFill(0xffffff);

  graphics.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i += 1) {
    graphics.lineTo(vertices[i].x, vertices[i].y);
    satVectors.push(new SAT.Vector(vertices[i].x, vertices[i].y));
  }
  graphics.lineTo(vertices[0].x, vertices[0].y);
  graphics.endFill();

  const hitbox = new SAT.Polygon(new SAT.Vector(), satVectors);

  const steady = new PIXI.Sprite();
  steady.size = size;
  steady.position = position;
  steady.addChild(graphics);
  steady.anchor.y = steady.anchor.x = 0.5;
  steady.update = update.bind(steady);
  steady.intersectsWith = intersectsWith.bind(steady);

  steady.hitbox = hitbox;
  steady.hitbox.rotate(-steady.rotation);
  steady.hitbox.setOffset(new SAT.Vector(steady.position.x, steady.position.y));
  steady.hitbox.rotate(steady.rotation);

  steady.cacheAsBitmap = true;

  steady.removeFromStage = addToStage(steady);

  return steady;
};
