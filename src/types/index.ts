export * from "./event";

export enum PieceState {
  Black = "black",
  White = "white",
  None = "none",
}

export type Board = PieceState[][];
export type History = Board[];

export type Children = JSX.Element | JSX.Element[] | string | string[];

export interface Player {
  id: string;
  name: string;
}

export interface inviteResponse {
  isAccepted: boolean;
  colorAssigned?: PieceState.Black | PieceState.White;
  // 黑子先行
}

export enum LifeCycle {
  Online = "Online",
  Inviting = "Inviting",
  Playing = "Playing",
  Considering = "Considering",
  WaitingToStart = "WaitingToStart",
}

export enum PlayingLifeCycle {
  Thinking = "Thinking",
  WaitingOpponent = "WaitingOpponent",
  WaitingResp = "WaitingResp",
}

export interface BoardChangeInfo {
  board: Board;
  isCauseByMe: boolean;
  countdown: {
    me: number; // 秒
    opponent: number;
  };
  lastAction: { pos: { i: number; j: number }; order: number };
}

export type Listener = {
  event: string;
  cb: (...args: any[]) => void;
  aliveCycles: (LifeCycle | PlayingLifeCycle)[] | "all";
};
