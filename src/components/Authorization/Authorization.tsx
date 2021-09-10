import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setLoggedIn,
  setAccessToken,
  setTokenExpiryDate,
  selectIsLoggedIn,
} from './authorizationSlice';
import { setUserProfileAsync } from '../User/UserSlice';
import { getAuthorizeHref } from '../../oauthConfig';
import { getHashParams, removeHashParamsFromUrl } from '../../utils/hashUtils';
import logo from '../../assets/images/spotify-icons-logos/logos/01_RGB/02_PNG/Spotify_Logo_RGB_Black.png';

const hashParams = getHashParams();
const access_token = hashParams.access_token;
const expires_in = hashParams.expires_in;
removeHashParamsFromUrl();

export function Authorization() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    if (access_token) {
      dispatch(setLoggedIn(true));
      dispatch(setAccessToken(access_token));
      dispatch(setTokenExpiryDate(Number(expires_in)));
      dispatch(setUserProfileAsync(access_token));
    }
  }, []);

  return (
    <div className="text-center">
        {!isLoggedIn && <div className="login mx-auto"><button
          className="bg-white border-2 border-blue-600 hover:border-white rounded px-5 py-3 mt-7 mb-3 mx-auto flex"
          aria-label="Log in using OAuth 2.0"
          onClick={() => window.open(getAuthorizeHref(), '_self')}
          >
          Log in with <img className="spotify-logo ml-2" src={logo} alt="Spotify logo" />
          </button>
          <p>to add songs to your playlists.</p></div>
        }
        {isLoggedIn && <button
          className="bg-white border-2 border-blue-600 hover:border-white rounded px-5 py-3 mt-7 mb-3 mx-auto flex"
          aria-label="Log out of spotify"
          onClick={() => window.location.reload()}
          >
          Log out of <img className="spotify-logo ml-2" src={logo} alt="Spotify logo" />
          </button>}
    </div>
  );
}