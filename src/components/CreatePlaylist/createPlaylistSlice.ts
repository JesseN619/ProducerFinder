import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

interface PlaylistState {
  playlistName: string,
  playlistId: string
}

const initialState: PlaylistState = {
  playlistName: '',
  playlistId: ''
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setPlaylistName: (state, action: PayloadAction<string>) => {
      state.playlistName = action.payload;
    },
    setPlaylistId: (state, action: PayloadAction<string>) => {
      state.playlistId = action.payload;
    },
  },
});

export const { setPlaylistName, setPlaylistId } = playlistSlice.actions;

export const selectPlaylistName = (state: RootState) => state.playlist.playlistName;
export const selectPlaylistId = (state: RootState) => state.playlist.playlistId;

export default playlistSlice.reducer;