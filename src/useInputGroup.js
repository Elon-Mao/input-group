import { useCallback, useRef } from "react";
import useMemoGetter from "./useMemoGetter";

const focusInputStart = (input) => {
  input.focus();
  input.setSelectionRange(0, 0);
};

const focusInputEnd = (input) => {
  input.focus();
  input.setSelectionRange(input.value.length, input.value.length);
};

/**
 * at least one input
 *
 * @param {*} inputs
 * @param {*} updateInputs
 * @param {*} isBaseEnd
 * @returns
 */
export default function useInputGroup(inputs, updateInputs, isBaseEnd) {
  const inputsRef = useRef(inputs);
  inputsRef.current = inputs;
  const isBaseEndRef = useRef(isBaseEnd);
  const inputMap = useRef({});
  const focusKey = useRef(null);

  const addInput = useCallback(
    (inputKey) => {
      if (!focusKey.current) {
        return;
      }
      const focusInput = inputMap.current[focusKey.current];
      const startValue = focusInput.value.slice(0, focusInput.selectionStart);
      const endValue = focusInput.value.slice(focusInput.selectionEnd);
      updateInputs((draft) => {
        const focusIndex = draft.findIndex(
          (input) => input.inputKey === focusKey.current
        );
        if (isBaseEndRef.current) {
          draft[focusIndex].value = endValue;
          draft.splice(focusIndex, 0, {
            inputKey,
            value: startValue,
          });
          setTimeout(() => {
            focusInputStart(focusInput);
          });
        } else {
          draft[focusIndex].value = startValue;
          draft.splice(focusIndex + 1, 0, {
            inputKey,
            value: endValue,
          });
          setTimeout(() => {
            focusInputStart(inputMap.current[inputKey]);
          });
        }
      });
    },
    [updateInputs]
  );

  const handleBackspace = useCallback(
    (inputKey) => {
      updateInputs((draft) => {
        const inputIndex = draft.findIndex(
          (input) => input.inputKey === inputKey
        );
        if (!inputIndex) {
          return;
        }
        const selectionLength = draft[inputIndex - 1].value.length;
        let remainInput;
        if (isBaseEndRef.current) {
          remainInput = inputMap.current[inputKey];
          draft[inputIndex].value =
            draft[inputIndex - 1].value + draft[inputIndex].value;
          draft.splice(inputIndex - 1, 1);
        } else {
          remainInput = inputMap.current[draft[inputIndex - 1].inputKey];
          draft[inputIndex - 1].value += draft[inputIndex].value;
          draft.splice(inputIndex, 1);
        }
        setTimeout(() => {
          remainInput.focus();
          remainInput.setSelectionRange(selectionLength, selectionLength);
        })
      });
    },
    [updateInputs]
  );

  const refGetter = useMemoGetter(
    useCallback(
      (inputKey, ref = () => {}) =>
        (el) => {
          ref(el);
          inputMap.current[inputKey] = el;
        },
      []
    )
  );

  const changeGetter = useMemoGetter(
    useCallback(
      (inputKey, onChange = () => {}) =>
        (e) => {
          onChange(e);
          updateInputs((draft) => {
            const input = draft.find((input) => input.inputKey === inputKey);
            input.value = e.target.value;
          });
        },
      [updateInputs]
    )
  );

  const keyDownGetter = useMemoGetter(
    useCallback(
      (inputKey, onKeyDown = () => {}) =>
        (e) => {
          onKeyDown(e);
          switch (e.key) {
            case "ArrowLeft": {
              if (e.target.selectionStart || e.target.selectionEnd) {
                return;
              }
              e.preventDefault();
              const inputIndex = inputsRef.current.findIndex(
                (input) => input.inputKey === inputKey
              );
              if (inputIndex) {
                const input =
                  inputMap.current[inputsRef.current[inputIndex - 1].inputKey];
                focusInputEnd(input);
              }
              return;
            }
            case "ArrowRight": {
              const valueLength = e.target.value.length;
              if (
                e.target.selectionStart !== valueLength ||
                e.target.selectionEnd !== valueLength
              ) {
                return;
              }
              e.preventDefault();
              const inputIndex =
                inputsRef.current.findIndex(
                  (input) => input.inputKey === inputKey
                ) + 1;
              if (inputIndex < inputsRef.current.length) {
                const input =
                  inputMap.current[inputsRef.current[inputIndex].inputKey];
                focusInputStart(input);
              }
              return;
            }
            case "Backspace": {
              if (!e.target.selectionStart && !e.target.selectionEnd) {
                e.preventDefault()
                handleBackspace(inputKey);
              }
              return;
            }
          }
        },
      [handleBackspace]
    )
  );

  const focusGetter = useMemoGetter(
    useCallback(
      (inputKey, onFocus = () => {}) =>
        (e) => {
          onFocus(e);
          focusKey.current = inputKey;
        },
      []
    )
  );

  const blurGetter = useMemoGetter(
    useCallback(
      (_inputKey, onBlur = () => {}) =>
        (e) => {
          onBlur(e);
          focusKey.current = null;
        },
      []
    )
  );

  return {
    inputMap,
    addInput,
    handleBackspace,
    refGetter,
    changeGetter,
    keyDownGetter,
    focusGetter,
    blurGetter,
  };
}
