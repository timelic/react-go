import { PieceState } from "@types";

/**
 * 生成唯一的 key，便于记录是否走过
 */
function genKey(i: number, j: number) {
  return `${i}:${j}`;
}

/**
 * @function 获取这个棋子的气
 * @return [气的数量，dp]
 */
function getLiberties(
  i: number,
  j: number,
  blocks: PieceState[][]
): [number, Record<string, boolean>] {
  const dp: Record<string, boolean> = {};
  const initialState = blocks[i][j];
  function helper(i: number, j: number): number {
    if (i < 0 || i >= blocks.length || j < 0 || j >= blocks[0].length) return 0;
    if (dp[genKey(i, j)]) return 0;
    if (blocks[i][j] === PieceState.None) return 1;
    if (blocks[i][j] !== initialState) return 0;
    // 标记为已走过
    dp[genKey(i, j)] = true;
    // 遍历四个边
    return (
      helper(i - 1, j) + helper(i + 1, j) + helper(i, j - 1) + helper(i, j + 1)
    );
  }
  // 返回气的数量，并且返回已经走过的坐标
  return [helper(i, j), dp];
}

/**
 * 更新整个棋盘
 */
export function updateTable(blocks: PieceState[][]): PieceState[][] {
  // true false 表示已经遍历过并且标记是否要删除 false 是删除
  // undefined 指的是还没有遍历到
  const dp: Record<string, boolean | undefined> = {};
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[0].length; j++) {
      if (dp[genKey(i, j)] !== undefined) continue;
      const [liberties, localDp] = getLiberties(i, j, blocks);
      // 将局部的 dp 放进整体的 dp，省下几次 BFS
      Object.keys(localDp).forEach((key) => (dp[key] = liberties > 0));
    }
  }

  const res = [...blocks];
  Object.entries(dp).forEach(([key, value]) => {
    if (value !== false) return; // 没气了才删掉
    const [i, j] = key.split(":").map((n) => parseInt(n));
    res[i][j] = PieceState.None;
  });
  return res;
}
