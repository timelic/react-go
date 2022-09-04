import { Piece } from "@components";
import { Toast } from "@douyinfe/semi-ui";
import { PieceState } from "@types";

export function startToast(color: PieceState.Black | PieceState.White) {
  Toast.success({
    icon: <Piece color={color} size={20} />,
    content: `You have the ${color} chess.\nYou go ${
      color === PieceState.Black ? "first" : "second"
    }`,
    duration: 5,
    showClose: false,
  });
}
