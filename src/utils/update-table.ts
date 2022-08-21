import { PieceState } from "@types";

export function shouldPieceBeRemoved(
  i: number,
  j: number,
  blocks: PieceState[][]
) {
  // 列表：记录已经遍历过的棋子坐标 待会这些棋子可以一并提走或者保留
  // dp：map，标记某个坐标是否遍历过
  // 返回 [boolean, 已经遍历过的棋子坐标]
}

export function updateTable(blocks: PieceState[][]) {}
