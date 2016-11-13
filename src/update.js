import createFloater from './objects/createFloater';

export default (state) => {
  const newState = state;
  newState.playerWell = null;
  newState.player.update(newState);
  newState.smokes.forEach(smoke => smoke.update(newState));
  newState.agents = newState.agents.filter(agent => agent.update(newState));
  newState.camera.update(newState);

  while (newState.agents.length < 500) {
    newState.agents.push(createFloater(state));
  }

  return newState;
};
