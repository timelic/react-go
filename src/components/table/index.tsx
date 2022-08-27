import { FC, useContext } from "react";
import { PieceState } from "@types";
import { shouldShowStar, updateTable } from "@utils";
import { Block } from "../";
import { Context } from "@store";
import { cloneDeep } from "lodash";
import "./index.scss";

export const Table: FC = () => {
  const { board, setBoard, next, setNext, history, setHistory } =
    useContext(Context);

  const pushHistory = (newBoard: typeof board) =>
    setHistory([...history, newBoard]);

  /**
   * 点击下棋
   */
  const handleClick = (i: number, j: number) => () => {
    if (board[i][j] !== PieceState.None) return;
    const tmp = cloneDeep(board);
    tmp[i][j] = next;
    const newBlock = updateTable(tmp);
    setBoard(newBlock);
    setNext(next === PieceState.Black ? PieceState.White : PieceState.Black);
    pushHistory(newBlock); // 记录历史
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
