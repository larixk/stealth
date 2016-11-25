import { clamp, lerp } from './util';
import 'pixi.js';

const PIXI = window.PIXI;

let gui;

let width = 0;
let height = 0;

const renderer = new PIXI.WebGLRenderer(800, 600);
renderer.autoResize = true;

renderer.view.style.display = 'block';
renderer.backgroundColor = 0x5A464C;
document.body.appendChild(renderer.view);
document.body.style.margin = 0;

const stretchToFillScreen = () => {
  width = window.innerWidth;
  height = window.innerHeight;
  renderer.resize(width, height);
};
window.addEventListener('resize', stretchToFillScreen);
stretchToFillScreen();

let stage = new PIXI.Container();

export const getSize = () => ({ width, height });

export const addToStage = (child) => {
  stage.addChild(child);
  return () => {
    stage.removeChild(child);
  };
};

export const resetStage = () => {
  stage = new PIXI.Container();


  const style = {
    // fontFamily: 'Arial',
    fontSize: '400px',
    fontWeight: 'bold',
    fill: '#F1E4E8',
    // stroke: '#5A464C',
    // strokeThickness: 0,
    // dropShadow: true,
    // dropShadowColor: '#F1E4E8',
    // dropShadowAngle: Math.PI / 6,
    // dropShadowDistance: 50,
    // wordWrap: true,
    // wordWrapWidth: 440,
  };

  gui = new PIXI.Text('', style);
  gui.points = 0;
  gui.maxPoints = 1;

  addToStage(gui);
};

export const setBackground = (color) => {
  renderer.backgroundColor = color;
};

export const draw = ({ camera, player }) => {
  // stage.x = (width / 2) - (camera.x * camera.zoom);
  // stage.y = (height / 2) - (camera.y * camera.zoom);
  stage.x = width * 0.5;
  stage.y = height * 0.75;
  stage.pivot.x = camera.x;
  stage.pivot.y = camera.y;
  gui.points = lerp(gui.points, player.currentPoints, 0.1);
  gui.maxPoints = Math.max(gui.points, gui.maxPoints);
  // gui.setText(`\n${Math.round(100 * (gui.points / gui.maxPoints))}`);
  gui.setText(`\n${player.currentPoints}`);
  gui.anchor.set(0.5, -0.4);
  gui.x = player.x;
  gui.y = player.y;
  gui.scale.x = gui.scale.y = lerp(gui.scale.x, clamp(Math.abs(player.currentPoints - gui.points) / 100, 0.1, 1), 0.1);
  gui.rotation = lerp(gui.rotation, -camera.rotation, 0.2);
  stage.scale.x = stage.scale.y = camera.zoom;
  stage.rotation = camera.rotation;
  renderer.render(stage);
};
