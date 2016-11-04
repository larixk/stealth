import { addToStage } from './draw';

export default () => {
  const PIXI = window.PIXI;

  const player = new PIXI.Sprite(PIXI.loader.resources['img/player.png'].texture);
  player.anchor.y = player.anchor.x = 0.5;
  player.speed = 0;
  addToStage(player);
  return player;
};
