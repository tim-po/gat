import React, {useContext, useRef, useState} from "react";
import './index.css'
import {useLocale} from "../../hooks/useLocale";
import LocaleContext from "../../LocaleContext";
import useOnClickOutside from "../../hooks/useOnClickOutside";

export const LocaleSelector = (props: {locales: string[]}) => {
  const {locales} = props
  const [isOpened, setIsOpened] = useState(false)
  const {setLocale, locale} = useContext(LocaleContext)

  const ref = useRef(null)
  useOnClickOutside(ref, () => setIsOpened(false))

  return (
    <div className={`locale-selector`} ref={ref}>
      {locales.map((loc, index) => (
        <button
          key={loc}
          className={`
          locale-button selector
           ${isOpened ? 'opened': ''}
            ${locale === loc ? 'selected': ''}
          `}
          style={(locale !== loc && isOpened) ? {top: (index + 1) * 50 - (locales.indexOf(locale) > index ? 0: 50)}: {}}
          onClick={()=>{
            setLocale(loc)
            setIsOpened(!isOpened)
          }}
        >
          <span className={'inner-text'}>{loc.toUpperCase()}</span>
        </button>
      ))}

      {/*<button*/}
      {/*  className={`locale-button`}*/}
      {/*  style={{background: "none", zIndex: 4}}*/}
      {/*  onClick={() => {*/}
      {/*    setIsOpened(!isOpened)*/}
      {/*  }}*/}
      {/*/>*/}
    </div>
  );
};