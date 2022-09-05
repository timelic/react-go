import { io, Socket } from "socket.io-client";
import { eventbus } from "@api";
import { LifeCycle, Player, PlayingLifeCycle } from "@types";
import { changeLifeCycle, changePlayingLifeCycle } from ".";

const name = document.domain; // FIXME 为了便于观察而将名字设置为域名

export class WS {
  public socket: Socket = null as any;
  private PORT = 3000;
  private hasInited = false;
  /**
   * 连接服务器
   * 在服务器注册一个玩家
   */
  constructor() {
    const tryConnect = () => {
      this.socket = io(`ws://localhost:${this.PORT}`);
      this.socket.emit("register", { name });
      this.init();
    };
    // 每隔 3s 检查一下有没有连线上
    setInterval(() => {
      if (!this.socket?.connected) {
        tryConnect();
      } else {
        this.hasInited = false;
      }
    }, 3000);
  }
  /**
   * init 写成 constructor 会有 bug
   */
  init() {
    if (this.hasInited) return;
    this.hasInited = true;
    changeLifeCycle(LifeCycle.Online);
    // 等待游戏开始吧 or 对方进行一个拒绝
  }
  /**
   * 邀约：A 邀请 B玩游戏
   */
  invite(opponentId: Player["id"]) {
    this.socket.emit("invite", opponentId);
    changeLifeCycle(LifeCycle.Inviting); // 生命周期 -> inviting
  }
  /**
   * 接受 or 拒绝
   */
  sendInviteResult(isAccepted: boolean) {
    this.socket.emit("invite_result", isAccepted);
    changeLifeCycle(LifeCycle.WaitingToStart);
  }
  /**
   * 我方落子
   */
  action(i: number, j: number) {
    console.log("ws.action", i, j);
    this.socket.emit("action", i, j);
    changePlayingLifeCycle(PlayingLifeCycle.WaitingResp);
  }
}

export const ws = new WS();
