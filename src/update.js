export default (state) => {
  state.playerWell = null;
  state.player.update(state);
  state.smokes.forEach(smoke => smoke.update(state));
  state.agents.forEach(agent => agent.update(state));
  state.camera.update(state);
  // console.log(state.player.totalDistance);
  return state;
};
