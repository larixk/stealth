import load from './src/load';
import game from './src/gameloop';
import initialState from './src/initialState';
import update from './src/update';
import { draw, resetStage } from './src/draw';

load().then(() => {
  const { setState } = game({
    msPerUpdate: 1000 / 60,
    update,
    draw,
  });
  const reset = () => {
    console.log('resetting');
    resetStage();
    const state = initialState();
    state.reset = reset;
    setState(state);
  };
  reset();
});
