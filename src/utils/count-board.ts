import { PieceState } from "@types";

export function countBoard(board: PieceState[][], color: PieceState) {
  return board.reduce(
    (pre, curr) =>
      pre +
      curr.reduce(
        (innerPre, innerCurr) => innerPre + Number(innerCurr === color),
        0
      ),
    0
  );
}
