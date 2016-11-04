import SAT from 'sat';
import { lerp, rand, distance } from '../util';
import { addToStage } from '../draw';

function update(state) {
  this.hitbox.rotate(-this.rotation);

  this.speed = 1;

  if (state.wells) {
    state.wells.forEach((well) => {
      const d = distance(this.position, well.position) / well.strength;
      this.dX += (well.position.x - this.position.x) / d * lerp(1, 0.5, this.size);
      this.dY += (well.position.y - this.position.y) / d * lerp(1, 0.5, this.size);
    });
  }
  if (state.playerWell) {
    const d = distance(this.position, state.playerWell.position) / state.playerWell.strength;
    this.dX += (state.playerWell.position.x - this.position.x) / d * lerp(1, 0.5, this.size);
    this.dY += (state.playerWell.position.y - this.position.y) / d * lerp(1, 0.5, this.size);
  }
  this.dX *= 0.995;
  this.dY *= 0.995;
  this.dX += rand(-0.03, 0.03);
  this.dY += rand(-0.03, 0.03);

  this.rotation += this.dRotation;

  this.position.x += this.dX;
  this.position.y += this.dY;

  this.alpha = 1;
  this.hitbox.setOffset(new SAT.Vector(this.position.x, this.position.y));
  this.hitbox.rotate(this.rotation);

  if (this.intersectsWith(state.player)) {
    state.player.speed = 0;
    this.alpha = 0.5;
  }
}
function intersectsWith(sprite) {
  return SAT.testPolygonPolygon(this.hitbox, sprite.hitbox);
}

const rgbToColor = (r, g, b) => (r * 0xffff) + (g * 0xff) + b;

export default (startingValues) => {
  const PIXI = window.PIXI;
  const graphics = new PIXI.Graphics();

  const size = rand(0.2, 1);

  const c1 = [146, 246, 226];
  const c2 = [228, 1, 110];
  // graphics.beginFill(rgbToColor(
  //   lerp(c1[0], c2[0], size),
  //   lerp(c1[1], c2[1], size),
  //   lerp(c1[2], c2[2], size)
  // ));
  graphics.beginFill(0);

  const vertices = [];
  let currentAngle = 0;
  while (currentAngle < Math.PI * 2) {
    const vertexSize = rand(30, 60) * Math.pow(size, 2) * 4;
    vertices.push({
      x: Math.cos(currentAngle) * vertexSize,
      y: Math.sin(currentAngle) * vertexSize,
    });
    currentAngle += rand(0.2, 2);
  }
  const satVectors = [];

  graphics.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i += 1) {
    graphics.lineTo(vertices[i].x, vertices[i].y);
    satVectors.push(new SAT.Vector(vertices[i].x, vertices[i].y));
  }
  graphics.lineTo(vertices[0].x, vertices[0].y);

  graphics.endFill();
  graphics.cacheAsBitmap = true;

  const hitbox = new SAT.Polygon(new SAT.Vector(), satVectors);

  const floater = new PIXI.Sprite();
  floater.size = size;
  floater.position = startingValues.position;
  floater.opacity = 0.5;
  floater.addChild(graphics);
  floater.anchor.y = floater.anchor.x = 0.5;
  floater.speed = 0;
  floater.dX = 0;
  floater.dY = 0;
  floater.dRotation = rand(-0.01, 0.01);
  floater.update = update.bind(floater);
  floater.intersectsWith = intersectsWith.bind(floater);

  floater.hitbox = hitbox;

  floater.cacheAsBitmap = true;

  addToStage(floater);

  return floater;
};
