let mouseX;
let mouseY;
let mouseDown;
let mouseDownLocation;
const keyDown = {};

const keyMapping = {
  ' ': 'Pull',
  Control: 'Pull',
  Shift: 'Push',
  Enter: 'Pull',
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
  W: 'MovePlayerForward',
  A: 'TurnPlayerLeft',
  S: 'MovePlayerBack',
  D: 'TurnPlayerRight',
  touch: 'MovePlayerForward',
};

window.addEventListener('pointerdown', (e) => {
  mouseDown = true;
  mouseDownLocation = {
    x: e.clientX,
    y: e.clientY,
  };
  keyDown.MovePlayerForward = true;
});

window.addEventListener('pointerup', () => {
  mouseDown = false;
  mouseDownLocation = null;
  keyDown.MovePlayerForward = false;
});

window.addEventListener('pointermove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (mouseDown) {
    keyDown.TurnPlayerRight = false;
    keyDown.TurnPlayerLeft = false;
    if (Math.abs(mouseX - mouseDownLocation.x) > 50) {
      if (mouseX > mouseDownLocation.x) {
        keyDown.TurnPlayerRight = true;
      } else {
        keyDown.TurnPlayerLeft = true;
      }
    }
  }
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
