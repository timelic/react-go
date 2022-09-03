import { FC, useContext } from "react";
import { PieceState } from "@types";
import { Piece } from "@components";
import "./index.scss";
import { canAction } from "@utils";
import { ctx } from "@store";

interface Props {
  pieceState: PieceState;
  handleClick: () => void;
  showStar: boolean;
}

export const Block: FC<Props> = ({ pieceState, showStar, handleClick }) => {
  const { lifeCycle, playingLifeCycle } = useContext(ctx);
  return (
    <div className="block" onClick={handleClick}>
      {/* 天元 */}
      {showStar && <span className="star" />}
      {/* 指示点 */}
      {canAction(lifeCycle, playingLifeCycle) && <span className="indicator" />}
      {/* 棋子 */}
      {pieceState !== PieceState.None && <Piece color={pieceState} />}
    </div>
  );
};
