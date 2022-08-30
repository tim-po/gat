import React, {useContext, useState} from "react";
import "./index.css";
import ForceValidateContext from "../../ForceValidateContext";

// CONSTANTS

// DEFAULT FUNCTIONS

// TODO: copy this components directory and add your content to make your page

interface SimpleInputPropType {
  // You should declare props like this, delete this if you don't need props
  onlyEmmitOnBlur?: boolean;
  errorTooltipText?: string;
  hasDefaultValueButton?: boolean;
  defaultValueButtonText?: string;
  defaultValue?: string;
  isValid?: boolean;
  id?: string;
  autoComplete?: string;
  onChangeRaw?: (newValue: string) => void;
  onBlurRaw?: (newValue: string) => void;
  onFocusRaw?: (newValue: string) => void;
  inputProps: React.InputHTMLAttributes<HTMLInputElement>;
  required?: boolean;
  displayAsLabel?: boolean;
}


const SimpleInputDefaultProps = {
  // You should declare default props like this, delete this if you don't need props
  errorTooltipText: "Wrong input",
  hasDefaultValueButton: false,
  defaultValueButtonText: "Default",
  defaultValue: "",
  onlyEmmitOnBlur: false,
  inputProps: {type: "text"},
  isValid: true,
};

const SimpleInput = (props: SimpleInputPropType) => {
  const {
    inputProps: {
      placeholder,
      type,
      className,
      onBlur,
      onChange,
      onFocus,
      value
    },
    errorTooltipText,
    hasDefaultValueButton,
    defaultValueButtonText,
    defaultValue,
    autoComplete,
    id,
    isValid,
    onChangeRaw,
    onBlurRaw,
    onFocusRaw,
    onlyEmmitOnBlur,
    required,
    displayAsLabel,
  } = props;

  const {forceValidate} = useContext(ForceValidateContext)
  const [didUserInput, setDidUserInput] = useState(false);
  const inputRef = React.createRef<HTMLInputElement>();
  const shouldDisplayAsValid = (!required && isValid) || (required && value !== "" && isValid) || (!forceValidate && !didUserInput);

  const onChangeInner = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onlyEmmitOnBlur) {
      setDidUserInput(true);
      if (onChange) {
        onChange(e);
      }
      if (onChangeRaw) {
        onChangeRaw(e.target.value);
      }
    } else {
      if (props.inputProps.value !== undefined) {
        if (onChangeRaw) {
          onChangeRaw(e.target.value);
        }
      }
    }
  };

  const onFocusInner = (e: React.FocusEvent<HTMLInputElement>) => {
    if (onFocus) {
      onFocus(e);
    }
    if (onFocusRaw) {
      onFocusRaw(e.target.value);
    }
  };

  const onBlurInner = (e: React.FocusEvent<HTMLInputElement>) => {
    setDidUserInput(true);
    if (onBlur) {
      onBlur(e);
    }
    if (onBlurRaw) {
      onBlurRaw(e.target.value);
    }
    if (onChangeRaw && onlyEmmitOnBlur) {
      onChangeRaw(e.target.value);
    }
  };

  const setDefaultValue = () => {
    if (inputRef.current && defaultValue) {
      inputRef.current.value = defaultValue;
      // @ts-ignore
      onChangeInner({target: {value: defaultValue}});
      // @ts-ignore
      onBlurInner({target: {value: defaultValue}});
    }
  };

  return (
    <div className={"input-container style-override"}>
      <input
        disabled={displayAsLabel}
        {...props.inputProps}
        id={id}
        value={value}
        name={autoComplete}
        ref={inputRef}
        onChange={onChangeInner}
        onFocus={onFocusInner}
        onBlur={onBlurInner}
        className={`
          SimpleInput 
          ${shouldDisplayAsValid ? "" : "not-valid"} 
          ${className || ""} 
          ${displayAsLabel ? 'display-as-label' : ''}
          `}
        placeholder={displayAsLabel ? "-" : placeholder}
        type={type}
        autoComplete={autoComplete}
      />
      {(hasDefaultValueButton && !displayAsLabel && props.inputProps.className && !props.inputProps.className.includes('skeleton')) &&
        <button type={"button"} className={`default-value-button`} onClick={setDefaultValue}>
          {defaultValueButtonText}
        </button>
      }
      {(props.inputProps.className && !displayAsLabel && !props.inputProps.className.includes('skeleton')) &&
        <div className={`validation-error-tooltip ${shouldDisplayAsValid ? "" : "active"}`}>
          {(required && value === "") ? "Field is required" : errorTooltipText}
        </div>
      }
    </div>
  );
};

SimpleInput.defaultProps = SimpleInputDefaultProps;

export default SimpleInput;