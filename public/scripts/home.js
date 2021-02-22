const socket = io();
socket.on("connect", () => {
     console.log("Connect to socket");
});
