import { io } from "socket.io-client";
import { eventbus } from "@api";
import type { Board } from "@types";

class WS {
  private socket: ReturnType<typeof io> = null as any;
  private PORT = 3000;
  /**
   * 必须先手动 init
   */
  init() {
    this.socket = io(`ws:o//localhost:${this.PORT}`);
    this.socket.on("s2c", function (data) {
      console.log(data);
    });
  }
  /**
   * 在服务器注册一个玩家
   */
  register() {
    this.socket.emit("register");
    this.onOnlinePlayer();
  }
  /**
   * 接受所有在线玩家
   */
  private onOnlinePlayer() {
    this.socket.on(
      "online_players",
      ({ online_players }: { online_players: any }) => {
        // 把信息存到某个地方
        this.onAccept(); // 准备好接受邀请
      }
    );
  }
  /**
   * 邀约：A 邀请 B玩游戏
   */
  invite() {
    this.socket.emit("invite", {
      opponentId: "",
    });
    this.socket.on("invite_res", () => {});
    this.onStart();
  }
  /**
   * 准备接受邀请
   */
  private onAccept() {
    this.socket.on("invite_ask", () => {});
  }
  /**
   * 服务器宣布开始游戏
   */
  private onStart() {
    this.socket.on("start", () => {
      // 分配黑白
      this.onCanTakeAction();
    });
  }
  /**
   * 我方落子
   */
  action() {
    this.socket.emit("action", {} as { i: number; j: number });
    // 设定一个状态不准落子了
    // 落子完成 听局面变化
  }
  /**
   * 轮到我方落子
   */
  private onCanTakeAction() {
    this.socket.on("can_take_action", () => {
      // 设定一个状态可以落子
    });
  }
  /**
   * 监听局面变化
   */
  private onBoardChange() {
    this.socket.on("board_change", ({ board }: { board: Board }) => {
      // 更新局面
      eventbus.emit("update:board", { board });
    });
  }
}

export const ws = new WS();
