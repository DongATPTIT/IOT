const express = require('express');
const app = express();
const cors = require('cors');
const mysql2 = require('mysql2/promise');
const mqtt = require('mqtt');
const WebSocket = require('ws');
const user = require('./src/controller/user.controller');
const sendMail = require('./src/controller/send-mail.controller')

const mqttClient = mqtt.connect('mqtt://localhost:1883');
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server: server });
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/api',user());
app.use('/api',sendMail());




wss.on('connection', (ws) => {
    console.log('Client Connected')
    ws.on('message', (message) => {
        const json = (message.toString()).split('|');
        db.query(`INSERT INTO action (device_id,status,time) VALUES('${json[0]}','${json[1]}','${timeNow()}')`, (err) => { });
        mqttClient.publish('button', json[0] + "|" + json[1]);
    });
    ws.on('close', () => console.log('Client Disconnected'));
});

mqttClient.on('message', (topic, message) => {
    const json = (message.toString()).split('|');
    if (topic === "sensor") {
        console.log(json);
        db.query(`INSERT INTO sensortest (device_id, humidity, temperature, nh3,co, time) VALUES ('${json[0]}', ${json[1]}, ${json[2]}, ${json[3]},${json[4]},'${timeNow()}')`, (err) => {
            if (err != null)
                console.log(err);
        });
    }
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message.toString());
        }
    });
});

app.get('/sensor', (req, res) => db.query("SELECT * FROM sensortest", (err, data) => (err) ? console.error(err) : res.send(JSON.stringify(data))));
app.get('/action', (req, res) => db.query("SELECT * FROM action", (err, data) => (err) ? console.error(err) : res.send(JSON.stringify(data))));




mqttClient.on('connect', () => {
    mqttClient.subscribe('sensor');
    mqttClient.subscribe('action');
});

server.listen(3003, () => { });

function timeNow() {
    const dateTime = new Date();
    time = dateTime.toTimeString().split(' ')[0];
    [month, day, year] = dateTime.toLocaleDateString().split('/');
    return year + '-' + month + '-' + day + ' ' + time;
}

