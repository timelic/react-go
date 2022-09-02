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

const name = document.domain;

export class WS {
  private socket: ReturnType<typeof io> = null as any;
  private PORT = 3000;
  private hasInited = false;
  /**
   * 连接服务器
   * 在服务器注册一个玩家
   */
  constructor() {
    this.socket = io(`ws://localhost:${this.PORT}`);
    this.socket.emit("register", { name });
    this.onOnlinePlayer();
  }
  /**
   * init 写成 constructor 会有 bug
   */
  init() {
    if (this.hasInited) return;
    this.hasInited = true;
    this.changeLifeCycle(LifeCycle.Online);
  }
  /**
   * 接受所有在线玩家
   */
  private onOnlinePlayer() {
    this.socket.on(
      "online_players",
      ({ onlinePlayers }: { onlinePlayers: Player[] }) => {
        console.log({ onlinePlayers });
        eventbus.emit("update:online_players", onlinePlayers); // 把信息存到 store
        this.onInvite(); // 准备好接受邀请
        this.onInviteResult();
      }
    );
  }
  /**
   * 邀约：A 邀请 B玩游戏
   */
  invite(opponentId: Player["id"]) {
    this.socket.emit("invite", opponentId);
    this.changeLifeCycle(LifeCycle.Inviting); // 生命周期 -> inviting
    // 等待游戏开始吧 or 对方进行一个拒绝
    this.onStart();
  }
  /**
   * 准备接受邀请
   */
  private onInvite() {
    this.socket.once("invite_ask", ({ name }: Player) => {
      // 思考要不要接受
      this.changeLifeCycle(LifeCycle.Considering);
      eventbus.emit("show_model", name); // 显示一个是否接受的模态框
    });
  }
  /**
   * 接受 or 拒绝
   */
  sendInviteResult(isAccepted: boolean) {
    this.socket.emit("invite_result", isAccepted);
    this.changeLifeCycle(LifeCycle.WaitingToStart);
  }
  /**
   * 被接受 or 被拒绝
   */
  private onInviteResult() {
    this.socket.on("invite_result", (result: boolean) => {
      console.log(`this.socket.on("invite_result"`);
      eventbus.emit("invite_result", result);
      if (result) {
        this.changeLifeCycle(LifeCycle.Playing);
      } else {
        this.changeLifeCycle(LifeCycle.Online);
      }
    });
  }
  /**
   * 服务器宣布开始游戏
   */
  private onStart() {
    this.socket.once("start", (resp: inviteResponse) => {
      if (resp.isAccepted) {
        this.changeLifeCycle(LifeCycle.Playing);
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
        this.changeLifeCycle(LifeCycle.Online);
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
    this.changePlayingLifeCycle(PlayingLifeCycle.WaitingResp);
    // 设定一个状态不准落子了
    eventbus.emit("update:is_my_turn", false);
    // 落子完成 听局面变化
    this.onBoardChange();
  }
  /**
   * 轮到我方落子
   */
  private onCanTakeAction() {
    this.changePlayingLifeCycle(PlayingLifeCycle.Thinking);
    this.socket.once("can_take_action", () => {
      // 设定一个状态可以落子
      eventbus.emit("update:is_my_turn", true);
    });
  }
  /**
   * 等待对方落子
   */
  private onWaitingOpponent() {
    this.changePlayingLifeCycle(PlayingLifeCycle.WaitingOpponent);
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
          this.changePlayingLifeCycle(PlayingLifeCycle.WaitingOpponent);
          this.onBoardChange(); // 继续监听局面变化
        } else {
          // 对方落子导致的
          this.changePlayingLifeCycle(PlayingLifeCycle.Thinking);
        }
      }
    );
  }
  /**
   * 修改生命周期
   */
  private changeLifeCycle(lifeCycle: LifeCycle) {
    eventbus.emit("update:life_cycle", lifeCycle);
  }

  /**
   * 修改对局的生命周期
   */
  private changePlayingLifeCycle(playingLifeCycle: PlayingLifeCycle) {
    eventbus.emit("update:playing_life_cycle", playingLifeCycle);
  }
}

export const ws = new WS();
