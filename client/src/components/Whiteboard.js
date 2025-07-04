import React, { useState, useEffect, useRef } from 'react';
import DrawingCanvas from './DrawingCanvas';
import Toolbar from './Toolbar';
import UserCursors from './UserCursors';
import io from 'socket.io-client';

const Whiteboard = ({ roomId, onLeaveRoom, isConnected }) => {
  const [socket, setSocket] = useState(null);
  const [userCount, setUserCount] = useState(1);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [users, setUsers] = useState(new Map());
  const [drawingSettings, setDrawingSettings] = useState({
    color: '#000000',
    strokeWidth: 3
  });

  const canvasRef = useRef(null);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Join room
    newSocket.emit('join-room', roomId);

    // Socket event listeners
    newSocket.on('connect', () => {
      setConnectionStatus('connected');
    });

    newSocket.on('disconnect', () => {
      setConnectionStatus('disconnected');
    });

    newSocket.on('user-count', (count) => {
      setUserCount(count);
    });

    newSocket.on('user-joined', (userId) => {
      console.log('User joined:', userId);
    });

    newSocket.on('user-left', (userId) => {
      setUsers(prev => {
        const newUsers = new Map(prev);
        newUsers.delete(userId);
        return newUsers;
      });
    });

    newSocket.on('cursor-move', ({ userId, x, y }) => {
      setUsers(prev => {
        const newUsers = new Map(prev);
        newUsers.set(userId, { x, y, color: getRandomColor() });
        return newUsers;
      });
    });

    newSocket.on('draw-data', (drawData) => {
      if (canvasRef.current) {
        canvasRef.current.handleRemoteDrawing(drawData);
      }
    });

    newSocket.on('canvas-cleared', () => {
      if (canvasRef.current) {
        canvasRef.current.clearCanvas();
      }
    });

    return () => {
      newSocket.emit('leave-room', roomId);
      newSocket.disconnect();
    };
  }, [roomId]);

  const getRandomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleCursorMove = (x, y) => {
    if (socket && connectionStatus === 'connected') {
      socket.emit('cursor-move', { roomId, x, y });
    }
  };

  const handleDrawingData = (drawData) => {
    if (socket && connectionStatus === 'connected') {
      socket.emit('draw-data', { roomId, ...drawData });
    }
  };

  const handleClearCanvas = () => {
    if (socket && connectionStatus === 'connected') {
      socket.emit('clear-canvas', roomId);
    }
    if (canvasRef.current) {
      canvasRef.current.clearCanvas();
    }
  };

  const handleLeaveRoom = () => {
    if (socket) {
      socket.emit('leave-room', roomId);
      socket.disconnect();
    }
    onLeaveRoom();
  };

  return (
    <div className="whiteboard-container">
      <div className="whiteboard-header">
        <div className="room-info">
          <div className="room-code">Room: {roomId}</div>
          <div className="user-count">
            <span>👥</span>
            <span>{userCount} user{userCount !== 1 ? 's' : ''}</span>
          </div>
          <div className="connection-status">
            <div className={`status-dot ${connectionStatus === 'connected' ? '' : 'disconnected'}`}></div>
            <span>{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
          </div>
        </div>
        <button onClick={handleLeaveRoom} className="leave-button">
          Leave Room
        </button>
      </div>

      <div className="whiteboard-main">
        <Toolbar
          drawingSettings={drawingSettings}
          onSettingsChange={setDrawingSettings}
          onClearCanvas={handleClearCanvas}
        />
        
        <div className="canvas-container">
          <DrawingCanvas
            ref={canvasRef}
            drawingSettings={drawingSettings}
            onDrawingData={handleDrawingData}
            onCursorMove={handleCursorMove}
          />
          <UserCursors users={users} />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;