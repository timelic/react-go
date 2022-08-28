import { ctx } from "@store";
import { PieceState } from "@types";
import classNames from "classnames";
import { FC, useContext } from "react";
import { countBoard } from "@utils";
import "./index.scss";

interface CountProps {
  color: PieceState;
}

const Count: FC<CountProps> = ({ color }) => {
  const { board } = useContext(ctx);
  const cnt = countBoard(board, color);
  return (
    <span className="count">
      <span className={classNames("piece", color)} />
      <span className="cnt">{cnt}</span>
    </span>
  );
};

export const CountPart: FC = () => (
  <div style={{ display: "flex" }}>
    <Count color={PieceState.Black} />
    <Count color={PieceState.White} />
  </div>
);
