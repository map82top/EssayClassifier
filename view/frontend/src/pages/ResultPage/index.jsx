import React, {useState, useEffect} from "react";
import { Base, ComboBox, Essay, EssayGroup } from "../../components";
import { Spin } from 'antd';
import './_style.scss';
import {inject, observer} from "mobx-react";

const index = (props) => {
    const report = props.report.params;

    const options = [
        { key: "none", text: "Нет"},
        { key: "similarity", text: "По подобию"},
    ]

    const groupingGradedEssays = () => {
        switch (report.groupType) {
            case "none":
                return createSingleList();
            case "similarity":
                return groupBySimilarity();
            default:
                throw new Error("Not supported type");
        }
    }

    const createSingleList = () => {
        return ( <EssayGroup name="Все эссе" essays={ report.gradedEssays} lecture={report.lecture} className="main-list"/> )
    }

    const groupBySimilarity = () => {
        const groups = {};

        for(let essay of report.gradedEssays) {
            let group = groups[essay.group];
            if(group) {
                group.push(essay);
            } else {
               groups[essay.group] = [essay];
            }
        }

        return Object.keys(groups).map(key => {
            return ( <EssayGroup key={key} name={`Группа подобия ${key}`} essays={ groups[key]} lecture={report.lecture} className="main-list"/>)
        });
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
                                <ComboBox options={options} description="Группировать по" updateValueHandler={(value) => props.report.setGroupType(value) }/>
                            </div>
                        </div>
                        <div className="report-body">
                            { groupingGradedEssays() }
                        </div>
                    </div>
                )
            }
        </Base>
    )
};

export default inject(['report'])(observer(index));