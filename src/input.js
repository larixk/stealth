let mouseX;
let mouseY;
let mouseDown;
const keyDown = {};

window.addEventListener('mousedown', () => {
  mouseDown = true;
});

window.addEventListener('mouseup', () => {
  mouseDown = false;
});

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

window.addEventListener('keydown', (e) => {
  keyDown[e.key] = true;
});

window.addEventListener('keyup', (e) => {
  keyDown[e.key] = false;
});

export const getMousePosition = () => ({
  x: mouseX,
  y: mouseY,
});

export const isMouseDown = () => mouseDown;

export const isKeyDown = key => !!keyDown[key];
