export default (state) => {
  state.player.update(state);
  state.agents.forEach((agent) => agent.update(state));
  state.camera.update(state);
  return state;
};
