/*global chrome*/
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {categoryStyle, whiteStyle, descriptionStyle, textStyle, deleteStyle, linkStyle} from "../containers/Launcher/LauncherStyles";
import React, {useState} from "react";
import { clone } from "ramda"
import PopUpAlert from "./PopUpAlert";

const LauncherWMRow = (props) => {
    const [ isLoading, setLoading ] = useState(false);
    const [ errorStatus, setError ] = useState({
        isError: false,
        errorMessage: ""
    })
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    let triggerDeleteModal = () => {
        setShowDelete(true);
    }

    let viewHandler = () => {
        alert("view");
    }

    let deleteHandler = () => {
        //alert("delete");
        setLoading(true);

        let wms = clone(props.wms);
        let index = wms.findIndex((wm) => {
            return wm.id === props.wm.id;
        });
        wms.splice(index,1);
        let wmObj = clone(props.appState.wordMarkInfo);
        let wmCategories = clone(props.appState.wmCategories);
        wmObj[props.wm.category] = wms;
        alert(JSON.stringify(wmObj));
        alert(JSON.stringify(wms));
        alert(JSON.stringify(props.wm));
        alert(JSON.stringify(props.appState));

        chrome.storage.sync.set({wordMark : wmObj }, () => {
            if(props.wm.category !== "General" && JSON.stringify(wms) === "[]"){
                let wmIndex = wmCategories.findIndex((wmCat) => {
                    return wmCat === props.wm.category;
                });
                wmCategories.splice(wmIndex,1);
                chrome.storage.sync.set({wmCategories : wmCategories }, () => {
                    props.set({wordMarkInfo: wmObj, wmCategories: wmCategories});
                    setLoading(false);
                    setShowDelete(false);
                })
            }
            else{
                props.set({wordMarkInfo: wmObj, wmCategories: wmCategories});
                setLoading(false);
                setShowDelete(false);
            }
        });
    }

    return (
        <>
            <tr>
                <td style={descriptionStyle}>{props.wm.note}</td>
                <td style={descriptionStyle}>{
                    props.wm.text.length <= 20 ?
                    props.wm.text : props.wm.text.substring(0,20) + ".."}</td>
                <td style={descriptionStyle}>{(new Date(props.wm.time)).toDateString()}</td>
                <td style={whiteStyle} onClick={viewHandler}>Visit</td>
                <td style={deleteStyle} onClick={deleteHandler}>Delete</td>

            </tr>
            {
                showDelete? <PopUpAlert
                    show={showDelete}
                    isLoading={isLoading}
                    handleClose={handleCloseDelete}
                    variant="danger"
                    fireFunction={deleteHandler}
                    buttonToTrigger="Delete"
                    heading={"Delete WordMark"}
                    body={ errorStatus.isError ? errorStatus.errorMessage : "Are you sure you want to delete ?"}
                /> : null
            }
        </>
    );
}

export default LauncherWMRow;

