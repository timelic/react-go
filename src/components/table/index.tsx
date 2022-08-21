import { FC } from "react";
import { PieceState } from "@types";
import { shouldShowStar } from "@utils";
import { Block } from "../";
import "./index.scss";

interface Props {
  blocks: PieceState[][];
  handleClick: (i: number, j: number) => () => void;
}

export const Table: FC<Props> = ({ blocks, handleClick }) => {
  /**
   * 仅用于辅助初始化棋盘
   */
  const _: any[][] = new Array(blocks.length).fill(
    new Array(blocks[0].length).fill(null)
  );
  return (
    <div id="table">
      {_.map((_, i) => (
        <div className="row" key={i}>
          {_.map((_, j) => (
            <Block
              key={i * blocks.length + j}
              pieceState={blocks[i][j]}
              handleClick={handleClick(i, j)}
              showStar={shouldShowStar(i, j)}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
