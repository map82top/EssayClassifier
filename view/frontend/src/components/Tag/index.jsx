import React, { useState } from "react";
import "./_style.scss";
import cn from "classnames";
import { getBackgroundColor, getBorderColor, getTextColor } from "../../utils";

const Tag = (props) => {

    const baseClickHandler = (e) => {
        props.clickHanlder(props);
        e.stopPropagation();
    }

    return (
        <button
            className={cn('tag', props.className, props.checkedTag === props.id ? "tag--checked" : "")}
            onClick={baseClickHandler}
            disabled={props.disabled}
            style={
                {
                    backgroundColor: getBackgroundColor(props.color),
                    color: getTextColor(props.color),
                    borderColor: getBorderColor(props.color)
                }
            }
        >
            {props.children}
        </button>
    )
}

export default Tag;