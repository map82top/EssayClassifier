import React from 'react';
import "./_style.scss";
import cn from "classnames";
import { Select } from "antd";
const { Option } = Select;

const ComboBox = (props) => {

    const onChangeHandler = (event) => {
        props.updateValueHandler(event.target.value);
    }

    return (
        <div className={cn("combobox-container", props.className)}>
            <div className="combobox-container-description">
                {props.description}
            </div>
            <div className="combobox-container-body">
                <select size={props.size} className="combobox-container-body-combobox" onChange={onChangeHandler}>
                    {
                        props.options && props.options.map(option =>
                            <option value={option.key}>{option.content}</option>
                        )
                    }
                </select>
            </div>
        </div>
    )
};

ComboBox.defaultProps = {
    size: 1
}

export default ComboBox;
