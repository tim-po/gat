import React  from "react";
import "./index.scss";

// CONSTANTS

// DEFAULT FUNCTIONS

// TODO: copy this components directory and add your content to make your page

interface  SimpleLabelContainerPropType {
    // You should declare props like this, delete this if you don't need props
    displayAsLabel?: boolean
    id?: string
    label?: string
    children: string | React.ReactNode
}


const  SimpleLabelContainer = (props:  SimpleLabelContainerPropType) => {
    const {
        label,
        id,
        displayAsLabel,
        children
    } = props;


    return (
        <section className={`relative w-full simple-input-form ${displayAsLabel ? 'display-as-label': ''}`}>
            {label &&
                <label htmlFor={id} className={"simple-input-label"}>
                    {label}
                </label>
            }
            {children}
        </section>
    );
};

export default  SimpleLabelContainer;