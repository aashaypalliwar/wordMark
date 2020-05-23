/*global chrome*/
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {categoryStyle, whiteStyle, descriptionStyle, textStyle, deleteStyle, linkStyle} from "../containers/Launcher/LauncherStyles";
import React, {useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorAlert from "./ErrorAlert";
import PopUpAlert from "./PopUpAlert";
import { clone } from "ramda"

const LauncherBSRow = (props) => {
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

        let bss = clone(props.bss);
        let index = bss.findIndex((bs) => {
            return bs.note === props.bs.note;
        });
        bss.splice(index,1);
        let sessionObj = clone(props.appState.browserStateInfo);
        let bsCategories = clone(props.appState.bsCategories);
        sessionObj[props.bs.category] = bss;
        alert(JSON.stringify(sessionObj));
        alert(JSON.stringify(bss));
        alert(JSON.stringify(props.bs));
        alert(JSON.stringify(props.appState));

        chrome.storage.sync.set({session : sessionObj }, () => {
            if(props.bs.category !== "General" && JSON.stringify(bss) === "[]"){
                let bsIndex = bsCategories.findIndex((bsCat) => {
                    return bsCat === props.bs.category;
                });
                bsCategories.splice(bsIndex,1);
                chrome.storage.sync.set({categories : bsCategories }, () => {
                    props.set({browserStateInfo: sessionObj, bsCategories: bsCategories});
                    setLoading(false);
                    setShowDelete(false);
                })
            }
            else{
                props.set({browserStateInfo: sessionObj, bsCategories: bsCategories});
                setLoading(false);
                setShowDelete(false);
            }
        });
    }

    return (
        // showRow ?
        <>
            <tr>
                <td style={descriptionStyle}>{props.bs.note}</td>
                <td style={descriptionStyle}>{(new Date(props.bs.date)).toDateString()}</td>
                <td style={whiteStyle} onClick={viewHandler}>Visit</td>
                <td style={deleteStyle} onClick={triggerDeleteModal}>Delete</td>
            </tr>
            {
                showDelete? <PopUpAlert
                    show={showDelete}
                    isLoading={isLoading}
                    handleClose={handleCloseDelete}
                    variant="danger"
                    fireFunction={deleteHandler}
                    buttonToTrigger="Delete"
                    heading={"Delete Browser Session"}
                    body={ errorStatus.isError ? errorStatus.errorMessage : "Are you sure you want to delete ?"}
                /> : null
            }
        </>
    );
}

export default LauncherBSRow;

