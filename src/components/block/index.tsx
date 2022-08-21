import { FC } from "react";
import { Piece } from "../";
import { PieceState } from "@types";
import "./index.scss";

interface Props {
  pieceState: PieceState;
  handleClick: () => void;
}

export const Block: FC<Props> = ({ pieceState, handleClick }) => {
  return (
    <div className="block" onClick={handleClick}>
      {pieceState !== PieceState.None && <Piece color={pieceState} />}
    </div>
  );
};
