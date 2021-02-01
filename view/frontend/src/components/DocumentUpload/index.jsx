import React, {useRef, useState} from "react";
import "./_style.scss";
import {Button} from "antd";
import {InboxOutlined, FileOutlined, DeleteOutlined} from "@ant-design/icons";
import cn from "classnames";

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
            <div className={cn("upload-input", props.className)}>
                {
                    props.description ? (
                        <p className="upload-input-title">{props.description}</p>
                    )   : ''
                }
                {
                    !selected ? (
                        <div className="upload-input-element" onClick={handlerClickOnElement}>
                            <input
                                type="file"
                                style={{display: 'none'}}
                                onChange={selectFileHandler}
                                ref={uploadInput}
                                accept={props.accept}
                            />
                            <p className="upload-input-element-icon">
                                <InboxOutlined />
                            </p>
                            <p className="upload-input-element-tip">Нажмите или перетащите файл в это окно для загрузки</p>
                        </div>
                    ) : (
                        <div className="upload-input-file">
                            <div className="upload-input-file-description">
                                <FileOutlined className="upload-input-file-description-icon"/>
                                <p className="upload-input-file-description-name">{fileName}</p>
                            </div>
                            <div className="flex-separator"/>

                            <Button
                                className="upload-input-file-delete"
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