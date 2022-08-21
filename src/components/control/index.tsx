import { FC } from "react";
import { Button } from "@douyinfe/semi-ui";
import "./index.scss";
import { PieceState } from "@types";

interface Props {
  takeBackMove: () => void;
}

interface CountProps {
  color: PieceState;
  cnt: number;
}

const Count: FC<CountProps> = ({ cnt, color }) => {
  return (
    <div className="count">
      <span className={`piece ${color}`} />
      <span className="cnt">{cnt}</span>
    </div>
  );
};

export const Control: FC<Props> = ({ takeBackMove }) => {
  return (
    <div id="control">
      <h1>React Go</h1>
      <Count color={PieceState.Black} cnt={10} />
      <Count color={PieceState.White} cnt={20} />
      <Button onClick={takeBackMove}>Take back an action</Button>
    </div>
  );
};
