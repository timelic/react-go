import { FC, useContext, useEffect, useState } from "react";
import {
  Banner,
  Button,
  Modal,
  Space,
  Toast,
  Typography,
} from "@douyinfe/semi-ui";
import { LifeCycle, PieceState } from "@types";
import { ctx } from "@store";
import "./index.scss";
import { CountPart, OnlineCard, Timer, TurnBanner } from "@components";
import { eventbus, ws } from "@api";

const { Text } = Typography;

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
    ws;
    document.title = document.domain;
    localEventRegistor();
  }, []);

  const [modelVidible, setModelVisible] = useState(false);
  const [inviterName, setInviterName] = useState("Ai");
  const acceptOrNot = (hasAccepted: boolean) => () => {
    ws.sendInviteResult(hasAccepted);
    setModelVisible(false);
  };
  eventbus.on("show_model", (name: string) => {
    setModelVisible(true);
    setInviterName(name);
  });

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
    <>
      <div id="control">
        <Space vertical align="start" spacing="loose">
          <h1>React Go</h1>
          <CountPart />
          <OnlineCard />
          <Timer />
          <Space>
            <Button
              disabled={lifeCycle !== LifeCycle.Playing}
              onClick={takeBackMove}
            >
              Skip
            </Button>
            <Button
              disabled={lifeCycle !== LifeCycle.Playing}
              onClick={takeBackMove}
            >
              Take back
            </Button>
            <Button
              disabled={lifeCycle !== LifeCycle.Playing}
              type="danger"
              onClick={takeBackMove}
            >
              Surrender
            </Button>
          </Space>
          <TurnBanner />
        </Space>
      </div>
      <Modal
        title="Invitation"
        visible={modelVidible}
        onOk={acceptOrNot(true)}
        onCancel={acceptOrNot(false)}
        closeOnEsc
        centered
      >
        <Text strong>{inviterName}</Text> wants to play with you.
      </Modal>
    </>
  );
};

function localEventRegistor() {
  eventbus.on("invite_result", (result: boolean) => {
    if (result) {
      Toast.success("Invition accpted. Game start!");
    } else {
      Toast.error("Invition refused.");
    }
  });
}
