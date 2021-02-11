import React, { useState, useEffect } from "react";
import {Base, ComboBox, Essay, EssayGroup} from "../../components";
import { Spin } from 'antd';
import './_style.scss';
import {inject, observer} from "mobx-react";
import cn from "classnames";
import { convertLectureTypeToColor, convertLabelToDescription } from "../../utils";
import { Tag } from "antd";

const index = (props) => {
    // const [groups, setGroups] = useState([]);
    const [grouping, setGrouping] = useState({groupType: 'none', tag: 'attention'});
    const [renderedEssays, setRenderedEssays] = useState([]);
    const report = props.report.params;

    // const createTagElement = (type) => {
    //     return (
    //         <Tag color={convertLectureTypeToColor(type)}>
    //             {convertLabelToDescription({ type: type })}
    //         </Tag>
    //     )
    // }

    const groupTypeOptions = [
        { key: "none", content: "Нет"},
        { key: "similarity", content: "По подобию"},
        { key: "tag", content: "По тегу"},
    ]

    const tagOptions = [
        { key: "attention", content: "Спорная оценка"},
        { key: "success", content: "Зачет"},
        { key: "fail", content: "Незачет"},
        { key: "teacher-success", content:"Преподаватель - Зачет"},
        { key: "teacher-fail", content:  "Преподаватель - Незачет"},
        { key: "lecture_plagiarism", content: "Плагиат лекции"},
        { key: "essay_plagiarism", content: "Плагиет эссе"},
    ]

    useEffect(() => {
        setRenderedEssays(
            report.gradedEssays.map(essay =>
                (<Essay essay={essay} lecture={props.lecture} key={essay.key} className="group-items-body-item"/>)
            )
        )
    }, [props.report.params.gradedEssays]);

    const updateGrouping = (groupType, tag) => {
        groupType = groupType ? groupType : grouping.groupType;
        tag = tag ? tag : grouping.tag;
        setGrouping({ groupType: groupType, tag: tag });
    }

    const groupingGradedEssays = () => {
        switch (grouping.groupType) {
            case "none":
                return createSingleList();

            case "similarity":
                return groupBySimilarity();

            case "tag":
                return groupByTag();
            default:
                throw new Error("Not supported type");
        }
    }

    const createSingleList = () => {
        return ( <EssayGroup name="Все эссе" renderedEssays={ renderedEssays } essays={report.gradedEssays} /> )
    }

    const groupBySimilarity = () => {
        const groups = {};
        const renderedGroups = {};

        const essays = report.gradedEssays;

        for(let i = 0; i < essays.length; i++) {
            let group = groups[essays[i].group];
            if(group) {
                renderedGroups[essays[i].group].push(renderedEssays[i]);
                group.push(essays[i]);
            } else {
               renderedGroups[essays[i].group] = [renderedEssays[i]];
               groups[essays[i].group] = [essays[i]];
            }
        }

        return Object.keys(groups).map(key => {
            return ( <EssayGroup key={key} name={`Группа подобия ${key}`} essays={ groups[key]} renderedEssays={ renderedGroups[key] } />)
        });
    }

    const groupByTag = () => {
        const groups = {"include": [], "not_include": []};
        const renderedGroups = {"include": [], "not_include": []};
        const essays = report.gradedEssays;

        for(let i = 0; i < essays.length; i++) {
            let groupName = "not_include";
            for(let label of essays[i].labels) {
                if(label.type === grouping.tag) {
                    groupName = "include";
                    break;
                }
            }

            groups[groupName].push(essays[i]);
            renderedGroups[groupName].push(renderedEssays[i]);
        }

        return Object.keys(groups).map(key =>
            ( <EssayGroup key={key} name={`Группа подобия ${key === "include" ? "содержит" : "не содержит" } тег`} essays={ groups[key]} renderedEssays={ renderedGroups[key] } /> ),
        )
    }

  return (
        <Base className="report">
            {
                props.report.params.status !== 'handled' ? (
                    <div className="report-loading">
                        <Spin tip={ props.report.textStatus } className="report-loading-indicator" size="large"/>
                    </div>
                ) : (
                    <div>
                        <div className="report-header">
                            <div className="report-header-control">
                                <ComboBox
                                    className={cn("report-header-control-item")}
                                    options={groupTypeOptions}
                                    description="Группировать по"
                                    updateValueHandler={(value) => updateGrouping(value) }
                                />
                                <ComboBox
                                    options={tagOptions} description="Тег группировки"
                                    updateValueHandler={(value) => updateGrouping("tag", value) }
                                    className={cn("report-header-control-item", "report-header-control-item-combobox-tag",
                                        {"report-header-control-item-combobox-tag--visible": grouping && grouping.groupType === "tag"})}
                                />
                            </div>
                        </div>
                        <div className="report-body">
                            {groupingGradedEssays()}
                        </div>
                    </div>
                )
            }
        </Base>
    )
};

export default inject(['report'])(observer(index));