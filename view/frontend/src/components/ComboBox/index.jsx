import React from 'react';
import "./_style.scss";
import Select  from "react-select";

const ComboBox = (props) => {

    const onChangeHandler = (itemData, action) => {
        props.updateValueHandler(itemData.value);
    }

    const customDefaultItemRenderer = item => {
        if(props.customItems && props.itemRenderer && typeof props.itemRenderer === 'function') {
            return props.itemRenderer(item);
        } else {
            return (<div>{item.label ? item.label : "Custom item"}</div>);
        }
    }

    const customStyles = {
        control: styles => ({
            ...styles,
            border: 'none',
            width: 180
        })
    }

    return (
        <Select
            defaultValue={props.defaultValue ? props.defaultValue : props.options[0]}
            onChange={onChangeHandler}
            className="combobox"
            formatOptionLabel={ customDefaultItemRenderer }
            options={props.options}
            styles={customStyles}
            autoSize={true}
        />
    )
};

export default ComboBox;
