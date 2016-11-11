export default () => new Promise((resolve) => {
  const PIXI = window.PIXI;

  PIXI.loader
    .add('img/paper-noise.jpg')
    .load(resolve);
});
