import SAT from 'sat';
import { lerp, rand, distance } from '../util';
import { addToStage } from '../draw';

function update(state) {
  this.hitbox.rotate(-this.rotation);

  this.speed = 1;

  if (state.wells) {
    state.wells.forEach((well) => {
      const d = distance(this.position, well.position) / well.strength;
      this.dX += ((well.position.x - this.position.x) / Math.pow(d, 2)) * ((1 - this.size) * 300);
      this.dY += ((well.position.y - this.position.y) / Math.pow(d, 2)) * ((1 - this.size) * 300);
    });
  }
  this.distanceToPlayer = distance(this.position, state.player.position);
  if (state.playerWell) {
    const speed = (Math.pow(this.distanceToPlayer, 2) / state.playerWell.strength) * lerp(1, 0.5, this.size) * (1 / 1000);
    this.dX += (state.playerWell.position.x - this.position.x) / speed;
    this.dY += (state.playerWell.position.y - this.position.y) / speed;
  }

  // state.player.totalDistance += distance(this.position, state.player.position);
  // this.dX += rand(-0.03, 0.03);
  // this.dY += rand(-0.03, 0.03);
  this.dX *= 0.999;
  this.dY *= 0.999;

  this.rotation += this.dRotation;

  this.position.x += this.dX;
  this.position.y += this.dY;

  this.hitbox.setOffset(new SAT.Vector(this.position.x, this.position.y));
  this.hitbox.rotate(this.rotation);

  if (this.intersectsWith(state.player)) {
    state.player.speed = -0.2;
    state.camera.x += rand(-10 / state.camera.zoom, 10 / state.camera.zoom);
    state.camera.y += rand(-10 / state.camera.zoom, 10 / state.camera.zoom);
  }
}
function intersectsWith(sprite) {
  return SAT.testPolygonPolygon(this.hitbox, sprite.hitbox);
}

export default (startingValues) => {
  const PIXI = window.PIXI;

  const size = rand(0.2, 1);
  // graphics.beginFill(rgbToColor(0xff * size, 0xff * size, 0xff * size));

  const vertices = [];
  let currentAngle = 0;
  let maxVertexSize = 0;
  while (currentAngle < Math.PI * 2) {
    const vertexSize = rand(40, 60) * Math.pow(size, 2) * 5;
    if (vertexSize > maxVertexSize) {
      maxVertexSize = vertexSize;
    }
    vertices.push({
      x: Math.cos(currentAngle) * vertexSize,
      y: Math.sin(currentAngle) * vertexSize,
    });
    currentAngle += rand(0.2, 1);
  }
  const satVectors = [];

  const mask = new PIXI.Graphics();
  mask.beginFill(0xB5D6B2);

  const graphics = new PIXI.Graphics();
  graphics.beginFill(0xB5D6B2);

  mask.moveTo(vertices[0].x, vertices[0].y);
  graphics.moveTo(vertices[0].x, vertices[0].y);
  for (let i = 1; i < vertices.length; i += 1) {
    mask.lineTo(vertices[i].x, vertices[i].y);
    graphics.lineTo(vertices[i].x, vertices[i].y);
    satVectors.push(new SAT.Vector(vertices[i].x, vertices[i].y));
  }
  mask.lineTo(vertices[0].x, vertices[0].y);
  graphics.lineTo(vertices[0].x, vertices[0].y);

  mask.endFill();
  graphics.endFill();

  const texture = new PIXI.Sprite.fromImage('img/paper-noise.jpg');
  texture.width = 120 * 5;
  texture.height = 120 * 5;
  texture.alpha = 0.2;
  texture.anchor.x = texture.anchor.y = 0.5;

  texture.mask = mask;
  texture.bendMode = PIXI.BLEND_MODES.OVERLAY;

  const hitbox = new SAT.Polygon(new SAT.Vector(), satVectors);

  const floater = new PIXI.Sprite();
  floater.size = size;
  floater.position = startingValues.position;
  floater.opacity = 0.5;
  floater.textureSprite = texture;
  floater.addChild(graphics);
  floater.addChild(mask);
  floater.addChild(texture);
  floater.anchor.y = floater.anchor.x = 0.5;
  floater.speed = 0;
  floater.dX = rand(-10, 10);
  floater.dY = rand(-10, 10);
  floater.dRotation = rand(-0.01, 0.01);
  floater.update = update.bind(floater);
  floater.intersectsWith = intersectsWith.bind(floater);

  floater.hitbox = hitbox;

  floater.cacheAsBitmap = true;

  addToStage(floater);

  return floater;
};
