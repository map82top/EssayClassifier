import React, { useState } from "react";
import { Button, ControlsGroup } from "../../components";
import cn from "classnames";
import "./_style.scss";

const ActionPanel = (props) => {
    return (
        <ControlsGroup
            className={cn("ap", props.className)}
            name="Действия"
        >
            <Button
                className="ap-export"
                name="Экспортировать"
                clickHandler={() => props.exportHandler && props.exportHandler()}
            />
        </ControlsGroup>
    )
}


export default ActionPanel;