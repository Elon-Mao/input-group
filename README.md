# useInputGroup

```
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
```
