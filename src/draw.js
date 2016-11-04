import 'pixi.js';

const PIXI = window.PIXI;

let width = 0;
let height = 0;

const renderer = new PIXI.WebGLRenderer(800, 600);
renderer.autoResize = true;

renderer.view.style.display = 'block';
renderer.backgroundColor = 0xffffff;
document.body.appendChild(renderer.view);
document.body.style.margin = 0;

const stretchToFillScreen = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.resize(width, height);
};
window.addEventListener('resize', stretchToFillScreen);
stretchToFillScreen();

const stage = new PIXI.Container();

export const getSize = () => ({ width, height });

export const addToStage = (child) => {
  stage.addChild(child);
};

export const draw = ({ camera }) => {
  stage.x = (width / 2) - (camera.x * camera.zoom);
  stage.y = (height / 2) - (camera.y * camera.zoom);
  stage.scale.x = stage.scale.y = camera.zoom;
  stage.children = stage.children.sort((a, b) => a.position.y - b.position.y);
  renderer.render(stage);
};
