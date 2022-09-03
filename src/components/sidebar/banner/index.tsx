import { Banner } from "@douyinfe/semi-ui";
import { ctx } from "@store";
import { LifeCycle, PlayingLifeCycle } from "@types";
import { FC, useContext } from "react";

export const TurnBanner: FC = () => {
  const { lifeCycle, playingLifeCycle } = useContext(ctx);
  return lifeCycle === LifeCycle.Playing ? (
    playingLifeCycle === PlayingLifeCycle.Thinking ? (
      <Banner
        fullMode={false}
        style={{ width: 340 }}
        type="info"
        description="It's your turn, waiting for your action."
      />
    ) : (
      <Banner
        fullMode={false}
        style={{ width: 340 }}
        type="warning"
        description="It's your opponent's turn."
      />
    )
  ) : (
    <></>
  );
};
