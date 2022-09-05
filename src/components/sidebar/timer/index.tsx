import { FC, useContext, useMemo, useState } from "react";
import { Card, Avatar, Typography, Space } from "@douyinfe/semi-ui";
import { IconSmallTriangleLeft } from "@douyinfe/semi-icons";
import { Piece } from "@components";
import {
  BoardChangeInfo,
  LifeCycle,
  PieceState,
  PlayingLifeCycle,
} from "@types";
import classNames from "classnames";
import { ctx } from "@store";
import { eventbus, createCountdown } from "@api";
import { useEffect } from "react";
const { Text } = Typography;

interface Props {
  name: string;
  time: string;
  color: PieceState;
  isMyTurn: boolean;
  isPlaying: boolean;
}

const TimelItem: FC<Props> = ({ name, time, color, isMyTurn, isPlaying }) => {
  return (
    <div className="online-player-item">
      <Space>
        <Card.Meta
          title={
            <Text className={classNames("semi-card-meta-wrapper-title")}>
              {name}
            </Text>
          }
          avatar={<Piece color={color} size={20} />}
        />
        {isPlaying && isMyTurn && <IconSmallTriangleLeft color="red" />}
      </Space>

      <Text type="primary">{time}</Text>
    </div>
  );
};

type Cd = ReturnType<typeof createCountdown> | null;

export const Timer: FC = () => {
  // TODO 这里的逻辑太丑了 等我学好 react 的 rerender 再来重构
  const context = useContext(ctx);
  const { me, opponent, myColor, playingLifeCycle, lifeCycle } = context;
  const [cdMe, setCdMe] = useState<Cd>(null);
  const [cdOppoonent, setCdOpponent] = useState<Cd>(null);
  const [time, setTime] = useState({
    me: "30:00",
    opponent: "30:00",
  });
  useEffect(() => {
    eventbus.off("sync_countdown");
    eventbus.on("sync_countdown", (syncTime: BoardChangeInfo["countdown"]) => {
      setTime({
        me: sToMmss(syncTime.me),
        opponent: sToMmss(syncTime.opponent),
      });
      const who =
        context.playingLifeCycle === PlayingLifeCycle.WaitingOpponent
          ? "me"
          : "opponent";
      if (who === "me") {
        setCdMe(
          createCountdown(
            { s: syncTime[who] },
            {
              listen: ({ mm, ss }) => {
                setTime({
                  ...time,
                  [who]: `${mm}:${ss}`,
                });
              },
            }
          )
        );
        cdOppoonent?.stop();
      } else {
        setCdOpponent(
          createCountdown(
            { s: syncTime[who] },
            {
              listen: ({ mm, ss }) => {
                setTime({
                  ...time,
                  [who]: `${mm}:${ss}`,
                });
              },
            }
          )
        );
        cdMe?.stop();
      }
    });
  }, [playingLifeCycle, time]);
  return (
    <Card title="Timer" style={{ width: 360 }}>
      <Space vertical align="start" spacing={16} style={{ width: "100%" }}>
        <TimelItem
          name={me.name}
          color={myColor}
          time={time.me}
          isMyTurn={playingLifeCycle === PlayingLifeCycle.Thinking}
          isPlaying={lifeCycle === LifeCycle.Playing}
        />
        <TimelItem
          name={opponent.name}
          color={
            myColor === PieceState.Black ? PieceState.White : PieceState.Black
          }
          time={time.opponent}
          isMyTurn={playingLifeCycle !== PlayingLifeCycle.Thinking}
          isPlaying={lifeCycle === LifeCycle.Playing}
        />
      </Space>
    </Card>
  );
};

function sToMmss(s: number): string {
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${ss}`;
}
