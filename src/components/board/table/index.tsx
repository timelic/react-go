import { FC, useContext } from "react";
import { LifeCycle, PieceState, PlayingLifeCycle } from "@types";
import { canAction, shouldShowStar, updateTable } from "@utils";
import { Block } from "../";
import { ctx } from "@store";
import { cloneDeep } from "lodash";
import { ws } from "@api";
import "./index.scss";
import classNames from "classnames";

export const Table: FC = () => {
  const { board, lifeCycle, playingLifeCycle } = useContext(ctx);

  /**
   * 点击下棋
   */
  const handleClick = (i: number, j: number) => () => {
    if (board[i][j] !== PieceState.None) return;
    if (!canAction(lifeCycle, playingLifeCycle, true)) return;
    ws.action(i, j);
  };

  /**
   * 仅用于辅助初始化棋盘
   */
  const _: any[][] = new Array(board.length).fill(
    new Array(board[0].length).fill(null)
  );

  return (
    <div
      id="table"
      className={classNames({
        "not-allowed": !canAction(lifeCycle, playingLifeCycle),
      })}
    >
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
