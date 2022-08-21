import { FC, useState } from "react";
import { cloneDeep } from "lodash";
import { PieceState } from "@types";
import { Table, Control } from "./components";
import { updateTable } from "./utils";
import "./App.css";

const ROW_AMOUNT = 19;

const history: PieceState[][][] = [
  new Array(ROW_AMOUNT)
    .fill(null)
    .map((_) => new Array(ROW_AMOUNT).fill(PieceState.None)),
];

const App: FC = () => {
  const [blocks, setBlocks] = useState<PieceState[][]>(
    new Array(ROW_AMOUNT)
      .fill(null)
      .map((_) => new Array(ROW_AMOUNT).fill(PieceState.None))
  );

  const [next, setNext] = useState<PieceState>(PieceState.Black);

  /**
   * 点击下棋
   */
  const handleClick = (i: number, j: number) => () => {
    if (blocks[i][j] !== PieceState.None) return;
    const tmp = cloneDeep(blocks);
    tmp[i][j] = next;
    const newBlock = updateTable(tmp);
    setBlocks(newBlock);
    setNext(next === PieceState.Black ? PieceState.White : PieceState.Black);
    history.push(newBlock); // 记录历史
  };

  /**
   * 悔棋
   */
  const takeBackMove = () => {
    if (history.length < 2) return;
    setBlocks(history.at(-2)!);
    history.pop();
    setNext(next === PieceState.Black ? PieceState.White : PieceState.Black);
  };

  return (
    <>
      <Table blocks={blocks} handleClick={handleClick} />
      <Control takeBackMove={takeBackMove} />
    </>
  );
};

export default App;
