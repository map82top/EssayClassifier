import React, { useState } from "react";
import cn from "classnames";
import { RightOutlined} from "@ant-design/icons";
import "./_style.scss";
import { observer, inject } from "mobx-react";
import { Button, Collapse, TextContainer, TagContainer } from "../../components";

const Essay = (props) => {
    const [open, setOpen] = useState(false);
    const [comparing, setComparing] = useState({"visible": false,
        "text": null, "author_coincidence": null, "target_coincidence": null});

   const createTextStyle = () => {
       return {
            fontSize: props.textStyle.font_size,
            fontFamily: convertTextTypeToFontFamily(props.textStyle.font_type),
            width: `${props.textStyle.text_width}%`
        }
    }

    const teacherGradeButtonHandler = () => {
        const { essay, report } = props;
        if(!essay.teacher_grade) {
            const teacher_grade = essay.grade === 'SUCCESS' ? 'FAIL' : 'SUCCESS';
            report.setTeacherGrade(essay.id, teacher_grade)
        } else {
            report.removeTeacherGrade(essay.id);
        }
    }

    const collapseHandler = () => {
        setOpen(!open);
    }

    const checkedTagHandler = (tagIndex) => {
        const newValue = {}

        if (tagIndex != null) {
            newValue["visible"] = true;
            const label = props.essay.labels[tagIndex];
            let reference = label.internal_reference ? label.internal_reference : 0;
            const coincidence =  props.essay.coincidence[reference];
            newValue["text"] = coincidence.text;
            newValue["author_coincidence"] = coincidence.author_borders
            newValue["target_coincidence"] = coincidence.target_borders

        } else {
            newValue["visible"] = false;
            newValue["text"] = null;
            newValue["author_coincidence"] = null;
            newValue["target_coincidence"] = null;
        }
        setComparing(newValue);
    }

    const cutText = (text) => {
        return text.substring(0, 50);
    }

    const convertTextTypeToFontFamily = (font_type) => {
        switch (font_type) {
            case "VERDANA":
                return 'Verdana';
            case "TIMES_NEW_ROMAN":
                return 'Times New Roman';
            case "ARIAL":
                return 'Arial';
            default:
                throw new Error("Unknown font type " + font_type)
        }
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
                        <TagContainer
                            labels={props.essay.labels}
                            checkedHadler={checkedTagHandler}
                        />
                    </div>
                </div>
                <div className={cn("essay-header-id")}>
                    <p className={cn("essay-header-id-text")}>{props.essay.internal_id}</p>
                </div>
            </div>
            <Collapse
                className={cn('essay-collapse')}
                isOpened={open}
            >
                <div className={cn('essay-collapse-content')}>
                    <div className="essay-collapse-content-essay">
                        <TextContainer
                            className={cn({"comparing-visible": comparing.visible})}
                            style={createTextStyle()}
                            text={props.essay.text}
                            coincidence={comparing.author_coincidence}
                        />
                    </div>
                    {
                        comparing.visible ? (
                            <div className={cn("essay-collapse-content-lecture", {"comparing-visible": comparing.visible})}>
                                <TextContainer
                                    className={cn({"comparing-visible": comparing.visible})}
                                    style={createTextStyle()}
                                    text={comparing.text}
                                    coincidence={comparing.target_coincidence}
                                />
                            </div>
                        ) : ''
                    }
                </div>
                <div className={cn('essay-collapse-footer')}>
                        <Button
                            name={function() {
                               const { essay } = props;
                                if(essay.teacher_grade) {
                                    return "Отмена";
                                } else if(essay.grade === "SUCCESS") {
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
