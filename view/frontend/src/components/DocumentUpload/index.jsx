import React, {useRef, useState} from "react";
import "./DocumentUpload.scss";
import {Button} from "antd";
import {InboxOutlined, FileOutlined, DeleteOutlined} from "@ant-design/icons";
import {action, observable} from "mobx";
const DocumentUpload = (props) => {
    const [selected, setSelected] = useState(false);
    const [fileName, setFileName] = useState(null);
    const uploadInput = useRef();

    const selectFileHandler = (e) => {
        props.selectFile(e.target.files[0]);
        setFileName(e.target.files[0].name);
        setSelected(true);
    }

    const handlerClickOnElement = () => {
        uploadInput && uploadInput.current.click();
    }

    const deleteItemHandler = (e) => {
        setSelected(false);
        setFileName(null);
        props.selectFile(null);
    }

    return (
            <div>
                {
                    !selected ? (
                        <div className="upload-element" onClick={handlerClickOnElement}>
                            <input
                                type="file"
                                style={{display: 'none'}}
                                onChange={selectFileHandler}
                                ref={uploadInput}
                                accept={props.accept}
                            />
                            <p className="upload-element-icon">
                                <InboxOutlined />
                            </p>
                            <p className="upload-element-description">Нажмите или перетащите файл в это окно для загрузки</p>
                        </div>
                    ) : (
                        <div className="upload-item">
                            <div className="upload-item-description">
                                <FileOutlined className="upload-item-description-icon"/>
                                <p className="upload-item-description-name">{fileName}</p>
                            </div>
                            <div className="upload-item-unvisible"></div>

                            <Button
                                className="upload-item-delete"
                                onClick={deleteItemHandler}
                                icon={<DeleteOutlined />}
                            />
                        </div>
                    )
                }

            </div>
    )
};

export default DocumentUpload;