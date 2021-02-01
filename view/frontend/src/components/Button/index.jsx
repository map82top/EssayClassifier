import React from "react";
import "./_style.scss";
import cn from "classnames";

const Button = (props) => {
    return (
        <button
            className={cn('button', props.className)}
            onClick={props.clickHandler}
            style={{visibility: props.hidden ? 'hidden' : 'visible'}}
        >
            {props.name}
        </button>
    )
}

export default Button;