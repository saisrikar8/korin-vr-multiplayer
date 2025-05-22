const express = require('express');
const app = express();
const path = require('path');
const http = require('http'); // <-- Required for custom server
const { Server } = require('socket.io');

const port = process.env.PORT || 3000;

const driversInRooms = {};

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO to HTTP server
const io = new Server(server);


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    console.log("Sending html");
    res.sendFile(path.join(__dirname, 'pages', 'index.html'), { headers: { 'Content-Type': 'text/html' } });
});



io.on('connection', (socket) => {
    // Your existing connection code...

    socket.on('joinDriving', (data) => {
        const { roomId, position } = data;

        // Initialize room in driversInRooms if not exists
        if (!driversInRooms[roomId]) {
            driversInRooms[roomId] = {};
        }

        // Add player to drivers list
        driversInRooms[roomId][socket.id] = {
            position: position,
            joinedAt: Date.now()
        };

        // Create initial car data
        const carData = {
            id: socket.id,
            position: position,
            heading: 0,
            steerAngle: 0,
            velocity: { x: 0, y: 0, z: 0 }
        };

        // Broadcast to other players in room
        socket.to(roomId).emit('playerJoinedDriving', {
            id: socket.id,
            carData: carData
        });

        console.log(`Player ${socket.id} joined driving in room ${roomId}`);
    });

    socket.on('leaveDriving', (data) => {
        const { roomId } = data;

        // Remove player from drivers
        if (driversInRooms[roomId] && driversInRooms[roomId][socket.id]) {
            delete driversInRooms[roomId][socket.id];
        }

        // Broadcast to other players
        socket.to(roomId).emit('playerLeftDriving', {
            id: socket.id
        });

        console.log(`Player ${socket.id} left driving in room ${roomId}`);
    });

    socket.on('carUpdate', (data) => {
        const { roomId, carData } = data;

        // Update driver data
        if (driversInRooms[roomId] && driversInRooms[roomId][socket.id]) {
            driversInRooms[roomId][socket.id].position = carData.position;
            driversInRooms[roomId][socket.id].lastUpdate = Date.now();
        }

        // Broadcast car update to other players in room
        socket.to(roomId).emit('carUpdated', {
            id: socket.id,
            carData: carData
        });
    });

    // Handle disconnection - modify your existing disconnect handler
    socket.on('disconnect', () => {
        // Your existing disconnect code...

        // Also remove from driving lists
        for (const roomId in driversInRooms) {
            if (driversInRooms[roomId][socket.id]) {
                delete driversInRooms[roomId][socket.id];

                // Broadcast to remaining players
                socket.to(roomId).emit('playerLeftDriving', {
                    id: socket.id
                });
            }
        }
    });
});

// You might want to add a cleanup task to remove inactive drivers
setInterval(() => {
    const now = Date.now();

    for (const roomId in driversInRooms) {
        for (const driverId in driversInRooms[roomId]) {
            // If driver hasn't updated in 10 seconds, remove them
            if (driversInRooms[roomId][driverId].lastUpdate &&
                now - driversInRooms[roomId][driverId].lastUpdate > 10000) {

                delete driversInRooms[roomId][driverId];

                // Broadcast to players
                io.to(roomId).emit('playerLeftDriving', {
                    id: driverId
                });

                console.log(`Removed inactive driver ${driverId} from room ${roomId}`);
            }
        }

        // Clean up empty rooms
        if (Object.keys(driversInRooms[roomId]).length === 0) {
            delete driversInRooms[roomId];
        }
    }
}, 10000);


server.listen(port, async () => {
    console.log(`App listening on http://localhost:${port}/`);
});