import { FC, useState } from "react";
import { cloneDeep } from "lodash";
import { PieceState } from "@types";
import { updateTable } from "@utils";
import { Block } from "../";
import "./index.scss";

const ROW_AMOUNT = 5;

/**
 * 仅用于辅助初始化棋盘
 */
const _: any[][] = new Array(ROW_AMOUNT).fill(new Array(ROW_AMOUNT).fill(null));

export const Table: FC = () => {
  const [blocks, setBlocks] = useState<PieceState[][]>(
    new Array(ROW_AMOUNT)
      .fill(null)
      .map((_) => new Array(ROW_AMOUNT).fill(PieceState.None))
  );
  const [next, setNext] = useState<PieceState>(PieceState.Black);

  const handleClick = (i: number, j: number) => () => {
    if (blocks[i][j] !== PieceState.None) return;
    const tmp = cloneDeep(blocks);
    tmp[i][j] = next;
    setBlocks(updateTable(tmp));
    setNext(next === PieceState.Black ? PieceState.White : PieceState.Black);
  };

  return (
    <>
      {_.map((_, i) => (
        <div className="row" key={i}>
          {_.map((_, j) => (
            <Block
              key={i * ROW_AMOUNT + j}
              pieceState={blocks[i][j]}
              handleClick={handleClick(i, j)}
            />
          ))}
        </div>
      ))}
    </>
  );
};
