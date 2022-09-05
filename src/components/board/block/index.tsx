import { FC, useContext } from "react";
import { PieceState } from "@types";
import { Piece } from "@components";
import "./index.scss";
import { canAction } from "@utils";
import { ctx } from "@store";
import classNames from "classnames";

interface Props {
  pieceState: PieceState;
  handleClick: () => void;
  showStar: boolean;
  orderInfo: {
    showOrder: boolean;
    order: number;
    color: PieceState;
  };
}

export const Block: FC<Props> = ({
  pieceState,
  showStar,
  handleClick,
  orderInfo: { showOrder, order, color },
}) => {
  const { lifeCycle, playingLifeCycle } = useContext(ctx);
  return (
    <div className="block" onClick={handleClick}>
      {/* 序号 */}
      {showOrder && <span className={classNames("order", color)}>{order}</span>}
      {/* 天元 */}
      {showStar && <span className="star" />}
      {/* 指示点 */}
      {canAction(lifeCycle, playingLifeCycle) && <span className="indicator" />}
      {/* 棋子 */}
      {pieceState !== PieceState.None && <Piece color={pieceState} />}
    </div>
  );
};
