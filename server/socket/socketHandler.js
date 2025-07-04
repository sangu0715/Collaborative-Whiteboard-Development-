const Room = require('../models/Room');

const activeUsers = new Map(); // roomId -> Set of socket ids
const userCursors = new Map(); // socketId -> {roomId, x, y, color}

function socketHandler(io) {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join-room', async (roomId) => {
      try {
        socket.join(roomId);
        
        // Add user to active users
        if (!activeUsers.has(roomId)) {
          activeUsers.set(roomId, new Set());
        }
        activeUsers.get(roomId).add(socket.id);
        
        // Assign cursor color
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
        const userColor = colors[Array.from(activeUsers.get(roomId)).indexOf(socket.id) % colors.length];
        
        userCursors.set(socket.id, { roomId, x: 0, y: 0, color: userColor });
        
        // Update room activity
        await Room.findOneAndUpdate(
          { roomId },
          { lastActivity: new Date() },
          { upsert: true }
        );
        
        // Broadcast user count
        io.to(roomId).emit('user-count', activeUsers.get(roomId).size);
        
        socket.emit('joined-room', { roomId, userColor });
      } catch (error) {
        socket.emit('error', error.message);
      }
    });

    socket.on('cursor-move', (data) => {
      const userCursor = userCursors.get(socket.id);
      if (userCursor) {
        userCursor.x = data.x;
        userCursor.y = data.y;
        
        socket.to(userCursor.roomId).emit('cursor-update', {
          userId: socket.id,
          x: data.x,
          y: data.y,
          color: userCursor.color
        });
      }
    });

    socket.on('draw-start', async (data) => {
      const userCursor = userCursors.get(socket.id);
      if (userCursor) {
        socket.to(userCursor.roomId).emit('draw-start', data);
        
        // Save to database
        await Room.findOneAndUpdate(
          { roomId: userCursor.roomId },
          { 
            $push: { 
              drawingData: {
                type: 'stroke',
                data: { ...data, type: 'start' },
                timestamp: new Date()
              }
            },
            lastActivity: new Date()
          }
        );
      }
    });

    socket.on('draw-move', async (data) => {
      const userCursor = userCursors.get(socket.id);
      if (userCursor) {
        socket.to(userCursor.roomId).emit('draw-move', data);
        
        // Save to database
        await Room.findOneAndUpdate(
          { roomId: userCursor.roomId },
          { 
            $push: { 
              drawingData: {
                type: 'stroke',
                data: { ...data, type: 'move' },
                timestamp: new Date()
              }
            },
            lastActivity: new Date()
          }
        );
      }
    });

    socket.on('draw-end', async (data) => {
      const userCursor = userCursors.get(socket.id);
      if (userCursor) {
        socket.to(userCursor.roomId).emit('draw-end', data);
        
        // Save to database
        await Room.findOneAndUpdate(
          { roomId: userCursor.roomId },
          { 
            $push: { 
              drawingData: {
                type: 'stroke',
                data: { ...data, type: 'end' },
                timestamp: new Date()
              }
            },
            lastActivity: new Date()
          }
        );
      }
    });

    socket.on('clear-canvas', async () => {
      const userCursor = userCursors.get(socket.id);
      if (userCursor) {
        socket.to(userCursor.roomId).emit('clear-canvas');
        
        // Clear database and add clear command
        await Room.findOneAndUpdate(
          { roomId: userCursor.roomId },
          { 
            drawingData: [{
              type: 'clear',
              data: {},
              timestamp: new Date()
            }],
            lastActivity: new Date()
          }
        );
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      const userCursor = userCursors.get(socket.id);
      if (userCursor) {
        const roomId = userCursor.roomId;
        
        // Remove user from active users
        if (activeUsers.has(roomId)) {
          activeUsers.get(roomId).delete(socket.id);
          
          // Broadcast updated user count
          io.to(roomId).emit('user-count', activeUsers.get(roomId).size);
          
          // Remove cursor
          io.to(roomId).emit('cursor-remove', socket.id);
          
          // Clean up empty rooms
          if (activeUsers.get(roomId).size === 0) {
            activeUsers.delete(roomId);
          }
        }
        
        userCursors.delete(socket.id);
      }
    });
  });
}

module.exports = socketHandler;