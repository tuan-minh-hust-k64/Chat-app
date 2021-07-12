const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');
const {generateMessage, generateMessageLink} = require('./utils/message');
const {addUser, removeUser, getUser, getUsersInRoom} = require('./utils/user');
const { send } = require('process');
const app = express();
const port =process.env.PORT||3000;
const server = http.createServer(app);

const io=socketio(server);
let data = 'Wealcome to Chat-app';

io.on('connection', (socket) => {

    socket.on('join', ({user_name, room_id, faceID},callback) => {
        var user = addUser({id:socket.id, user_name, room_id});
        if(user.error){
            return callback(user.error);
        }

        socket.join(room_id);
        socket.emit('message-auto', generateMessage(data, 'Chat-app'));
        socket.to(room_id).emit('message-auto', generateMessage(`${user_name} has joined`, 'Chat-app'));
        callback();
        io.in(room_id).emit('roomData', {room_id, users: getUsersInRoom(room_id)});
    })
    
    socket.on('sendMessage', (message, faceID, callback) => {
        var user = getUser(socket.id);

        const filterMessage = new Filter();
        let newMessage = filterMessage.clean(message);
        io.in(user.room_id).emit('message', generateMessage(newMessage, user.user_name), socket.id, faceID);
        callback(); 
    })
    socket.on('disconnect', () => {
        var user = removeUser(socket.id);
        io.in(user.room_id).emit('message-auto', generateMessage(`${user.user_name} has out`, 'Chat-app'));
        io.in(user.room_id).emit('roomData', {room_id: user.room_id, users: getUsersInRoom(user.room_id)});
    })
    socket.on('sendLocation', (latitude, longitude, callback) => {
        var user = getUser(socket.id);
        let location = `http://google.com/maps?q=${latitude},${longitude}`
        io.in(user.room_id).emit('locationMessage',generateMessageLink(location, user.user_name), socket.id);
        callback();
    })
})

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.static(publicDirectoryPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/', function(req, res) {
    res.render('index');
})




server.listen(port, function () {
    console.log('Listen on port: ' + port);
});