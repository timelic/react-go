import { FC } from "react";
import { Piece } from "../";
import { PieceState } from "@types";
import "./index.scss";

interface Props {
  pieceState: PieceState;
  handleClick: () => void;
  showStar: boolean;
}

export const Block: FC<Props> = ({ pieceState, handleClick, showStar }) => {
  return (
    <div className="block" onClick={handleClick}>
      {/* 天元 */}
      {showStar && <span className="star" />}
      {/* 指示点 */}
      <span className="indicator" />
      {/* 棋子 */}
      {pieceState !== PieceState.None && <Piece color={pieceState} />}
    </div>
  );
};
