import React, {useContext} from "react";
import { Base, DocumentUpload } from "../../components";
import { Button } from 'antd';
import './UploadPage.scss';
import {observer, inject} from "mobx-react";

const UploadPage = (props) =>  {
    const { replace } = props.routing;
    const report = props.report;

    const onSendReportHandler = (e) => {
        window.socket.on('changed-report-status', (json_data) => {
           console.log(`change status ${json_data}`);
           const object_data = JSON.parse(json_data);
           report.updateStatus(object_data.status);
       });

        replace('/report')
        report.sendOnEvaluation();
    }

    return (
        <Base className="upload-page-body">
            <p className="title">Загрузите данные для проверки</p>
            <p className="upload-description">Загрузите презентацию с текстом лекции в формате pptx</p>

            <DocumentUpload
                selectFile={(file) => report.selectLecture(file)}
                accept=".pptx"
            />

            <p className="upload-description">Загрузите таблицу с эссе</p>

            <DocumentUpload
                selectFile={(file) => report.selectEssays(file)}
                accept=".csv,.xlsx"
            />
            <Button type="primary" onClick={onSendReportHandler} style={{margin: '3%'}}>Начать проверку</Button>
        </Base>
    )
};

export default  inject('report', 'routing')(observer(UploadPage));