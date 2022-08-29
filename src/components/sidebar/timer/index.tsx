import { FC } from "react";
import { Card, Avatar, Typography, Space } from "@douyinfe/semi-ui";

const { Text } = Typography;

const TimelItem: FC<{ name: string; time: string }> = ({ name, time }) => {
  return (
    <div className="online-player-item">
      <Card.Meta
        title={name}
        avatar={<Avatar size="extra-extra-small">{name.slice(0, 1)}</Avatar>}
      />
      <Text type="primary">{time}</Text>
    </div>
  );
};

export const Timer: FC = () => {
  return (
    <>
      <Card title="Timer" style={{ width: 360 }}>
        <Space vertical align="start" spacing={16} style={{ width: "100%" }}>
          <TimelItem name="Me" time="28:30" />
          <TimelItem name="Opponent" time="25:23" />
        </Space>
      </Card>
    </>
  );
};
