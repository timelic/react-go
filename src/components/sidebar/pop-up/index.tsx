import { FC, useState } from "react";
import { Modal, Button } from "@douyinfe/semi-ui";

export const modalDemo: FC = () => {
  const [visible, setVisible] = useState(false);
  function showDialog() {
    setVisible(true);
  }
  function handleOk() {
    setVisible(false);
  }
  function handleAfterClose() {
    console.log("After Close callback executed");
  }
  function handleCancel() {
    setVisible(false);
  }
  return (
    <>
      <Button onClick={showDialog}>打开弹窗</Button>
      <Modal
        title="基本对话框"
        visible={visible}
        onOk={handleOk}
        afterClose={handleAfterClose} //>=1.16.0
        onCancel={handleCancel}
        closeOnEsc={true}
      >
        This is the content of a basic modal.
        <br />
        More content...
      </Modal>
    </>
  );
};
