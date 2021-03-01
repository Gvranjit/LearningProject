const socket = io();
const messagebox = document.getElementById("messagebox");

const inputBox = document.getElementById("chatInputBox");

//Input listnen
chatInput.addEventListener("submit", () => {
     console.log("you entered");
     messagebox.innerHTML += ` <div class="card message">
     <div class="card-header ">
     <div class="blue"> ${username}
     </div> : ${inputBox.value}
     </div>
    
  </div>`;
     messagebox.scrollTop = messagebox.scrollHeight;
     socket.emit("message", { sender: username, content: inputBox.value });
     inputBox.value = null;
});
//Socket listners

socket.on("connect", () => {
     console.log("Connect to socket");

     messagebox.scrollTop = messagebox.scrollHeight;
});

socket.on("message", (message) => {
     messagebox.innerHTML += ` <div class="card message">
     <div class="card-header ">
     <div class="blue"> ${message.sender}
     </div> : ${message.content}
     </div>
    
  </div>`;
     messagebox.scrollTop = messagebox.scrollHeight;
});
