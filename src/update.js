export default (state) => {
  const newState = state;
  newState.player.update(newState);
  newState.smokes.forEach(smoke => smoke.update(newState));
  newState.steadies.forEach(steady => steady.update(newState));
  newState.camera.update(newState);

  return newState;
};
