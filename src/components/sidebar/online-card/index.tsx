import { eventbus, ws } from "@api";
import { Card, Avatar, Typography, Space, Toast } from "@douyinfe/semi-ui";
import { ctx } from "@store";
import { Player } from "@types";
import { FC, useContext } from "react";
import "./index.scss";

const { Meta } = Card;
const { Text } = Typography;

function invite(id: string) {
  ws.invite(id);
  Toast.info("inviting...");
}

const PlayerItem: FC<{ player: Player }> = ({ player: { name, id } }) => {
  return (
    <div className="online-player-item">
      <Meta
        title={name}
        avatar={<Avatar size="extra-extra-small">{name.slice(0, 1)}</Avatar>}
      />
      <Text link onClick={() => invite(id)}>
        invite
      </Text>
    </div>
  );
};

export const OnlineCard: FC = () => {
  const { onlinePlayers } = useContext(ctx);
  return (
    <Card title="Online Players" style={{ width: 360 }}>
      <Space vertical align="start" spacing={16} style={{ width: "100%" }}>
        {onlinePlayers.map((p) => (
          <PlayerItem key={p.id} player={p} />
        ))}
      </Space>
    </Card>
  );
};
