import { FC, useContext } from "react";
import { PieceState } from "@types";
import { shouldShowStar, updateTable } from "@utils";
import { Block } from "../";
import { ctx } from "@store";
import { cloneDeep } from "lodash";
import "./index.scss";

export const Table: FC = () => {
  const {
    board,
    setBoard,
    myColor: next,
    setMyColor: setNext,
    history,
    setHistory,
  } = useContext(ctx);

  const pushHistory = (newBoard: typeof board) =>
    setHistory([...history, newBoard]);

  /**
   * 点击下棋
   */
  const handleClick = (i: number, j: number) => () => {
    if (board[i][j] !== PieceState.None) return;
    // const tmp = cloneDeep(board);
    // tmp[i][j] = next;
    // const newBlock = updateTable(tmp, i, j);
    // setBoard(newBlock);

    // 更新棋盘，如果返回false如果该地方没气且没吃掉敌人的子，则该地方不能下
    if (!updateTable(board, i, j, next)) return
    setNext(next === PieceState.Black ? PieceState.White : PieceState.Black);
    pushHistory(cloneDeep(board)); // 记录历史
  };

  /**
   * 仅用于辅助初始化棋盘
   */
  const _: any[][] = new Array(board.length).fill(
    new Array(board[0].length).fill(null)
  );

  return (
    <div id="table">
      {_.map((_, i) => (
        <div className="row" key={i}>
          {_.map((_, j) => (
            <Block
              key={i * board.length + j}
              pieceState={board[i][j]}
              handleClick={handleClick(i, j)}
              showStar={shouldShowStar(i, j)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
