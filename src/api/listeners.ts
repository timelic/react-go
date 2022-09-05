import {
  LifeCycle,
  PlayingLifeCycle,
  Player,
  Listener,
  inviteResponse,
  PieceState,
  BoardChangeInfo,
} from "@types";
import { startToast } from "@utils";
import { changeLifeCycle, changePlayingLifeCycle, eventbus } from ".";

/**
 * 同步在线玩家
 */
const onOnlinePlayer: Listener = {
  event: "online_players",
  cb: (onlinePlayers: Player[]) => {
    eventbus.emit("update:online_players", onlinePlayers); // 把信息存到 store
  },
  aliveCycles: "all",
};

/**
 * 准备接受邀请
 */
const onInvite: Listener = {
  event: "invite_ask",
  cb: ({ name }: Player) => {
    // 思考要不要接受
    changeLifeCycle(LifeCycle.Considering);
    eventbus.emit("show_model", name); // 显示一个是否接受的模态框
  },
  aliveCycles: [LifeCycle.Online],
};

/**
 * 等待游戏开始 或者回到最初
 */
const onStart: Listener = {
  event: "start",
  cb: (resp: inviteResponse) => {
    eventbus.emit("invite_result", resp.isAccepted);
    if (resp.isAccepted) {
      changeLifeCycle(LifeCycle.Playing);
      // 接受了 开始游戏
      // 分配黑白
      eventbus.emit("update:my_color", resp.colorAssigned);
      console.log(resp.colorAssigned);
      if (resp.colorAssigned === PieceState.Black) {
        // 黑色 我可以下棋
        changePlayingLifeCycle(PlayingLifeCycle.Thinking);
      } else {
        // 白色 等待对面下棋
        changePlayingLifeCycle(PlayingLifeCycle.WaitingOpponent);
      }
      startToast(resp.colorAssigned!);
    } else {
      // 拒绝了
      changeLifeCycle(LifeCycle.Online);
    }
  },
  aliveCycles: [LifeCycle.Inviting, LifeCycle.WaitingToStart],
};

/**
 * 监听局面变化
 */
const onBoardChange: Listener = {
  event: "sync",
  cb: ({ board, isCauseByMe, countdown, lastAction }: BoardChangeInfo) => {
    // 更新局面
    eventbus.emit("update:board", board);
    eventbus.emit("update:last_action", lastAction);
    if (isCauseByMe) {
      // 我落子导致的
      changePlayingLifeCycle(PlayingLifeCycle.WaitingOpponent);
    } else {
      // 对方落子导致的
      changePlayingLifeCycle(PlayingLifeCycle.Thinking);
    }
    eventbus.emit("sync_countdown", countdown);
  },
  aliveCycles: [PlayingLifeCycle.WaitingResp, PlayingLifeCycle.WaitingOpponent],
};

export const listeners: Listener[] = [
  onOnlinePlayer,
  onInvite,
  onStart,
  onBoardChange,
];
