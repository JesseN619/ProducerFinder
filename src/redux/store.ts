import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import authorizationReducer from "../components/Authorization/authorizationSlice";
import spotifyExampleReducer from "../components/User/UserSlice";
import playlistReducer from "../components/CreatePlaylist/createPlaylistSlice";
import addSongIdReducer from "../components/ProducerTopSongsList/AddSongIdSlice";

export const store = configureStore({
  reducer: {
    authorization: authorizationReducer,
    spotifyExample: spotifyExampleReducer,
    playlist: playlistReducer,
    addSongId: addSongIdReducer,
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
