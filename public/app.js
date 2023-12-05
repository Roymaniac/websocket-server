const socket = io('http://localhost:3000');

socket.on('connect', () => {
    const verify = document.getElementById('verify');
    verify.innerHTML = 'Socket Connected';
    console.log('connected');
});

socket.on('heartbeat', (message) => {
    const el = document.createElement('p');
    el.innerHTML = message;
    document.body.appendChild(el);
    console.log(message)

});

socket.on('disconnect', () => {
    const verify = document.getElementById('verify');
    verify.innerHTML = 'Socket Disconnected';
    console.log('disconnected');
});

socket.on('error', (err) => {
    const error = document.createElement('p');
    error.innerHTML = err;
    console.log(err);
});