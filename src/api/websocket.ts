import { io } from "socket.io-client";
import { eventbus } from "@api";
import {
  Board,
  BoardChangeInfo,
  inviteResponse,
  LifeCycle,
  PieceState,
  Player,
  PlayingLifeCycle,
} from "@types";

// TODO 这里很多 on 可改成 once

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
    this.socket.once("invite_ask", () => {
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
    this.socket.once("start", (resp: inviteResponse) => {
      if (resp.isAccepted) {
        changeLifeCycle(LifeCycle.Playing);
        // 接受了 开始游戏
        // 分配黑白
        eventbus.emit("update:my_color", resp.colorAssigned);
        if (resp.colorAssigned === PieceState.Black) {
          // 黑色 我可以下棋
          this.onCanTakeAction();
        } else {
          // 白色 等待对面下棋
          this.onWaitingOpponent();
        }
      } else {
        // 拒绝了
        changeLifeCycle(LifeCycle.Registered);
      }
    });
  }
  /**
   * 我方落子
   */
  action(i: number, j: number) {
    this.socket.emit("action", {
      i,
      j,
    });
    changePlayingLifeCycle(PlayingLifeCycle.WaitingResp);
    // 设定一个状态不准落子了
    eventbus.emit("update:is_my_turn", false);
    // 落子完成 听局面变化
    this.onBoardChange();
  }
  /**
   * 轮到我方落子
   */
  private onCanTakeAction() {
    changePlayingLifeCycle(PlayingLifeCycle.Thinking);
    this.socket.once("can_take_action", () => {
      // 设定一个状态可以落子
      eventbus.emit("update:is_my_turn", true);
    });
  }
  /**
   * 等待对方落子
   */
  private onWaitingOpponent() {
    changePlayingLifeCycle(PlayingLifeCycle.WaitingOpponent);
    this.onBoardChange();
  }
  /**
   * 监听局面变化
   */
  private onBoardChange() {
    this.socket.once(
      "board_change",
      ({ board, isCauseByMe }: BoardChangeInfo) => {
        // 更新局面
        eventbus.emit("update:board", { board });
        if (isCauseByMe) {
          // 我落子导致的
          changePlayingLifeCycle(PlayingLifeCycle.WaitingOpponent);
          this.onBoardChange(); // 继续监听局面变化
        } else {
          // 对方落子导致的
          changePlayingLifeCycle(PlayingLifeCycle.Thinking);
        }
      }
    );
  }
}
export const ws = new WS();

/**
 * 修改生命周期
 */
function changeLifeCycle(lifeCycle: LifeCycle) {
  eventbus.emit("update:life_cycle", lifeCycle);
}

/**
 * 修改对局的生命周期
 */
function changePlayingLifeCycle(playingLifeCycle: PlayingLifeCycle) {
  eventbus.emit("update:playing_life_cycle", playingLifeCycle);
}
