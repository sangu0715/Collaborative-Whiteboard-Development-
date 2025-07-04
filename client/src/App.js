import React, { useState } from 'react';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';
import './App.css';

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const handleJoinRoom = (roomId) => {
    setCurrentRoom(roomId);
    setIsConnected(true);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setIsConnected(false);
  };

  return (
    <div className="App">
      {!currentRoom ? (
        <RoomJoin onJoinRoom={handleJoinRoom} />
      ) : (
        <Whiteboard 
          roomId={currentRoom} 
          onLeaveRoom={handleLeaveRoom}
          isConnected={isConnected}
        />
      )}
    </div>
  );
}

export default App;