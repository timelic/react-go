import { FC } from "react";
import { PieceState } from "@types";
import "./index.scss";

export interface Props {
  color: PieceState;
}

export const Piece: FC<Props> = ({ color }) => {
  return (
    <>
      {color !== PieceState.None && color === PieceState.Black ? (
        <span className="piece black" />
      ) : (
        <span className="piece white" />
      )}
    </>
  );
};
