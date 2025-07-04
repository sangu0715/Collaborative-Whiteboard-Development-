import React, { useState } from 'react';
import RoomJoin from './components/RoomJoin';
import Whiteboard from './components/Whiteboard';
import './App.css';

function App() {
  const [currentRoom, setCurrentRoom] = useState(null);
  const [drawingData, setDrawingData] = useState([]);

  const handleJoinRoom = (roomId, initialDrawingData) => {
    setCurrentRoom(roomId);
    setDrawingData(initialDrawingData || []);
  };

  const handleLeaveRoom = () => {
    setCurrentRoom(null);
    setDrawingData([]);
  };

  return (
    <div className="App">
      {!currentRoom ? (
        <RoomJoin onJoinRoom={handleJoinRoom} />
      ) : (
        <Whiteboard 
          roomId={currentRoom} 
          initialDrawingData={drawingData}
          onLeaveRoom={handleLeaveRoom}
        />
      )}
    </div>
  );
}

export default App;