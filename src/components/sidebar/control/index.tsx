import { FC, useContext, useEffect } from "react";
import { Button, Space } from "@douyinfe/semi-ui";
import { LifeCycle, PieceState } from "@types";
import { ctx } from "@store";
import "./index.scss";
import { CountPart, OnlineCard, Timer } from "@components";
import { ws } from "@api";

export const FixButton: Button = ((props: any) => {
  return <Button {...props} style={{ display: "inline-block" }} />;
}) as any;

export const Control: FC = () => {
  const {
    setBoard,
    myColor: next,
    setMyColor: setNext,
    history,
    lifeCycle,
  } = useContext(ctx);
  // 初始化
  useEffect(() => {
    ws.init();
  }, []);
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
      <Space vertical align="start" spacing="loose">
        <h1>React Go</h1>
        <CountPart />
        {lifeCycle !== LifeCycle.Playing && <OnlineCard />}
        {lifeCycle !== LifeCycle.Playing && <Timer />}
        {lifeCycle !== LifeCycle.Playing && (
          <Space>
            <Button onClick={takeBackMove}>Skip</Button>
            <Button onClick={takeBackMove}>Take back</Button>
            <Button type="danger" onClick={takeBackMove}>
              Surrender
            </Button>
          </Space>
        )}
      </Space>
    </div>
  );
};
