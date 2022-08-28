import { PieceState, Board, History } from "@types";
import { cloneDeep } from "lodash";
import { createContext, Dispatch, FC, SetStateAction, useState } from "react";
import { eventbus } from "@api";

const ROW_AMOUNT = 19;

interface ContextType {
  history: History;
  board: Board;
  next: PieceState.Black | PieceState.White;
  setHistory: Dispatch<SetStateAction<ContextType["history"]>>;
  setBoard: Dispatch<SetStateAction<ContextType["board"]>>;
  setNext: Dispatch<SetStateAction<ContextType["next"]>>;
}

export const initialBoard = new Array(ROW_AMOUNT)
  .fill(null)
  .map((_) => new Array(ROW_AMOUNT).fill(PieceState.None));

export const Context = createContext<ContextType>(null as any);

type Children = JSX.Element | JSX.Element[] | string | string[];

export const Store: FC<{
  children: Children;
}> = ({ children }) => {
  const [board, setBoard] = useState<PieceState[][]>(cloneDeep(initialBoard));
  const [history, setHistory] = useState<PieceState[][][]>([
    cloneDeep(initialBoard),
  ]);
  const [next, setNext] = useState<PieceState.Black | PieceState.White>(
    PieceState.Black
  );

  const defaultContextValue = {
    history,
    setHistory,
    board,
    setBoard,
    next,
    setNext,
  };
  setStoreActions(defaultContextValue);
  return (
    <Context.Provider value={defaultContextValue}>{children}</Context.Provider>
  );
};

/**
 * 设置仓库的 action ，使得可以被外界的 ts 修改
 */
function setStoreActions({ setBoard, setHistory }: ContextType) {
  eventbus.on("update:board", (board: Board) => {
    setBoard(board);
  });
  eventbus.on("update:history", (history: History) => {
    setHistory(history);
  });
}
