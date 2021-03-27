import React from 'react';
import "./_style.scss";
import cn from "classnames";

const InputWrapper = (props) => {
    return (
        <div className={cn("input-wrapper", props.className)}>
            <div className="input-wrapper-description">
                {props.description}
            </div>
            <div className="input-wrapper-body" style={{width: props.inputWidth}}>
                {props.children}
            </div>
        </div>
    )
};

export default InputWrapper;
