import { FC } from "react";
import { PieceState } from "@types";
import "./index.scss";
import classNames from "classnames";

export interface Props {
  color: PieceState;
  size?: number;
}

export const Piece: FC<Props> = ({ color, size }) => {
  return (
    <>
      {color !== PieceState.None && (
        <span
          style={{ "--piece-size": size } as any}
          className={classNames("piece", color)}
        />
      )}
    </>
  );
};
