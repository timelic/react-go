import { FC, useContext } from "react";
import { Card, Avatar, Typography, Space } from "@douyinfe/semi-ui";
import { Piece } from "@components";
import { PieceState } from "@types";
import classNames from "classnames";
import { ctx } from "@store";

const { Text } = Typography;

interface Props {
  name: string;
  time: string;
  color: PieceState;
}

const TimelItem: FC<Props> = ({ name, time, color }) => {
  return (
    <div className="online-player-item">
      <Card.Meta
        title={
          <Text className={classNames("semi-card-meta-wrapper-title")}>
            {name}
          </Text>
        }
        avatar={<Piece color={color} size={20} />}
      />
      {/* <Card.Meta
        title={name}
        avatar={<Avatar size="extra-extra-small">{name.slice(0, 1)}</Avatar>}
      /> */}
      <Text type="primary">{time}</Text>
    </div>
  );
};

export const Timer: FC = () => {
  const { me, opponent, myColor } = useContext(ctx);
  return (
    <>
      <Card title="Timer" style={{ width: 360 }}>
        <Space vertical align="start" spacing={16} style={{ width: "100%" }}>
          <TimelItem name={me.name} color={myColor} time="28:30" />
          <TimelItem
            name={opponent.name}
            color={
              myColor === PieceState.Black ? PieceState.White : PieceState.Black
            }
            time="25:23"
          />
        </Space>
      </Card>
    </>
  );
};
