import { io } from "socket.io-client";

const socketAPI = io("http://localhost:5000", {
  withCredentials: true,
});

export default socketAPI;