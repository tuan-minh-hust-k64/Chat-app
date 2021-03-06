const socket = io();
const chatSideBar = document.querySelector('.chat__sidebar');
const btnLocation = document.querySelector('#btnLocation');
const formdata = document.querySelector('#chat');
const sendMessage = document.querySelector('#sendMessage');
const msg = document.querySelector('input[name="contentChat"]');
const templatesMessage = document.querySelector('#templatesMessage').innerHTML;
const templatesMessageLink = document.querySelector('#templatesMessage-Link').innerHTML;
const templateSideBar = document.querySelector('#sidebar-template').innerHTML;
const templateAutoMessage = document.querySelector('#auto_message-template').innerHTML;
const templatesMessageSend = document.querySelector('#templatesMessageSend').innerHTML;
const templatesMessageLinkSend = document.querySelector('#templatesMessage-Link-Send').innerHTML;
const windowChat = document.querySelector('.window-chat');
const {user_name, room_id, faceID} = Qs.parse(location.search,{ ignoreQueryPrefix: true });

const autoScroll = () => {
    const windowchatHeight = windowChat.offsetHeight;// chieu cao khung nhin
    const lastChildMessage = windowChat.lastElementChild;// tin nhan cuoi cung
    const lastChildMessageStyle = getComputedStyle(lastChildMessage);
    const messageHeight = lastChildMessage.offsetHeight+parseInt(lastChildMessageStyle.marginBottom);//do cao cua tin nhan moi

    const scrollHeight = windowChat.scrollHeight;// chieu dai cua doan chat 
    const scrollTopHeight = windowChat.scrollTop;//chieu dai cua doan chat den khung nhin
    const viewHeight = scrollTopHeight+windowchatHeight;
    if(scrollHeight - messageHeight <=viewHeight){
        windowChat.scrollTop = windowChat.scrollHeight;
    }

}

formdata.addEventListener('submit',(e) => {
    e.preventDefault();
    
    if(msg.value){
        sendMessage.setAttribute('disabled', true);
        socket.emit('sendMessage', msg.value, faceID, (err) => {
            if(err){
               return console.log(err);
            }
            console.log('send message successfully!');
        })
        msg.value ='';
       
    }
})
btnLocation.addEventListener('click', (e) => {
    e.preventDefault();
    btnLocation.setAttribute('disabled', true);
    if(!navigator.geolocation){
        return alert('Your brower not suport!');
    }
    navigator.geolocation.getCurrentPosition((position) => {
         socket.emit('sendLocation', position.coords.latitude, position.coords.longitude,(err) => {
             if(err){
                 return console.error(err);
             }
             console.log('Share location successfully!');
             btnLocation.removeAttribute('disabled');
         });
    })
})
socket.on('message', (message, id_send, faceID) => {
    if(socket.id===id_send){
        let rendered = Mustache.render(templatesMessageSend, { data: message.text, time: moment(message.createdAt).format('H:mm a'), user_name: message.user_name });
        windowChat.insertAdjacentHTML('beforeend', rendered);
        autoScroll();
        sendMessage.removeAttribute('disabled');
    }else{
        var urlImg = "https://graph.facebook.com/"+faceID+"/picture?width=30&amp;height=30"
        let rendered = Mustache.render(templatesMessage, { data: message.text, time: moment(message.createdAt).format('H:mm a'), user_name: message.user_name, urlImg });
        windowChat.insertAdjacentHTML('beforeend', rendered);
        autoScroll();
        sendMessage.removeAttribute('disabled');
    }
   
})
socket.on('message-auto', (message) => {
    let rendered = Mustache.render(templateAutoMessage, { data: message.text, time: moment(message.createdAt).format('H:mm a'), user_name: message.user_name });
    windowChat.insertAdjacentHTML('beforeend', rendered);
})
socket.on('locationMessage', (message, id_send) => {
    if(socket.id===id_send){
        let rendered = Mustache.render(templatesMessageLinkSend, { data: message.text, time: moment(message.createdAt).format('H:mm a'), user_name: message.user_name });
        windowChat.insertAdjacentHTML('beforeend', rendered);
        autoScroll();
    }else{
        var urlImg = "https://graph.facebook.com/"+faceID+"/picture?width=30&amp;height=30"
        let rendered = Mustache.render(templatesMessageLink, { data: message.text, time: moment(message.createdAt).format('H:mm a'), user_name: message.user_name,urlImg });
        windowChat.insertAdjacentHTML('beforeend', rendered);
        autoScroll();
    }
})
socket.emit('join', {user_name, room_id, faceID},(error) => {
    if(error){
        alert(error);
        location.href = '/';
    }
});
socket.on('roomData', ({room_id, users}) => {
    let rendered = Mustache.render(templateSideBar, {room_id, users});
    chatSideBar.innerHTML = rendered;
})
