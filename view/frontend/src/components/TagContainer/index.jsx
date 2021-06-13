import React, { useState } from "react";
import "./_style.scss";
import cn from "classnames";
import {Tag} from "../index";
import {convertLabelToDescription, convertLectureTypeToColor, getId} from "../../utils";

const TagContainer = (props) => {
    const [checkedTag, setCheckedTag] = useState();

    const tagClickHandler = (tag) => {
        let newValue = null;
        if (checkedTag !== tag.id) {
            newValue = tag.id;
        }
        setCheckedTag(newValue);
        props.checkedHadler(newValue);
    }

    return (
         <div className={cn("tag-container", props.className)}>
                {props.labels.map((label, index) => {
                   return (
                        <Tag
                            key={getId(index)}
                            id={index}
                            color={convertLectureTypeToColor(label.type)}
                            className="tag-container-item"
                            clickHanlder={tagClickHandler}
                            checkedTag={checkedTag}
                            disabled={!label.probability}
                        >
                            {convertLabelToDescription(label)}
                        </Tag>
                    )
                })}
         </div>
    )
}

export default TagContainer;