import React from 'react';
import { useSelector } from 'react-redux';
import { selectDisplayName, selectProduct, selectUserId } from './spotifyExampleSlice';

export function SpotifyExample() {
  const displayName = useSelector(selectDisplayName);
  const product = useSelector(selectProduct);
  const userId = useSelector(selectUserId);

  return (
    <div className="column">
      {displayName && <div className="row">
        Logged in as: {displayName}
      </div>}
      {product && <div className="row">
        Subscription type: {product}
      </div>}
      {userId && <div className="row">
        User ID: {userId}
      </div>}
    </div>
  );
}