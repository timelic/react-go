import { FC } from "react";
import { PieceState } from "@types";
import "./index.scss";
import classNames from "classnames";

export interface Props {
  color: PieceState;
}

export const Piece: FC<Props> = ({ color }) => {
  return (
    <>
      {color !== PieceState.None && (
        <span className={classNames("piece", color)} />
      )}
    </>
  );
};
