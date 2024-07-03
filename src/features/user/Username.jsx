import React from 'react';
import { useSelector } from 'react-redux';

const Username = () => {
  const username = useSelector((state) => {
    return state.user.username;
  });

  if (!username) return null;

  return (
    <div className="bangers hidden text-2xl font-semibold tracking-widest text-amber-900 md:block">
      {username ? username : ''}
    </div>
  );
};

export default Username;
