import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

interface AddSongIdState {
  addSongId: string
}

const initialState: AddSongIdState = {
  addSongId: '',
};

export const addSongIdSlice = createSlice({
  name: 'addSongId',
  initialState,
  reducers: {
    setAddSongId: (state, action: PayloadAction<string>) => {
      state.addSongId = action.payload;
    },
  },
});

export const { setAddSongId } = addSongIdSlice.actions;

export const selectAddSongId = (state: RootState) => state.addSongId.addSongId;

export default addSongIdSlice.reducer;