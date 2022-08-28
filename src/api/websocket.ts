import { io } from "socket.io-client";
import { eventbus } from "@api";
import {
  Board,
  inviteResponse,
  LifeCycle,
  PieceState,
  Player,
  PlayingLifeCycle,
} from "@types";

class WS {
  private socket: ReturnType<typeof io> = null as any;
  private PORT = 3000;
  /**
   * 连接服务器
   * 在服务器注册一个玩家
   */
  register() {
    this.socket = io(`ws:o//localhost:${this.PORT}`);
    this.socket.emit("register");
    this.onOnlinePlayer();
  }
  /**
   * 接受所有在线玩家
   */
  private onOnlinePlayer() {
    this.socket.on(
      "online_players",
      ({ onlinePlayers }: { onlinePlayers: Player[] }) => {
        eventbus.emit("update:online_players", onlinePlayers); // 把信息存到 store
        this.onInvite(); // 准备好接受邀请
        changeLifeCycle(LifeCycle.Registered); // 生命周期 -> registered
      }
    );
  }
  /**
   * 邀约：A 邀请 B玩游戏
   */
  invite(opponentId: Player["id"]) {
    this.socket.emit("invite", {
      opponentId,
    });
    changeLifeCycle(LifeCycle.Inviting); // 生命周期 -> inviting
    // 等待游戏开始吧 or 对方进行一个拒绝
    this.onStart();
  }
  /**
   * 准备接受邀请
   */
  private onInvite() {
    this.socket.on("invite_ask", () => {
      // 思考要不要接受
      changeLifeCycle(LifeCycle.Considering);
    });
  }
  /**
   * 接受 or 拒绝
   */
  sendInviteResult(isAccepted: boolean) {
    this.socket.emit("invite_result", isAccepted);
    changeLifeCycle(LifeCycle.WaitingToStart);
  }
  /**
   * 服务器宣布开始游戏
   */
  private onStart() {
    this.socket.on("start", (resp: inviteResponse) => {
      if (resp.isAccepted) {
        changeLifeCycle(LifeCycle.Playing);
        // 接受了 开始游戏
        // 分配黑白
        eventbus.emit("update:my_color", resp.colorAssigned);
        // 黑色 我可以下棋
        resp.colorAssigned === PieceState.Black && this.onCanTakeAction();
      } else {
        // 拒绝了
        changeLifeCycle(LifeCycle.Registered);
      }
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

/**
 * 修改生命周期
 */
function changeLifeCycle(lifeCycle: LifeCycle) {
  eventbus.emit("update:life_cycle", lifeCycle); // 生命周期 -> registered
}

/**
 * 修改对局的生命周期
 */
function changePlayingLifeCycle(playingLifeCycle: PlayingLifeCycle) {
  eventbus.emit("update:playing_life_cycle", playingLifeCycle); // 生命周期 -> registered
}
