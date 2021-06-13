import React, { useState, useEffect } from "react";
import {
    Base,
    Essay,
    EssayGroup,
    Button,
    FontTunePanel,
    EssayGroupPanel,
    ActionPanel,
} from "../../components";
import { Spin, Tag } from 'antd';
import './_style.scss';
import {inject, observer} from "mobx-react";
import cn from "classnames";
import {convertLabelToDescription, convertLectureTypeToColor, makeNotification} from "../../utils";

const index = (props) => {
    const [grouping, setGrouping] = useState({
        group_type: 'none',
        group_tag: 'ATTENTION'
    });
    const [renderedEssays, setRenderedEssays] = useState([]);
    const [textStyle, setTextStyle] = useState({
        font_type: "VERDANA",
        font_size: 18,
        text_width: 60
    });

    const report = props.report.params;

    useEffect(() => {
        setRenderedEssays(
            report.essays.map(essay =>
                (<Essay
                    essay={essay}
                    lecture={report.lecture}
                    key={essay.id}
                    className="group-items-body-item"
                    textStyle={textStyle}
                />)
            )
        )
    }, [props.report.params.essays, textStyle]);

    useEffect(() => {
        const data = props.report.params;
        if(data.status === 'saved') {
            makeNotification({
                type: 'success',
                text: 'Результаты проверки успешно сохранены',
                title: 'Реультат операции'
            })
            props.report.resetState();
            props.routing.replace('/');
        }

    }, [props.report.params.status])


    const groupingGradedEssays = () => {
        switch (grouping.group_type) {
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
        return ( <EssayGroup name="Все эссе" renderedEssays={ renderedEssays } essays={report.essays} /> )
    }

    const groupBySimilarity = () => {
        const groups = {};
        const renderedGroups = {};

        const essays = report.essays;

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
        const essays = report.essays;

        for(let i = 0; i < essays.length; i++) {
            let groupName = "not_include";
            for(let label of essays[i].labels) {
                if(label.type === grouping.group_tag) {
                    groupName = "include";
                    break;
                }
            }

            groups[groupName].push(essays[i]);
            renderedGroups[groupName].push(renderedEssays[i]);
        }

        return Object.keys(groups).map(key =>
            ( <EssayGroup
                key={key}
                name={createTagGroupDescription(key)}
                essays={ groups[key]}
                renderedEssays={ renderedGroups[key] }
            /> ),
        )
    }

    const createTagGroupDescription = (key) => {
        let name = `Группа ${key === "include" ? "содержит" : "не содержит" }`;
        return (
             <div className="group-custom-header">
                 <div className="group-custom-header-name">{name}</div>
                <Tag color={convertLectureTypeToColor(grouping.group_tag)}>
                    {convertLabelToDescription({ type: grouping.group_tag})}
                </Tag>
            </div>
        )
    }

  return (
        <Base className="report">
            {
                props.report.params.status.status !== 'handled' ? (
                    <div className="report-loading">
                        <Spin tip={ props.report.textStatus } className="report-loading-indicator" size="large"/>
                    </div>
                ) : (
                    <div>
                        <div className="report-header">
                            <div className="report-header-control">
                                <EssayGroupPanel
                                    className="report-header-control-item"
                                    initialState={grouping}
                                    stateUpdated={state => setGrouping(state)}
                                />
                                <FontTunePanel
                                    className="report-header-control-item"
                                    initialState={textStyle}
                                    stateUpdated={state => setTextStyle(state)}
                                />
                                <ActionPanel
                                    className="report-header-action-item"
                                    exportHandler={() => props.report.endEvaluation()}
                                />
                            </div>
                        </div>
                        <div className="report-body">
                            {groupingGradedEssays()}
                        </div>
                        <div className="report-footer">
                        </div>
                    </div>
                )
            }
        </Base>
    )
};

export default inject('report', 'routing')(observer(index));