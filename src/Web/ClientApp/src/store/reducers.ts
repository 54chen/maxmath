import { combineReducers } from 'redux';
import { ActionTypes, SET_USER, SET_GAME_PROGRESS } from './actions';
import { User, GameProgress } from './types';

const userReducer = (state: User | null = null, action: ActionTypes): User | null => {
  switch (action.type) {
    case SET_USER:
      return action.payload;
    default:
      return state;
  }
};

const gameProgressReducer = (state: GameProgress = {
  weapon: '',
  questionCount: 0,
  npcReactivateTimes: {} // Fix: Update the initial value to an empty object
}, action: ActionTypes): GameProgress => {
  switch (action.type) {
    case SET_GAME_PROGRESS:
      return action.payload;
    default:
      return state;
  }
};

export default combineReducers({
  user: userReducer,
  gameProgress: gameProgressReducer,
});
