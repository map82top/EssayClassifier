import React, { useState, useRef } from "react";
import cn from "classnames";
import { Tag, Checkbox } from "antd";
import { RightOutlined} from "@ant-design/icons";
import {collapseVertical, expandVertical, collapseHorizontal, expandHorizontal} from "../../utils";
import "./Essay.scss";
import { observer } from "mobx-react";
import {Button, ComboBox} from "../../components";

const Essay = (props) => {
    const [open, setOpen] = useState(false);
    const [lectureVisible, setLectureVisible] = useState(false)
    const changeGradeCheckBox = useRef();

    const collapseElement = React.createRef();
    const shortEssayElement = React.createRef();

    const changeGradeHandler = () => {

    }

    const collapseHandler = () => {
        if(!open) {
            expandVertical(collapseElement.current, 20);
            collapseHorizontal(shortEssayElement.current);
        } else {
             collapseVertical(collapseElement.current, 20);
             expandHorizontal(shortEssayElement.current);
        }

        setOpen(!open);
    }

    const showLectureHandler = (e) => {
        setLectureVisible(!lectureVisible);
        let coef = 2;
        if(lectureVisible) {
            coef = 0.5
        }
        let element = collapseElement.current;
        let sectionHeight = coef * element.scrollHeight;
        element.style.height = sectionHeight + 'px';
    }

    const cutText = (text) => {
        return text.substring(0, 80);
    }

    const covertLectureTypeToColor = (type) => {
        switch (type) {
            case 'attention':
                return 'orange';
            case 'lecture_plagiarism':
            case 'essay_plagiarism':
            case 'fail':
                return 'red';
            case 'success':
                return 'green';
        }
    }

    const convertLabelToDescription = (label) => {
        let base = '';
        switch (label.type) {
            case 'attention':
                base = 'Спорная оценка';
                break;
            case 'lecture_plagiarism':
                base = 'Плагиат лекции';
                break;
            case 'essay_plagiarism':
                base = 'Плагиат эссе';
                break;
            case 'fail':
                base = 'Незачет';
                break;
            case 'success':
                base = 'Зачет';
                break;
        }

        if(label.reference) {
            base += ` ${label.reference}`;
        }

        if(label.probability) {
              base += ` на ${label.probability}%`;
        }

        return base;
    }

    return (
        <div className="essay">
            <div className="essay-header">
                <div className="essay-header-collapse" onClick={collapseHandler}>
                    <RightOutlined className={cn("essay-header-collapse-icon", {"icon-open": open})} />
                    <div className="essay-header-collapse-begin-essay" ref={shortEssayElement}>{cutText(props.essay.text)}</div>
                    <div className="essay-header-collapse-tags">
                        {props.essay.labels.map(label => (
                            <Tag color={covertLectureTypeToColor(label.type)} className="essay-header-collapse-tags-item">
                                {convertLabelToDescription(label)}
                            </Tag>
                        ))}
                    </div>
                </div>
                <div className={cn("essay-header-control", {"control-visible": open})}>
                    <Checkbox
                        className={cn("essay-header-control-lecture-checkbox")}
                        onChange={showLectureHandler}
                    >
                        Показать лекцию
                    </Checkbox>
                </div>
                <div className={cn("essay-header-id")}>
                    <p className={cn("essay-header-id-text")}>{props.essay.key}</p>
                </div>
            </div>
            <div className={cn('essay-content')} ref={collapseElement}>
                <p className="essay-content-essay">{props.essay.text}</p>
                <p className={cn("essay-content-lecture", {"lecture-visible": lectureVisible})}>{props.lecture.text}</p>
            </div>
            <div className={cn('essay-footer')}>
                <div className={cn('essay-footer-change-grade')}>
                    <ComboBox
                        ref={changeGradeCheckBox}
                        options={options}
                        description="Оценка"
                    />
                    <Button
                        name="Сохранить"
                        clickHandler={changeGradeHandler}
                        className={cn('essay-footer -change-grade-save-button')}
                    />
                </div>
            </div>
        </div>
    )
};


export default observer(Essay);
