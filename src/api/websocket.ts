import { io } from "socket.io-client";

class WS {
  socket: ReturnType<typeof io> = null as any;
  init() {
    this.socket = io("ws://localhost:3000");
    this.socket.on("s2c", function (data) {
      console.log(data);
    });
  }
  send(data: any) {
    this.socket.emit("go", data);
  }
}

export const ws = new WS();
