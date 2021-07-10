const users = [];
const addUser = function({id, user_name, room_id}) {
    user_name = user_name.trim().toLowerCase();
    room_id = room_id.trim().toLowerCase();
    if(!user_name || !room_id){
        return {
            error: 'Incomplete user information ',
        }
    }
    const existingUser = users.find(user => user.room_id===room_id && user.user_name===user_name);
    if(existingUser){
        return {
            error: 'Name user already exists',
        }
    }
    const user = {
        id,
        user_name,
        room_id
    }
    users.push(user);
    return user;
}
const removeUser = function(id){
    var index = users.findIndex(user => user.id===id);
    if(index !== -1){
        return users.splice(index, 1)[0];
    }
    return {
        error: 'User already exists'
    }
}

const getUser = function (id) {
    var user = users.find(user => user.id===id);
    if(!user){
        return {
            message: 'User not found',
        };
    }
    return user;
}

const getUsersInRoom = function (room_id) {
    var listUsers = users.filter(user => user.room_id===room_id);
    if(!listUsers) {
        return [];
    }
    return listUsers;
}

module.exports = {
    addUser,
    removeUser,
    getUsersInRoom,
    getUser,
}