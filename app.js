const http = require('http');
const express = require('express');
const socketIo = require('socket.io');
const path = require('path');
const mqtt = require('mqtt');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(express.static(path.join(__dirname, 'public')));

// mqtt clients
const mqttClients = {};

app.get('/', (req, res) => {
    res.render('main');
});

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
        if (socket.mqttClient) {
            console.log('Closing connection to MQTT broker...');
            socket.mqttClient.end();
            delete mqttClients[socket.id];
        }
    });

    socket.on('connect_to_broker', (data) => {
        const { topic, ipAddress } = data;
        
        if (socket.mqttClient) {
            console.log('Closing previous connection to MQTT broker...');
            socket.mqttClient.end();
        }

        const client = mqtt.connect(`mqtt://${ipAddress}`);

        socket.mqttClient = client;

        client.on('connect', () => {
            client.subscribe(topic, (err) => {
                if (err) {
                    console.error('Error subscription:', err);
                }
                console.log('Subscribed topic: :', topic);
            });
        });

        client.on('message', (mqttTopic, message) => {
            console.log('Received message from MQTT broker: ', message.toString());
            const parsedMessage = JSON.parse(message.toString());
            socket.emit('message', parsedMessage);
        });

        mqttClients[socket.id] = client;
    });
});

server.listen(8080, () => {
    console.log('Server is listening on port 8080');
});
