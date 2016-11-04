export default () => new Promise((resolve) => {
  const PIXI = window.PIXI;

  PIXI.loader
    .add('img/player.png')
    .load(resolve);
});
