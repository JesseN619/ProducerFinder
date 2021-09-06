import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

interface SongIdState {
  songId: string
}

const initialState: SongIdState = {
  songId: '',
};

export const songIdSlice = createSlice({
  name: 'songId',
  initialState,
  reducers: {
    setSongId: (state, action: PayloadAction<string>) => {
      state.songId = action.payload;
    },
  },
});

export const { setSongId } = songIdSlice.actions;

export const selectSongId = (state: RootState) => state.songId.songId;

export default songIdSlice.reducer;