import React, {useContext} from "react";
import { Base, DocumentUpload, Button } from "../../components";
import './_style.scss';
import {observer, inject} from "mobx-react";

const Index = (props) =>  {
    const { replace } = props.routing;
    const report = props.report;

    const onSendReportHandler = (e) => {
        window.socket.on('changed-report-status', (json_data) => {
           console.log(`change status ${json_data}`);
           const object_data = JSON.parse(json_data);
           report.updateStatus(object_data.status);
       });

        if(report.startEvaluation()) {
            replace('/report');
        }
    }

    return (
        <Base className="upload">
            <div className="upload-title">Загрузите данные для проверки</div>
            <form className="upload-form">
                <DocumentUpload
                    className="upload-form-file"
                    description="Презентация с текстом лекции в формате pptx"
                    selectFile={(file) => report.selectLecture(file)}
                    accept=".pptx"
                />

                <DocumentUpload
                    className="upload-form-file"
                    description="Таблица с эссе в формате xlsx"
                    selectFile={(file) => report.selectEssays(file)}
                    accept=".csv,.xlsx"
                />

                <Button
                    className="upload-form-send-button"
                    clickHandler={onSendReportHandler}
                    name="Начать проверку"
                />
            </form>
        </Base>
    )
};

export default  inject('report', 'routing')(observer(Index));