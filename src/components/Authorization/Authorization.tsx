import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  setLoggedIn,
  setAccessToken,
  setTokenExpiryDate,
  selectIsLoggedIn,
  selectTokenExpiryDate,
} from './authorizationSlice';
import { setUserProfileAsync } from '../User/UserSlice';
import { getAuthorizeHref } from '../../oauthConfig';
import { getHashParams, removeHashParamsFromUrl } from '../../utils/hashUtils';
import { CreatePlaylist } from '../CreatePlaylist';

const hashParams = getHashParams();
const access_token = hashParams.access_token;
const expires_in = hashParams.expires_in;
removeHashParamsFromUrl();

export function Authorization() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const tokenExpiryDate = useSelector(selectTokenExpiryDate);
  const dispatch = useDispatch();

  useEffect(() => {
    if (access_token) {
      dispatch(setLoggedIn(true));
      dispatch(setAccessToken(access_token));
      dispatch(setTokenExpiryDate(Number(expires_in)));
      dispatch(setUserProfileAsync(access_token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="text-center">
        {!isLoggedIn && <div className="login mx-auto"><button
          className="inline-block align-middle bg-blue-600 hover:bg-blue-700 rounded px-5 py-3 mt-7 mb-3 text-white"
          aria-label="Log in using OAuth 2.0"
          onClick={() => window.open(getAuthorizeHref(), '_self')}
          >
          Log in with Spotify
          </button>
          <p>Log in to your Spotify account to add songs to your playlists.</p></div>
        }
        {isLoggedIn && <button
          className="bg-blue-600 hover:bg-blue-700 rounded px-3 py-1 mt-10 mx-auto text-white"
          aria-label="Log out of spotify"
          onClick={() => window.location.reload()}
          >
          Log out
          </button>}
    </div>
  );
}