import { FC } from "react";
import { Button } from "@douyinfe/semi-ui";
import "./index.scss";
import { PieceState } from "@types";
import classNames from "classnames";

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
      <span className={classNames("piece", color)} />
      <span className="cnt">{cnt}</span>
    </div>
  );
};

export const Control: FC<Props> = ({ takeBackMove }) => {
  return (
    <div id="control">
      <h1>React Go</h1>
      <Count color={PieceState.Black} cnt={10} />
      <Count color={PieceState.White} cnt={11} />
      {/* 占位 */}
      <div style={{ flexGrow: 1 }} />
      <div>
        <Button style={{ display: "inline-block" }} onClick={takeBackMove}>
          Take back an action
        </Button>
      </div>
    </div>
  );
};
