import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authorizationReducer from '../features/authorization/authorizationSlice';
import spotifyExampleReducer from '../features/spotifyExample/spotifyExampleSlice';
import playlistReducer from '../components/Playlist/playlistSlice';

export const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
    spotifyExample: spotifyExampleReducer,
    playlist: playlistReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;