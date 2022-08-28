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
  NotConnected = "NotConnected", // 未连接
  Registered = "Registered",
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
}
