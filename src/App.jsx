import { Fragment } from "react";
import { useImmer } from "use-immer";
import useInputGroup from "./useInputGroup";
import AutoWidthInput from "./AutoWidthInput";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

let inputKey = 1;

function App() {
  const [inputs, updateInputs] = useImmer([
    {
      inputKey,
      value: "This is a input group",
    },
  ]);
  const { propsMap, addInput } = useInputGroup(inputs, updateInputs);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div>
        <div className="input-group">
          {inputs.map(({ inputKey }) => {
            return (
              <Fragment key={inputKey}>
                <span>{inputKey}</span>
                <AutoWidthInput
                  {...propsMap[inputKey]}
                  style={{ padding: "0 5px", minWidth: "1px" }}
                />
              </Fragment>
            );
          })}
        </div>
      </div>
      <button
        onClick={() => addInput(++inputKey)}
        onMouseDown={(e) => e.preventDefault()}
      >
        add span at focus cursor
      </button>
      <p className="read-the-docs">
        {`use "ArrowLeft" and "ArrowRight" to control cursor through inputs`}
      </p>
      <p className="read-the-docs">{`use "Backspace" to delete span`}</p>
    </>
  );
}

export default App;
