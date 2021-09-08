import React from 'react';
import { useSelector } from 'react-redux';
import { selectDisplayName } from './UserSlice';

export function SpotifyExample() {
  const displayName = useSelector(selectDisplayName);

  return (
    <div className="column">
      {displayName && <div className="row">
        Logged in as: {displayName}
      </div>}
    </div>
  );
}