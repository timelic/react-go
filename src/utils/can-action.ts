import { Toast } from "@douyinfe/semi-ui";
import { LifeCycle, PlayingLifeCycle } from "@types";

export function canAction(
  lifeCycle: LifeCycle,
  playingLifeCycle: PlayingLifeCycle,
  click?: boolean
) {
  const res =
    lifeCycle === LifeCycle.Playing &&
    playingLifeCycle === PlayingLifeCycle.Thinking;
  if (click) {
    if (!res) {
      if (lifeCycle !== LifeCycle.Playing) {
        Toast.error("Game hasn't started.");
      } else {
        Toast.error("It's your opponent's turn.");
      }
    }
  }
  return res;
}
