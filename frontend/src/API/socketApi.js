import { io } from "socket.io-client";

const socketAPI = io("http://localhost:5001", {
  withCredentials: true,
});

export default socketAPI;