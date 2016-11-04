let mouseX;
let mouseY;
let mouseDown;
const keyDown = {};

const keyMapping = {
  ' ': 'Pull',
  Shift: 'Push',
  '-': 'ZoomCameraIn',
  '=': 'ZoomCameraOut',
  // ArrowUp: 'MoveCameraUp',
  // ArrowLeft: 'MoveCameraLeft',
  // ArrowDown: 'MoveCameraDown',
  // ArrowRight: 'MoveCameraRight',
  ArrowUp: 'MovePlayerForward',
  ArrowLeft: 'TurnPlayerLeft',
  ArrowDown: 'MovePlayerBack',
  ArrowRight: 'TurnPlayerRight',
  w: 'MovePlayerForward',
  a: 'TurnPlayerLeft',
  s: 'MovePlayerBack',
  d: 'TurnPlayerRight',

};

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
  const mappedKey = keyMapping[e.key];
  if (!mappedKey) {
    console.log('Unmapped key pressed', e.key);
    return;
  }
  e.preventDefault();
  keyDown[mappedKey] = true;
});

window.addEventListener('keyup', (e) => {
  const mappedKey = keyMapping[e.key];
  if (!mappedKey) {
    return;
  }
  e.preventDefault();
  keyDown[mappedKey] = false;
});

export const getMousePosition = () => ({
  x: mouseX,
  y: mouseY,
});

export const isMouseDown = () => mouseDown;

export const isKeyDown = key => !!keyDown[key];
