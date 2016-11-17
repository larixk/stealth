import { rand, distance, lerp } from '../util';

function update(state) {
  if (state.wells) {
    state.wells.forEach((well) => {
      const d = distance(this.position, well.position) / well.strength;
      this.dX += ((well.position.x - this.position.x) / Math.pow(d, 2)) * ((1 - this.size) * 500);
      this.dY += ((well.position.y - this.position.y) / Math.pow(d, 2)) * ((1 - this.size) * 500);
    });
  }
  this.position.x += this.dX;
  this.position.y += this.dY;
}

export default ({ position, strength }) => {
  const attractor = {
    position,
    strength,
    size: 1,
  };

  attractor.update = update.bind(attractor);
  return attractor;
};
