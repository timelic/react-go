import { FC } from "react";
import { Table, Control } from "./components";
import { Store } from "@store";
import "./App.css";

const App: FC = () => {
  return (
    <Store>
      <Table />
      <Control />
    </Store>
  );
};

export default App;
