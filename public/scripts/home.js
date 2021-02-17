const socket = io();
socket.on("connect", () => {
     window.alert("Connect to socket");
});
