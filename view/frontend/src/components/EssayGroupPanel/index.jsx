import React, { useState } from "react";
import {ComboBox, ControlsGroup, InputWrapper} from "../index";
import cn from "classnames";
import {convertLabelToDescription, convertLectureTypeToColor} from "../../utils";
import { Tag } from "antd";
import './_style.scss';

const EssayGroupPanel = (props) => {
    const [state, setState] = useState(props.initialState);

    const createTagElement = (item) => {
        return (
            <Tag color={convertLectureTypeToColor(item.value)}>
                {convertLabelToDescription({ type: item.value })}
            </Tag>
        )
    }

    const updateState = (update) => {
        let newState = {...state, ...update};
        setState(newState);
        if(props.stateUpdated && typeof props.stateUpdated === 'function') {
            props.stateUpdated(newState);
        }
    }

    const groupTypeOptions = [
        { value: "none", label: "Нет"},
        { value: "similarity", label: "По подобию"},
        { value: "tag", label: "По тегу"},
    ]

    const tagOptions = [
        { value: "ATTENTION" },
        { value: "SUCCESS" },
        { value: "FAIL" },
        { value: "TEACHER_SUCCESS" },
        { value: "TEACHER_FAIL" },
        { value: "LECTURE_PLAGIARISM" },
        { value: "ESSAY_PLAGIARISM" },
    ]

    return (
        <ControlsGroup
            name="Группировка эссе"
            className={cn("egp", props.className)}
        >
            <InputWrapper
                className={cn("egp-item", "egp-group-type")}
                description="Группировать по"
            >
                <ComboBox
                    options={ groupTypeOptions }
                    updateValueHandler={value => updateState({group_type: value}) }
                />
            </InputWrapper>
            <InputWrapper
                description="Тег группировки"
                className={cn("egp-item", "egp-group-tag", {"egp-item--hidden": state.group_type !== "tag"})}
            >
                <ComboBox
                    options={ tagOptions }
                    itemRenderer={ createTagElement }
                    updateValueHandler={value =>  updateState({group_tag: value}) }
                    customItems={true}
                />
            </InputWrapper>
        </ControlsGroup>
    )
}

export default EssayGroupPanel;