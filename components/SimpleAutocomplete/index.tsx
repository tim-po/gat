import React, {useContext, useState} from "react";
import "./index.scss";
import {AutoComplete} from "antd";
import texts from './localization';
import {localized} from "../../utils/localized";
import ForceValidateContext from "../../ForceValidateContext";
import LocaleContext from "../../LocaleContext";

// CONSTANTS

// DEFAULT FUNCTIONS

// TODO: copy this components directory and add your content to make your page

interface SimpleAutocompletePropType {
  // You should declare props like this, delete this if you don't need props
  onlyEmmitOnBlur?: boolean
  errorTooltipText?: string
  defaultValue?: string
  isValid?: boolean
  id?: string
  autoComplete?: string
  onChangeRaw: (newValue: string) => void,
  options: { value: string }[]
  value: string | undefined
  placeholder: string
  required?: boolean
  name?: string
  displayAsLabel?: boolean
}

const SimpleAutocompleteDefaultProps = {
  // You should declare default props like this, delete this if you don't need props
  errorTooltipText: "Wrong input",
  defaultValue: "",
  onlyEmmitOnBlur: false,
  inputProps: {},
  isValid: true,
  options: []
};


const SimpleAutocomplete = (props: SimpleAutocompletePropType) => {
  const {
    errorTooltipText,
    id,
    isValid,
    onChangeRaw,
    onlyEmmitOnBlur,
    autoComplete,
    value,
    placeholder,
    options,
    required,
    name,
    displayAsLabel
  } = props;

  const {locale} = useContext(LocaleContext)

  const {forceValidate} = useContext(ForceValidateContext)
  const [didUserInput, setDidUserInput] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const shouldDisplayAsValid = (!required && isValid) || (required && value !== "" && isValid) || (!forceValidate && !didUserInput);

  const onChangeInner = (newValue: string) => {
    if (onChangeRaw) {
      onChangeRaw(newValue);
    }
  };

  const onBlurInner = (e: React.FocusEvent<HTMLInputElement>) => {
    setDidUserInput(true);
    if (onChangeRaw) {
      onChangeRaw(e.target.value);
    }
  };

  const filterOptions = (searchValue: string) => {
    const newOptions = [...options].filter(opt => opt.value.toLowerCase().includes(searchValue.toLowerCase()));
    setFilteredOptions(newOptions);
  };

  const clear = () => {
    setFilteredOptions(options);
    onChangeRaw("");
  };

  return (
    <div className={"input-container"}>
      <AutoComplete
        options={filteredOptions}
        style={{width: "100%"}}
        onSearch={filterOptions}
        onChange={onChangeInner}
        value={value}
        onClear={clear}
      >
        <span>
          <input
            disabled={displayAsLabel}
            name={name}
            placeholder={placeholder}
            onBlur={onBlurInner}
            className={`SimpleInput ${shouldDisplayAsValid ? "" : "not-valid"} ${displayAsLabel ? 'display-as-label' : ''}`}
            id={id}
            autoComplete={autoComplete}
            value={value}
          />
        </span>
      </AutoComplete>
      <div className={`validation-error-tooltip ${shouldDisplayAsValid ? "" : "active"}`}>
        {(required && value === "") ? `${localized(texts.fieldIsRequired, locale)}` : errorTooltipText}
      </div>
    </div>
  );
};

SimpleAutocomplete.defaultProps = SimpleAutocompleteDefaultProps;

export default SimpleAutocomplete;