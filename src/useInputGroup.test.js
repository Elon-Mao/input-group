import { act } from "react";
import { render, renderHook, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useImmer } from "use-immer";
import useInputGroup from "./useInputGroup";

describe("test input group", () => {
  test("add input, base on start", async () => {
    const { result, rerender: rerenderHook } = renderHook(() => {
      const [inputs, updateInputs] = useImmer([
        {
          inputKey: 0,
          value: "This is a input group",
        },
      ]);
      const { propsMap, addInput } = useInputGroup(inputs, updateInputs);
      return {
        addInput,
        inputElements: (
          <>
            {inputs.map(({ inputKey }) => {
              return <input key={inputKey} {...propsMap[inputKey]}></input>;
            })}
          </>
        ),
      };
    });
    const { baseElement, rerender: rerenderUI } = render(
      result.current.inputElements
    );
    const rerender = () => {
      rerenderHook();
      rerenderUI(result.current.inputElements);
    };

    expect(baseElement.querySelectorAll("input").length).toEqual(1);
    result.current.addInput(1);
    rerender();
    expect(baseElement.querySelectorAll("input").length).toEqual(1);
    baseElement.querySelectorAll("input")[0].focus();
    act(() => {
      result.current.addInput(1);
    });
    rerender();
    expect(baseElement.querySelectorAll("input").length).toEqual(2);
    await waitFor(() =>
      expect(
        baseElement.querySelectorAll("input")[1] === document.activeElement
      )
    );
  });
  test("add input, base on end", async () => {
    const { result, rerender: rerenderHook } = renderHook(() => {
      const [inputs, updateInputs] = useImmer([
        {
          inputKey: 0,
          value: "This is a input group",
        },
      ]);
      const { propsMap, addInput } = useInputGroup(inputs, updateInputs, true);
      return {
        addInput,
        inputElements: (
          <>
            {inputs.map(({ inputKey }) => {
              return <input key={inputKey} {...propsMap[inputKey]}></input>;
            })}
          </>
        ),
      };
    });
    const { baseElement, rerender: rerenderUI } = render(
      result.current.inputElements
    );
    const rerender = () => {
      rerenderHook();
      rerenderUI(result.current.inputElements);
    };

    baseElement.querySelectorAll("input")[0].focus();
    act(() => {
      result.current.addInput(1);
    });
    rerender();
    expect(baseElement.querySelectorAll("input").length).toEqual(2);
    await waitFor(() =>
      expect(
        baseElement.querySelectorAll("input")[1] === document.activeElement
      )
    );
  });
  test("delete input, base on start", async () => {
    const { result, rerender: rerenderHook } = renderHook(() => {
      const [inputs, updateInputs] = useImmer([
        {
          inputKey: 0,
          value: "This is a input group",
        },
        {
          inputKey: 1,
          value: "1",
        },
      ]);
      const { propsMap } = useInputGroup(inputs, updateInputs);
      return (
        <>
          {inputs.map(({ inputKey }) => {
            return <input key={inputKey} {...propsMap[inputKey]}></input>;
          })}
        </>
      );
    });
    const { baseElement, rerender: rerenderUI } = render(result.current);
    const rerender = () => {
      rerenderHook();
      rerenderUI(result.current);
    };

    baseElement.querySelectorAll("input")[1].focus();
    await userEvent.keyboard("{Backspace}");
    rerender();
    expect(baseElement.querySelectorAll("input").length).toEqual(2);
    await userEvent.keyboard("{Backspace}");
    rerender();
    expect(baseElement.querySelectorAll("input").length).toEqual(1);
  });
  test("delete input, base on end", async () => {
    const { result, rerender: rerenderHook } = renderHook(() => {
      const [inputs, updateInputs] = useImmer([
        {
          inputKey: 0,
          value: "",
        },
        {
          inputKey: 1,
          value: "",
        },
      ]);
      const { propsMap } = useInputGroup(inputs, updateInputs, true);
      return (
        <>
          {inputs.map(({ inputKey }) => {
            return <input key={inputKey} {...propsMap[inputKey]}></input>;
          })}
        </>
      );
    });
    const { baseElement, rerender: rerenderUI } = render(result.current);
    const rerender = () => {
      rerenderHook();
      rerenderUI(result.current);
    };

    baseElement.querySelectorAll("input")[1].focus();
    await userEvent.keyboard("{Backspace}");
    rerender();
    expect(baseElement.querySelectorAll("input").length).toEqual(1);
    await userEvent.keyboard("{Backspace}");
    rerender();
    expect(baseElement.querySelectorAll("input").length).toEqual(1);
  });
  test("arrow keydown", async () => {
    const { result } = renderHook(() => {
      const [inputs, updateInputs] = useImmer([
        {
          inputKey: 0,
          value: "0",
        },
        {
          inputKey: 1,
          value: "1",
        },
      ]);
      const { propsMap } = useInputGroup(inputs, updateInputs, true);
      return (
        <>
          {inputs.map(({ inputKey }) => {
            return <input key={inputKey} {...propsMap[inputKey]}></input>;
          })}
        </>
      );
    });
    const { baseElement } = render(result.current);

    const [input0, input1] = baseElement.querySelectorAll("input");
    input1.focus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(input1 === document.activeElement);
    await userEvent.keyboard("{ArrowLeft}");
    expect(input0 === document.activeElement);
    await userEvent.keyboard("{ArrowLeft}");
    await userEvent.keyboard("{ArrowLeft}");
    expect(input0 === document.activeElement);
    await userEvent.keyboard("{ArrowRight}");
    expect(input0 === document.activeElement);
    await userEvent.keyboard("{ArrowRight}");
    expect(input1 === document.activeElement);
    await userEvent.keyboard("{ArrowRight}");
    await userEvent.keyboard("{ArrowRight}");
    expect(input1 === document.activeElement);
  });
});
