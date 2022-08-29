import { FC } from "react";
import { Table, Control } from "./components";
import { Store } from "@store";
import "./App.css";
import { Space } from "@douyinfe/semi-ui";

const App: FC = () => {
  return (
    <Store>
      <Space spacing={50}>
        <Table />
        <Control />
      </Space>
    </Store>
  );
};

export default App;
