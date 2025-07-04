import React, { useState } from 'react';

const RoomJoin = ({ onJoinRoom }) => {
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const generateRoomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const handleJoinRoom = async () => {
    if (!roomCode.trim()) return;
    
    setIsJoining(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onJoinRoom(roomCode.toUpperCase());
    } catch (error) {
      console.error('Error joining room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleCreateRoom = async () => {
    const newRoomCode = generateRoomCode();
    setRoomCode(newRoomCode);
    
    setIsJoining(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      onJoinRoom(newRoomCode);
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsJoining(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && roomCode.trim()) {
      handleJoinRoom();
    }
  };

  return (
    <div className="room-join-container">
      <div className="room-join-card">
        <h1 className="room-join-title">
          Collaborative<br />
          Whiteboard
        </h1>
        <p className="room-join-subtitle">
          Join or create a room to start drawing together!
        </p>
        
        <div className="room-input-container">
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            onKeyPress={handleKeyPress}
            placeholder="Enter Room Code (e.g., ABC123)"
            className="room-input"
            maxLength={8}
            disabled={isJoining}
          />
        </div>
        
        <button
          onClick={handleJoinRoom}
          disabled={!roomCode.trim() || isJoining}
          className="join-button"
        >
          {isJoining ? 'Joining...' : 'Join Room'}
        </button>
        
        <button
          onClick={handleCreateRoom}
          disabled={isJoining}
          className="create-button"
        >
          {isJoining ? 'Creating...' : 'Create New Room'}
        </button>
      </div>
    </div>
  );
};

export default RoomJoin;