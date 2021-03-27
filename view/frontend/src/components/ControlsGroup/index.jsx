import React from 'react';
import cn from "classnames";
import "./_style.scss";

const ControlsGroup = (props) => {
    return (
        <div className={cn("controls-container", props.className)}>
            <div className="controls-container-group-name">
                <span>{props.name}</span>
            </div>
            <div className="controls-container-controls">
                {props.children}
            </div>
        </div>
    )
}

export default ControlsGroup;