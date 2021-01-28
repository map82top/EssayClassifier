import React from 'react';
import "./ComboBox.scss";

const ComboBox = (props) => {

    const onChangeHandler = (event) => {
        props.updateValueHandler(event.target.value);
    }

    return (
        <div className="combobox-container">
            <div className="combobox-container-description">
                {props.description}
            </div>
            <div className="combobox-container-body">
                <select size={props.size} className="combobox-container-body-combobox" onChange={onChangeHandler}>
                    {
                        props.options.map((option) => (
                            <option value={option.key} key={option.key}>{option.text}</option>
                        ))
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
