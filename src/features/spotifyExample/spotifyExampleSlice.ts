import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from '../../redux/store';
import {
  setLoggedIn
} from '../../features/authorization/authorizationSlice';

interface SpotifyExampleState {
  displayName: string,
  product: string,
  userId: string
}

const initialState: SpotifyExampleState = {
  displayName: '',
  product: '',
  userId: ''
};

export const spotifyexampleSlice = createSlice({
  name: 'spotifyExample',
  initialState,
  reducers: {
    setDisplayName: (state, action: PayloadAction<string>) => {
      state.displayName = action.payload;
    },
    setProduct: (state, action: PayloadAction<string>) => {
      state.product = action.payload;
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload;
    },
  },
});

export const { setDisplayName, setProduct, setUserId } = spotifyexampleSlice.actions;

export const selectDisplayName = (state: RootState) => state.spotifyExample.displayName;
export const selectProduct = (state: RootState) => state.spotifyExample.product;
export const selectUserId = (state: RootState) => state.spotifyExample.userId;

export const setUserProfileAsync = (accessToken: string): AppThunk => dispatch => {
  const myHeaders = new Headers();
  myHeaders.append('Authorization', 'Bearer ' + accessToken);

  fetch('https://api.spotify.com/v1/me', {
    method: 'GET',
    headers: myHeaders,
  }).then(response => response.json())
    .then((data) => {
      console.log(data);
      dispatch(setDisplayName(data.display_name ? data.display_name : data.id));
      dispatch(setProduct(data.product));
      dispatch(setUserId(data.id));
    }).catch((error) => {
      console.log(error);
      if (error instanceof XMLHttpRequest) {
        if (error.status === 401) {
          dispatch(setLoggedIn(false));
        }
      }
    });
};

export default spotifyexampleSlice.reducer;