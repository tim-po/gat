import {useState, useEffect} from "react";

export const useInput = (initialState, validations) => {
  const [value, setValue] = useState(initialState)
  const [isDirty, setDirty] = useState(false)
  const valid = useValidation(value, validations)

  const clearValue = () => setValue('')

  const onChange = e => setValue(e.target.value)

  const onBlur = () => setDirty(true)

  return {
    value,
    onChange,
    onBlur,
    isDirty,
    clearValue,
    ...valid
  }
}

export const useValidation = (value, validations) => {
  const [isEmpty, setEmptyError] = useState(true)
  const [emailError, setEmailError] = useState(false)

  useEffect(() => {
    for (const validation in validations) {
      switch (validation) {
        case 'isEmpty':
          value ? setEmptyError(false) : setEmptyError(true)
          break
        case 'isEmail':
          const re = /^(([^<>()[\],;:\s@]+(\.[^<>()[\],;:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+\.)+[^<>()[\],;:\s@]{2,})$/i;
          return value.match(re) ? setEmailError(false) : setEmailError(true)
      }
    }

  }, [value])

  return {
    isEmpty,
    emailError,
  }
}
