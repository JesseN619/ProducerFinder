import React from 'react';
import { useSelector } from 'react-redux';
import { selectDisplayName } from './UserSlice';

export function User() {
  const displayName = useSelector(selectDisplayName);

  return (
    <div className="text-center">
      {displayName && <div className="row">
        Logged in as: {displayName}
      </div>}
    </div>
  );
}