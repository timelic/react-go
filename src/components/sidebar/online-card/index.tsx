import { Card, Avatar, Typography, Space } from "@douyinfe/semi-ui";
import { FC } from "react";
import "./index.scss";

const { Meta } = Card;
const { Text } = Typography;

const Player: FC<{ name: string }> = ({ name }) => {
  return (
    <div className="online-player-item">
      <Meta
        title={name}
        avatar={<Avatar size="extra-extra-small">{name.slice(0, 1)}</Avatar>}
      />
      <Text link>invite</Text>
    </div>
  );
};

export const OnlineCard: FC = () => {
  return (
    <Card title="Online Players" style={{ width: 360 }}>
      <Space vertical align="start" spacing={16} style={{ width: "100%" }}>
        {["John", "Kitty", "Joe Dick"].map((name) => (
          <Player name={name} />
        ))}
      </Space>
    </Card>
  );
};
