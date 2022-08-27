class WS {
  socket: WebSocket;
  constructor() {
    this.socket = new WebSocket("ws://localhost:8080/ws");
    this.socket.onmessage = function (event) {
      console.log(event.data);
    };
    this.socket.onopen = function (event) {
      console.log("open");
    };
    this.socket.onclose = function (event) {
      console.log("close");
    };
  }
  send(message: string) {
    if (this.socket.readyState == WebSocket.OPEN) {
      this.socket.send(message);
    } else {
      alert("连接没有开启.");
    }
  }
}

export const ws = new WS();
