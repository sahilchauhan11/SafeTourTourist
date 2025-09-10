const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Frontend URL (adjust for production)
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/geofences', require('./routes/geofences'));
app.use('/api/alerts', require('./routes/alerts'));
app.use('/api/incident', require('./routes/incidents'));

// Socket.io for Real-Time Events
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('locationUpdate', (data) => {
    const { userId, location, timestamp } = data;
    console.log(`Location update from ${userId}:`, location, timestamp);

    // Geofencing check using Turf.js
    const turf = require('@turf/turf');
    const restrictedZone = turf.polygon([[
      [78.0, 20.0], [78.0, 21.0], [79.0, 21.0], [79.0, 20.0], [78.0, 20.0]
    ]]); // Example restricted polygon (e.g., NE India area)
    const userPoint = turf.point([location.lng, location.lat]);

    if (turf.booleanPointInPolygon(userPoint, restrictedZone)) {
      io.emit('geofenceBreach', {
        userId,
        message: 'restrictedZone',
        timestamp,
      });
    }

    // Optionally save location to DB for history
  });

  socket.on('locationError', (data) => {
    console.log(`Location error from ${data.userId}:`, data.message);
  });

  socket.on('sos', (data) => {
    const { userId, location, message } = data;
    // Save SOS to DB (via alerts route)
    io.emit('alert', {
      message: 'sosReceived',
      timestamp: new Date().toISOString(),
      location,
      userId,
    });
  });

  socket.on('viewAlert', (data) => {
    // Handle map centering (emit to specific client if needed)
    socket.emit('centerMap', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.set('io', io); // Make io available in routes if needed

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});