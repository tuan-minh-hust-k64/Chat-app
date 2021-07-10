const socket = io();
const chatSideBar = document.querySelector('.chat__sidebar');
const btnLocation = document.querySelector('#btnLocation');
const formdata = document.querySelector('#chat');
const sendMessage = document.querySelector('#sendMessage');
const msg = document.querySelector('input[name="contentChat"]');
const templatesMessage = document.querySelector('#templatesMessage').innerHTML;
const templatesMessageLink = document.querySelector('#templatesMessage-Link').innerHTML;
const templateSideBar = document.querySelector('#sidebar-template').innerHTML;
const windowChat = document.querySelector('.window-chat');
const {user_name, room_id} = Qs.parse(location.search,{ ignoreQueryPrefix: true });

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
        socket.emit('sendMessage', msg.value, (err) => {
            if(err){
               return console.log(err);
            }
            console.log('send message successfully!');
            sendMessage.removeAttribute('disabled');
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
socket.on('message', (message) => {
    let rendered = Mustache.render(templatesMessage, { data: message.text, time: moment(message.createdAt).format('H:mm a'), user_name: message.user_name });
    windowChat.insertAdjacentHTML('beforeend', rendered);
    autoScroll();
})
socket.on('locationMessage', (message) => {
    let rendered = Mustache.render(templatesMessageLink, { data: message.text, time: moment(message.createdAt).format('H:mm a'), user_name: message.user_name  });
    windowChat.insertAdjacentHTML('beforeend', rendered);
    autoScroll();
})
socket.emit('join', {user_name, room_id},(error) => {
    if(error){
        alert(error);
        location.href = '/';
    }
});
socket.on('roomData', ({room_id, users}) => {
    let rendered = Mustache.render(templateSideBar, {room_id, users});
    chatSideBar.innerHTML = rendered;
})
