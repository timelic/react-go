import { FC, useContext } from "react";
import { Button, Switch } from "@douyinfe/semi-ui";
import { PieceState } from "@types";
import { ctx } from "@store";
import "./index.scss";
import { CountPart } from "@components";

export const FixButton: Button = ((props: any) => {
  return <Button {...props} style={{ display: "inline-block" }} />;
}) as any;

export const Control: FC = () => {
  // ws.send({ test: 1 });
  const {
    setBoard,
    myColor: next,
    setMyColor: setNext,
    history,
  } = useContext(ctx);
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
      <div>
        <Button style={{ display: "inline-block" }}>Play Online</Button>
      </div>
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
