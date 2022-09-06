import React, {useContext, useEffect, useState} from "react";
import "./index.scss";
import texts from './localization';
import {localized} from "../../utils/localized";
import {DatePicker} from "antd";
import moment from "moment";
import LocaleContext from "../../LocaleContext";

// CONSTANTS

// DEFAULT FUNCTIONS

// TODO: copy this components directory and add your content to make your page

interface SimpleDatePickerPropType {
  // You should declare props like this, delete this if you don't need props
  onlyEmmitOnBlur?: boolean
  errorTooltipText?: string
  defaultValue?: string
  isValid?: boolean
  id?: string
  autoComplete?: string
  onChangeRaw?: (newValue: string) => void
  value: string | undefined
  required?: boolean
  placeholder?: string
  displayAsLabel?: boolean
}

const SimpleDatePickerDefaultProps = {
  // You should declare default props like this, delete this if you don't need props
  errorTooltipText: "Wrong input",
  defaultValue: "",
  onlyEmmitOnBlur: false,
  inputProps: {},
  isValid: true,
  placeholder: "dd.mm.yyyy"
};

const dateFormat = "DD.MM.YYYY";
const dateFormatRegexp = /^\s*(3[01]|[12][0-9]|0?[1-9])\.(1[012]|0?[1-9])\.((?:19|20)\d{2})\s*$/

const SimpleDatePicker = (props: SimpleDatePickerPropType) => {
  const {
    errorTooltipText,
    id,
    isValid,
    onChangeRaw,
    onlyEmmitOnBlur,
    autoComplete,
    value,
    required,
    placeholder,
    displayAsLabel
  } = props;

  const {locale} = useContext(LocaleContext)

  const [didUserInput, setDidUserInput] = useState(false);
  const shouldDisplayAsValid = (!required && isValid) || (required && value !== "" && isValid) || !didUserInput

  const onChangeInner = (newDate: string) => {
    if (!onlyEmmitOnBlur) {
      setDidUserInput(true);
      if (onChangeRaw) {
        onChangeRaw(newDate);
      }
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(dateFormatRegexp.test(e.target.value)){
      onChangeInner(e.target.value)
    }
  }

  useEffect(()=>{
    if(id){
      const input = document.getElementById(id)
      if(input){
        // @ts-ignore
        input.addEventListener("input", onInputChange)
      }

      return ()=>{
        const input = document.getElementById(id)
        if(input){
          // @ts-ignore
          input.removeEventListener("input", onInputChange)
        }
      }
    }
  }, [])

  return (
    <div className={"input-container"}>
      {displayAsLabel &&
          <input
              disabled
              className={`SimpleInput SimpleDatePicker ${shouldDisplayAsValid ? "" : "not-valid"} ${displayAsLabel ? 'display-as-label' : ''}`}
              value={value}
          />
      }
      {!displayAsLabel &&
          <>
            <DatePicker
                className={`SimpleInput SimpleDatePicker ${shouldDisplayAsValid ? "" : "not-valid"} ${displayAsLabel ? 'display-as-label' : ''}`}
                onChange={(date, dateString) => onChangeInner(dateString)}
                showToday={false}
                value={value ? moment(value, dateFormat) : undefined}
                format={dateFormat}
                autoComplete={autoComplete}
                placeholder={placeholder}
                id={id}
            />
            <div className={`validation-error-tooltip ${shouldDisplayAsValid ? "" : "active"}`}>
              {(required && value === "") ? `${localized(texts.fieldIsRequired, locale)}` : errorTooltipText}
            </div>
          </>
      }
    </div>
  );
};

SimpleDatePicker.defaultProps = SimpleDatePickerDefaultProps;

export default SimpleDatePicker;