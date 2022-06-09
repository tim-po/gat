import React from "react";
import './index.css'

type hidingTextProps = {
  defaultText: string,
  hidingText: string,
  peekOut: boolean
}

export const HidingText = ({defaultText, hidingText, peekOut}: hidingTextProps) => {

  return (
    <>
      <div className={`hiding-text ${peekOut && 'custom-hidden'}`}>
        {defaultText}
      </div>
      <div className={`hiding-text ${!peekOut && 'custom-hidden'}`}>
        {hidingText}
      </div>
    </>
  );
};