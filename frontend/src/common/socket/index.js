import { io } from "socket.io-client";
import { SocketServerURL } from '../constants/default-values';
import { getAccessToken }  from '../utils/auth';

console.log("process.env.NODE_ENV", process.env.NODE_ENV);
console.log("SocketServerURL", SocketServerURL);

if(!process.env.NODE_ENV) {
  localStorage.debug = '*';
}

const socket = io(SocketServerURL, {
  auth: {
    authToken: getAccessToken()
  }
});

// socket.io.open(error => {
//   if (error) {
//     console.log(error);
//   }
//   console.log("socket server connected");
// })

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err.message}`);
  console.log(`trying again`);
  socket.open();
});

export default socket;
