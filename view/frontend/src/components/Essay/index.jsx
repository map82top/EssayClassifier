import React, { useState, useRef } from "react";
import cn from "classnames";
import { Tag, Checkbox } from "antd";
import { RightOutlined} from "@ant-design/icons";
import "./_style.scss";
import { observer, inject } from "mobx-react";
import { Button, ComboBox, Collapse } from "../../components";

const Essay = (props) => {
    const [open, setOpen] = useState(false);
    const [lectureVisible, setLectureVisible] = useState(false);

    const teacherGradeButtonHandler = () => {
        const { essay, report } = props;
        if(!essay.teacherGrade) {
            const grade = essay.grade === 'success' ? 'fail' : 'success';
            report.setTeacherGrade(essay.key, grade)
        } else {
            report.removeTeacherGrade(essay.key);
        }
    }

    const collapseHandler = () => {
        setOpen(!open);
    }

    const showLectureHandler = (e) => {
        setLectureVisible(!lectureVisible);
    }

    const cutText = (text) => {
        return text.substring(0, 50);
    }

    const extractEssayId = (essayId) => {
        return essayId.split('-')[1]
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
            case 'teacher-success':
                return 'cyan';
            case 'teacher-fail':
                return 'magenta';
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
            case 'teacher-success':
                base = 'Преподаватель - Зачет';
                break;
            case 'teacher-fail':
                base = 'Преподаватель - Незачет';
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
        <div className={cn("essay", props.className)} key={props.key}>
            <div className="essay-header">
                <div className={cn('essay-header-content')}>
                    <div className="essay-header-content-collapse" onClick={collapseHandler}>
                        <RightOutlined className={cn("essay-header-content-collapse-icon", {"essay-header-content-collapse-icon--open": open})} />
                        <Collapse
                            className="essay-header-content-collapse-begin-essay"
                            isOpened={!open}
                            direction='horizontal'
                        >{cutText(props.essay.text)}</Collapse>
                        <div className="essay-header-content-collapse-tags">
                            {props.essay.labels.map(label => (
                                <Tag color={covertLectureTypeToColor(label.type)} className="essay-header-content-collapse-tags-item">
                                    {convertLabelToDescription(label)}
                                </Tag>
                            ))}
                        </div>
                    </div>
                    <div className={cn("essay-header-content-control", {"control-visible": open})}>
                        <Checkbox
                            className={cn("essay-header-content-control-lecture-checkbox")}
                            onChange={showLectureHandler}
                        >
                            Показать лекцию
                        </Checkbox>
                    </div>
                </div>
                <div className={cn("essay-header-id")}>
                    <p className={cn("essay-header-id-text")}>{extractEssayId(props.essay.key)}</p>
                </div>
            </div>
            <Collapse
                className={cn('essay-collapse')}
                isOpened={open}
            >
                <div className={cn('essay-collapse-content')}>
                    <div className="essay-collapse-content-essay">
                        <p className={cn({"lecture-visible": lectureVisible})}>{props.essay.text}</p>
                    </div>
                    {
                        lectureVisible ? (
                            <div className={cn("essay-collapse-content-lecture", {"lecture-visible": lectureVisible})}>
                                <p className={cn({"lecture-visible": lectureVisible})}>{props.lecture.text}</p>
                            </div>
                        ) : ''
                    }
                </div>
                <div className={cn('essay-collapse-footer')}>
                        <Button
                            name={function() {
                               const { essay } = props;
                                if(essay.teacherGrade) {
                                    return "Отмена";
                                } else if(essay.grade === "success") {
                                    return "Незачет";
                                } else {
                                    return "Зачет";
                                }
                            }()}
                            clickHandler={teacherGradeButtonHandler}
                            className={cn('essay-collapse-footer-teacher-grade-button')}
                        />
                </div>
            </Collapse>
        </div>
    )
};


export default inject(['report'])(observer(Essay));
