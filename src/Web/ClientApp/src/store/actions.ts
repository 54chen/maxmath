import { User, GameProgress } from './types';

export const SET_USER = 'SET_USER';
export const SET_GAME_PROGRESS = 'SET_GAME_PROGRESS';

export interface SetUserAction {
  type: typeof SET_USER;
  payload: User | null;
}

export interface SetGameProgressAction {
  type: typeof SET_GAME_PROGRESS;
  payload: GameProgress;
}

export type ActionTypes = SetUserAction | SetGameProgressAction;

export const setUser = (user: User | null): SetUserAction => ({
  type: SET_USER,
  payload: user,
});

export const setGameProgress = (progress: GameProgress): SetGameProgressAction => ({
  type: SET_GAME_PROGRESS,
  payload: progress,
});
