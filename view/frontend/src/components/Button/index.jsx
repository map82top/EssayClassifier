import React from "react";
import cn from "classnames";
import "./Button.scss"

const Button = (props) => {
    return (
        <button
            className={cn("button", props.className)}
            onClick={props.clickHandler}
        >
            {props.name}
        </button>
    )
}

export default Button;