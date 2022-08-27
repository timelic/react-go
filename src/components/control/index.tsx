import { FC, useContext } from "react";
import { Button } from "@douyinfe/semi-ui";
import { PieceState } from "@types";
import classNames from "classnames";
import { Context } from "@store";
import { ws } from "@api";
import "./index.scss";
import { countBoard } from "@utils";

interface CountProps {
  color: PieceState;
}

const Count: FC<CountProps> = ({ color }) => {
  const { board } = useContext(Context);
  const cnt = countBoard(board, color);
  return (
    <span className="count">
      <span className={classNames("piece", color)} />
      <span className="cnt">{cnt}</span>
    </span>
  );
};

const CountPart: FC = () => (
  <div style={{ display: "flex" }}>
    <Count color={PieceState.Black} />
    <Count color={PieceState.White} />
  </div>
);

export const Control: FC = () => {
  // ws.send({ test: 1 });
  const { setBoard, next, setNext, history } = useContext(Context);
  /**
   * 悔棋
   */
  const takeBackMove = () => {
    if (history.length < 2) return;
    setBoard(history.at(-2)!);
    history.pop();
    setNext(next === PieceState.Black ? PieceState.White : PieceState.Black);
  };

  return (
    <div id="control">
      <h1>React Go</h1>
      <CountPart />
      {/* 占位 */}
      <div style={{ flexGrow: 1 }} />
      <div>
        <Button style={{ display: "inline-block" }} onClick={takeBackMove}>
          Take back an action
        </Button>
      </div>
    </div>
  );
};
