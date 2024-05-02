import {
  forwardRef,
  useRef,
  useImperativeHandle,
  useEffect,
  useState,
} from "react";

const baseWrapperStyle = {
  position: "relative",
};

const baseSizerStyle = {
  whiteSpace: "pre",
  visibility: "hidden",
};

const baseInputStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  boxSizing: "border-box",
  width: "100%",
  height: "100%",
};

const wrapperCopyKeys = ["min-width", "padding"];
const sizerCopyKeys = ["font-size", "font-weight", "font-family"];

export default forwardRef(function AutoWidthInput(props, ref) {
  const inputRef = useRef(null);
  const [wrapperStyle, setWrapperStyle] = useState();
  const [sizerStyle, setSizerStyle] = useState();

  useEffect(() => {
    const inputStyle = getComputedStyle(inputRef.current);
    setWrapperStyle(
      wrapperCopyKeys.reduce((sizerStyle, key) => {
        sizerStyle[key] = inputStyle[key];
        return sizerStyle;
      }, {})
    );
    setSizerStyle(
      sizerCopyKeys.reduce((sizerStyle, key) => {
        sizerStyle[key] = inputStyle[key];
        return sizerStyle;
      }, {})
    );
  }, []);

  useImperativeHandle(ref, () => inputRef.current, []);

  return (
    <div
      style={{
        ...wrapperStyle,
        ...baseWrapperStyle,
      }}
    >
      <input
        {...props}
        ref={inputRef}
        style={{
          ...props.style,
          ...baseInputStyle,
        }}
      />
      <div
        style={{
          ...sizerStyle,
          ...baseSizerStyle,
        }}
      >
        {props.value}
      </div>
    </div>
  );
});
