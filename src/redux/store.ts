import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import authorizationReducer from '../features/authorization/authorizationSlice';
import spotifyExampleReducer from '../features/spotifyExample/spotifyExampleSlice';
import playlistReducer from '../components/CreatePlaylist/createPlaylistSlice';
import songIdReducer from '../components/GeniusLogic/SongIdSlice';

export const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
    spotifyExample: spotifyExampleReducer,
    playlist: playlistReducer,
    songId: songIdReducer,
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