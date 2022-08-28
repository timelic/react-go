import {
  PieceState,
  Board,
  History,
  Children,
  Player,
  LifeCycle,
  PlayingLifeCycle,
} from "@types";
import { cloneDeep } from "lodash";
import { createContext, FC, useState } from "react";
import { eventbus } from "@api";

const ROW_AMOUNT = 19;

interface ContextType {
  history: History;
  setHistory: (data: ContextType["history"]) => void;
  board: Board;
  setBoard: (data: ContextType["board"]) => void;
  myColor: PieceState.Black | PieceState.White;
  setMyColor: (data: ContextType["myColor"]) => void;
  isMyTurn: boolean;
  setIsMyTurn: (data: ContextType["isMyTurn"]) => void;
  onlinePlayers: Player[];
  setOnlinePlayers: (data: ContextType["onlinePlayers"]) => void;
  lifeCycle: LifeCycle;
  setLifeCycle: (data: ContextType["lifeCycle"]) => void;
  playingLifeCycle: PlayingLifeCycle;
  setPlayingLifeCycle: (data: ContextType["playingLifeCycle"]) => void;
}

export const initialBoard = new Array(ROW_AMOUNT)
  .fill(null)
  .map((_) => new Array(ROW_AMOUNT).fill(PieceState.None));

export const ctx = createContext<ContextType>(null as any);

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
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  const [lifeCycle, setLifeCycle] = useState<LifeCycle>(LifeCycle.NotConnected);
  const [playingLifeCycle, setPlayingLifeCycle] = useState<PlayingLifeCycle>(
    PlayingLifeCycle.Thinking
  );

  const defaultContextValue: ContextType = {
    history,
    setHistory,
    board,
    setBoard,
    myColor: next,
    setMyColor: setNext,
    isMyTurn,
    setIsMyTurn,
    onlinePlayers,
    setOnlinePlayers,
    lifeCycle,
    setLifeCycle,
    playingLifeCycle,
    setPlayingLifeCycle,
  };
  setStoreActions(defaultContextValue);

  return <ctx.Provider value={defaultContextValue}>{children}</ctx.Provider>;
};

/**
 * 设置仓库的 action ，使得可以被外界的 ts 修改
 */
function setStoreActions(ctx: ContextType) {
  eventbus.on("update:board", (board: Board) => {
    ctx.setBoard(board);
  });
  eventbus.on("update:history", (history: History) => {
    ctx.setHistory(history);
  });
  eventbus.on(
    "update:my_color",
    (color: PieceState.Black | PieceState.White) => {
      ctx.setMyColor(color);
    }
  );
  eventbus.on("update:is_my_turn", (isMyTurn: boolean) => {
    ctx.setIsMyTurn(isMyTurn);
  });
  eventbus.on("update:online_players", (onlinePlayers: Player[]) => {
    ctx.setOnlinePlayers(onlinePlayers);
  });
  eventbus.on("update:life_cycle", (lifeCycle: LifeCycle) => {
    ctx.setLifeCycle(lifeCycle);
    console.log(`🥕 [life cycle]: ${lifeCycle}`);
  });
  eventbus.on("update:playing_life_cycle", (lifeCycle: PlayingLifeCycle) => {
    ctx.setPlayingLifeCycle(lifeCycle);
    console.log(`🍋 [playing life cycle]: ${lifeCycle}`);
  });
}
