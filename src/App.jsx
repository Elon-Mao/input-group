import { useImmer } from "use-immer";
import useInputGroup from "./useInputGroup";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { Fragment } from "react";

let inputKey = 1;

function App() {
  const [inputs, updateInputs] = useImmer([
    {
      inputKey,
      value: "This is a input group",
    },
  ]);
  const {
    addInput,
    refGetter,
    changeGetter,
    keyDownGetter,
    focusGetter,
    blurGetter,
  } = useInputGroup(inputs, updateInputs);

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
          {inputs.map(({ inputKey, value }) => {
            console.log(inputKey);
            return (
              <Fragment key={inputKey}>
                <span>{inputKey}</span>
                <input
                  style={{ width: value.length * 8 + "px" }}
                  ref={refGetter(inputKey)}
                  value={value}
                  onChange={changeGetter(inputKey)}
                  onKeyDown={keyDownGetter(inputKey)}
                  onFocus={focusGetter(inputKey)}
                  onBlur={blurGetter(inputKey)}
                ></input>
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
      <p className="read-the-docs">{`use "Backspace" to delete input`}</p>
    </>
  );
}

export default App;
