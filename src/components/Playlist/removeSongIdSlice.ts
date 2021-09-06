import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../redux/store';

interface RemoveSongIdState {
  removeSongId: string
}

const initialState: RemoveSongIdState = {
  removeSongId: '',
};

export const removeSongIdSlice = createSlice({
  name: 'removeSongId',
  initialState,
  reducers: {
    setRemoveSongId: (state, action: PayloadAction<string>) => {
      state.removeSongId = action.payload;
    },
  },
});

export const { setRemoveSongId } = removeSongIdSlice.actions;

export const selectRemoveSongId = (state: RootState) => state.removeSongId.removeSongId;

export default removeSongIdSlice.reducer;