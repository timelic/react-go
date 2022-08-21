import { FC } from "react";

import { Button } from "@douyinfe/semi-ui";

interface Props {
  takeBackMove: () => void;
}

export const Control: FC<Props> = ({ takeBackMove }) => {
  return (
    <div>
      <Button onClick={takeBackMove}>悔棋</Button>
    </div>
  );
};
