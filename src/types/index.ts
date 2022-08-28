export enum PieceState {
  Black = "black",
  White = "white",
  None = "none",
}

export type Board = PieceState[][];
export type History = Board[];
