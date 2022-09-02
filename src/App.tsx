import { FC } from "react";
import { Table, Control } from "./components";
import { Store } from "@store";
import "./App.css";
import { Space, LocaleProvider } from "@douyinfe/semi-ui";
import en_US from "@douyinfe/semi-ui/lib/es/locale/source/en_US";
const App: FC = () => {
  return (
    <LocaleProvider locale={en_US}>
      <Store>
        <Space spacing={50}>
          <Table />
          <Control />
        </Space>
      </Store>
    </LocaleProvider>
  );
};

export default App;
