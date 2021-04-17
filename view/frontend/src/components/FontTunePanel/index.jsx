import React, { useState } from "react";
import { ComboBox, InputWrapper, ControlsGroup } from "../../components";
import cn from "classnames";
import { InputNumber, Slider } from "antd";
import "./_style.scss";

const FontTunePanel = (props) => {
    const [state, setState] = useState(props.initialState);

    const options = [
        { value: "VERDANA", label: "Verdana" },
        { value: "TIMES_NEW_ROMAN", label: "Times New Roman" },
        { value: "ARIAL", label: "Arial" },
    ]

    const updateState = (update) => {
        let newState = {...state, ...update};
        setState(newState);
        if(props.stateUpdated && typeof props.stateUpdated === 'function') {
            props.stateUpdated(newState);
        }
    }

    const findFontTypeDefaultOption = () => {
        for(let i = 0; i < options.length; i++) {
            if(options[i].value === props.initialState.font_type) {
                return options[i];
            }
        }

        throw new Error('Default option not found');
    }

    const fontSizeChangeValueHandler = (e) => {
        updateState({font_size: parseInt(e.target.value)});
    }

    return (
        <ControlsGroup
            className={cn("ftp", props.className)}
            name="Стиль текста"
        >
            <InputWrapper
                className={cn("ftp-font-type", "ftp-item")}
                description="Шрифт"
            >
                 <ComboBox
                     defaultValue={findFontTypeDefaultOption()}
                     options={options}
                     updateValueHandler={value => updateState({ font_type: value})}
                />
            </InputWrapper>
            <InputWrapper
                className={cn("ftp-font-size", "ftp-item")}
                description="Размер шрифта"
            >
                <InputNumber
                    min={12}
                    max={40}
                    value={state.font_size}
                    onBlur={e => fontSizeChangeValueHandler(e)}
                    onPressEnter={e => fontSizeChangeValueHandler(e)}
                />
            </InputWrapper>
            <InputWrapper
                className={cn("ftp-font-margin", "ftp-item")}
                description="Размер отступов"
                inputWidth={200}
            >
                <Slider
                    min={30}
                    max={100}
                    defaultValue={state.text_width}
                    onAfterChange={value => updateState({ text_width: value})}
                />
            </InputWrapper>
        </ControlsGroup>
    )
}


export default FontTunePanel;