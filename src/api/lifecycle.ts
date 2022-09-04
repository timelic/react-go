import { listeners } from "./listeners";
import { LifeCycle, PlayingLifeCycle } from "@types";
import { Socket } from "socket.io-client";
import { eventbus, ws } from ".";
/**
 * 修改生命周期
 */
export function changeLifeCycle(lifeCycle: LifeCycle) {
  eventbus.emit("update:life_cycle", lifeCycle);
  bindLifeCycleWithListeners(ws.socket, lifeCycle);
}

/**
 * 修改对局的生命周期
 */
export function changePlayingLifeCycle(playingLifeCycle: PlayingLifeCycle) {
  eventbus.emit("update:playing_life_cycle", playingLifeCycle);
  bindLifeCycleWithListeners(ws.socket, playingLifeCycle);
}

/**
 * 将生命周期和事件监听绑定
 */
export function bindLifeCycleWithListeners(
  socket: Socket | null,
  lifeCycle: LifeCycle | PlayingLifeCycle
) {
  socket?.off(); // 全部关掉
  listeners.forEach((l) => {
    if (l.aliveCycles === "all" || l.aliveCycles.includes(lifeCycle)) {
      socket?.on(l.event, l.cb); // 按需打开
    }
  });
}
