import React from 'react';

const UserCursors = ({ users }) => {
  return (
    <div className="user-cursors">
      {Array.from(users.entries()).map(([userId, user]) => (
        <div
          key={userId}
          className="user-cursor"
          style={{
            left: `${user.x}px`,
            top: `${user.y}px`,
            backgroundColor: user.color
          }}
          title={`User ${userId}`}
        />
      ))}
    </div>
  );
};

export default UserCursors;