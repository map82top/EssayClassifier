import React, {useState, useRef} from "react";
import cn from "classnames";
import { DownOutlined } from "@ant-design/icons";
import { Essay, Glass } from "../../components";
import {collapseVertical, expandVertical, collapseHorizontal, expandHorizontal} from "../../utils";
import "./EssayGroup.scss";


const EssayGroup = ({essays, lecture, className}) => {
    const [statisticOpen, setStatisticOpen] = useState(false);
    const [itemsOpen, setItemsOpen] = useState(false);
    const collapseStatisticBody = useRef();
    const collapseItemsBody = useRef();

    const collapseHandler = (type) => {
        switch (type) {
            case 'statistic':
                if(!statisticOpen) {
                    expandVertical(collapseStatisticBody.current);
                } else {
                    collapseVertical(collapseStatisticBody.current);
                }
                setStatisticOpen(!statisticOpen);
                break;
            case 'items':
                if(!itemsOpen) {
                    expandVertical(collapseItemsBody.current);
                } else {
                    collapseVertical(collapseItemsBody.current);
                }
                setItemsOpen(!itemsOpen);
                break;
        }
    }

    return (
        <div className={cn("group", className)}>
            <div className={cn("group-description", "block-header")}>
               <div className="group-description-text">
                    Группа 1
                </div>
            </div>
            <div className={cn("group-statistic")}>
                 <div
                     className={cn("group-statistic-header", "block-header")}
                     onClick={() => collapseHandler("statistic")}
                 >
                    <div className={cn("group-statistic-header-text")}>Статистика</div>
                    <div className={cn("block-header-separator")}/>
                    <DownOutlined
                        className={cn("group-collapse-icon", {"group-collapse-icon--open": statisticOpen})}
                    />
                </div>
                <div className={cn("group-statistic-body")} ref={collapseStatisticBody}>
                    <div className={cn("group-statistic-body-text")}>В разработке</div>
                </div>
            </div>
            <div className={cn("group-items")}>
                <div className={cn("group-items-header", "block-header")} onClick={() => collapseHandler("items")}>
                    <div className={cn("group-items-header-text")}>{`Всего: ${essays.length}`}</div>
                    <div className={cn("block-header-separator")}/>
                    <DownOutlined
                        className={cn("group-collapse-icon", {"group-collapse-icon--open": itemsOpen})}
                    />
                </div>
                <div className={cn("group-items-body", {"group-items-body--open": itemsOpen})} ref={collapseItemsBody}>
                    {   essays.map(essay => (
                            <div key={essay.key} className={cn("group-item")}>
                                <Essay essay={essay} lecture={lecture}/>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}


export default EssayGroup;
