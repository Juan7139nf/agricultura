import { useState } from "react";
import "./App.css";
import My_Routes from "./scripts/router";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="min-vh-100">
        <My_Routes />
      </div>
    </>
  );
}

export default App;
