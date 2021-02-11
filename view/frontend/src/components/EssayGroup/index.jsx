import React, {useState, useEffect} from "react";
import cn from "classnames";
import { DownOutlined } from "@ant-design/icons";
import { Essay, Collapse } from "../../components";
import { Statistic, Row, Col, Button } from 'antd';
import "./_style.scss";


const EssayGroup = (props) => {
    const [statisticOpen, setStatisticOpen] = useState(false);
    const [itemsOpen, setItemsOpen] = useState(false);
    const [groupStatistic, setGroupStatistic] = useState({});

    useEffect(() => {
        setGroupStatistic(calculateStatistic());
    }, [props.essays]);

    const collapseHandler = (type) => {
        switch (type) {
            case 'statistic':
                setStatisticOpen(!statisticOpen);
                break;
            case 'items':
                setItemsOpen(!itemsOpen);
                break;
        }
    }

    const calculateStatistic = () => {
        const statistic = {
            "mean_letters": 0,
            "mean_words": 0,
            "mean_sentences": 0
        }

        for(let essay of props.essays) {
            statistic.mean_letters += essay.statistic.num_letters;
            statistic.mean_words += essay.statistic.num_words;
            statistic.mean_sentences += essay.statistic.num_sentences;
        }
        let count_essays = props.essays.length;

        statistic.mean_letters /= count_essays;
        statistic.mean_letters = statistic.mean_letters.toFixed(1);
        statistic.mean_words /= count_essays;
        statistic.mean_words = statistic.mean_words.toFixed(1);
        statistic.mean_sentences /= count_essays;
        statistic.mean_sentences = statistic.mean_sentences.toFixed(1);

        return statistic;
    }

    return (
        <div className={cn("group", props.className)} key={props.key}>
            <div className={cn("group-description", "block-header")}>
               <div className="group-description-text">
                   {props.name}
                </div>
            </div>
            <div className={cn("group-statistic")}>
                 <div
                     className={cn("group-statistic-header")}
                     onClick={() => collapseHandler("statistic")}
                 >
                    <div className={cn("group-statistic-header-text")}>Статистика</div>
                    <div className={cn("flex-separator")}/>
                    <DownOutlined
                        className={cn("group-collapse-icon", {"group-collapse-icon--open": statisticOpen})}
                    />
                </div>
                <Collapse
                    className={cn("group-statistic-body")}
                    isOpened={statisticOpen}
                >
                   <Row justify="space-between">
                       <Col span={6} precision={1}>
                            <Statistic title="Среднее количество символов" value={groupStatistic.mean_letters} />
                       </Col>
                       <Col span={6} precision={1}>
                            <Statistic title="Среднее количество слов" value={groupStatistic.mean_words} />
                       </Col>
                       <Col span={6} precision={1}>
                            <Statistic title="Среднее количество предложений" value={groupStatistic.mean_sentences} />
                       </Col>
                   </Row>
                </Collapse>
            </div>
            <div className={cn("group-items")}>
                <div className={cn("group-items-header")} onClick={() => collapseHandler("items")}>
                    <div className={cn("group-items-header-text")}>{`Всего: ${props.essays.length}`}</div>
                    <div className={cn("flex-separator")}/>
                    <DownOutlined
                        className={cn("group-collapse-icon", {"group-collapse-icon--open": itemsOpen})}
                    />
                </div>
                <Collapse
                    className={cn("group-items-body")}
                    isOpened={itemsOpen}
                >
                    {props.renderedEssays}
                </Collapse>
            </div>
        </div>
    )
}


export default EssayGroup;
