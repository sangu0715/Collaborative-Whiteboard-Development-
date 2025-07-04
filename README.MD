# Collaborative Whiteboard Application

A real-time collaborative whiteboard built with the MERN stack and Socket.io, enabling multiple users to draw and interact on a shared canvas.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
   - [Socket Events](#socket-events)
   - [REST Endpoints](#rest-endpoints)
- [Deployment Guide](#deployment-guide)

## Features

- Real-time collaborative drawing
- Room-based system with unique room codes
- Live cursor tracking for all participants
- Adjustable stroke width and color selection
- Canvas clearing functionality
- User presence indicators (join/leave notifications)
- Responsive design for desktop and mobile devices

## Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **Styling**: CSS3

## Architecture Overview

The application follows a client-server architecture:

- **Frontend (React.js)**: Handles the user interface, drawing logic, and communicates with the backend via REST APIs and Socket.io for real-time updates.
- **Backend (Node.js/Express.js)**: Manages REST endpoints, user sessions, room management, and relays real-time events via Socket.io.
- **Database (MongoDB)**: Stores user data, room information, and optionally, drawing history.
- **Socket.io**: Enables low-latency, bidirectional communication for real-time drawing and presence updates.

**High-Level Flow:**

1. Users join a room via a unique code.
2. The frontend establishes a Socket.io connection to the backend.
3. Drawing actions and cursor movements are broadcast to all users in the room.
4. REST APIs handle room creation, user management, and optional persistence.

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- npm (v6+)
- MongoDB (local or cloud instance)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/collaborative-whiteboard.git
    cd collaborative-whiteboard
    ```

2. **Install dependencies for all parts:**
    ```bash
    npm run install-all
    ```

3. **Configure environment variables:**
    - Copy `.env.example` to `.env` in both `/client` and `/server` directories.
    - Set the required variables (e.g., `MONGODB_URI`, `PORT`).

4. **Start the application:**
    ```bash
    npm run dev
    ```
    - This will concurrently start both the frontend and backend servers.

5. **Access the app:**
    - Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Documentation

### Socket Events

#### Client to Server

- `joinRoom`: Join a specific room.
   - Payload: `{ roomId, username }`
- `draw`: Send drawing data.
   - Payload: `{ roomId, stroke }`
- `cursorMove`: Update cursor position.
   - Payload: `{ roomId, x, y }`
- `clearCanvas`: Request to clear the canvas.
   - Payload: `{ roomId }`

#### Server to Client

- `userJoined`: Notifies when a user joins.
   - Payload: `{ username }`
- `userLeft`: Notifies when a user leaves.
   - Payload: `{ username }`
- `draw`: Broadcast drawing data.
   - Payload: `{ stroke }`
- `cursorMove`: Broadcast cursor position.
   - Payload: `{ username, x, y }`
- `clearCanvas`: Instructs clients to clear the canvas.

### REST Endpoints

- `POST /api/rooms`
   - Create a new room.
   - Body: `{ username }`
   - Response: `{ roomId }`

- `GET /api/rooms/:roomId`
   - Get room details.
   - Response: `{ roomId, users }`

- `POST /api/rooms/:roomId/join`
   - Join an existing room.
   - Body: `{ username }`
   - Response: `{ success, users }`

## Deployment Guide

### Preparing for Production

1. **Build the frontend:**
    ```bash
    cd client
    npm run build
    ```

2. **Set environment variables for production:**
    - Ensure `MONGODB_URI` points to a production database.
    - Set `NODE_ENV=production`.

3. **Serve the frontend with the backend:**
    - The Express server can serve static files from the `client/build` directory.

4. **Start the backend server:**
    ```bash
    cd ../server
    npm install
    npm start
    ```

5. **Deploy to a hosting provider:**
    - Use services like Heroku, Render, or DigitalOcean for backend.
    - MongoDB Atlas or similar for database.
    - Set up environment variables in your hosting dashboard.

6. **Configure domains and SSL (optional):**
    - Use a reverse proxy (e.g., Nginx) for SSL termination and routing.

---

For further questions or contributions, please open an issue or pull request on the repository.