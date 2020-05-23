/*global chrome*/
import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {categoryStyle, whiteStyle, descriptionStyle, textStyle, deleteStyle, linkStyle} from "../containers/Launcher/LauncherStyles";
import React, {useState} from "react";
import { clone } from "ramda"
import PopUpAlert from "./PopUpAlert";

const DeleteWMCategory = (props) => {
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

    /*
    * category
    * set
    * appState
    * */

    let deleteHandler = () => {
        //alert("delete");
        setLoading(true);

        let wmObj = clone(props.appState.wordMarkInfo);
        let wmCategories = clone(props.appState.wmCategories);
        wmObj[props.category] = undefined;
        // alert(JSON.stringify(wmObj));
        // alert(JSON.stringify(wms));
        // alert(JSON.stringify(props.wm));
        // alert(JSON.stringify(props.appState));

        chrome.storage.sync.set({wordMark : wmObj }, () => {
            if(props.category !== "General"){
                let wmIndex = wmCategories.findIndex((wmCat) => {
                    return wmCat === props.category;
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
            {/*<Button variant="danger" size="sm" disabled={isLoading} onClick={triggerDeleteModal}>*/}
            {/*    Delete Category*/}
            {/*</Button>*/}
            <svg className="deleteAll" width="1.1rem" height="1.1rem" viewBox="0 0 1024 1024" onClick={triggerDeleteModal}>
                <path d="M192 1024h640l64-704h-768zM640 128v-128h-256v128h-320v192l64-64h768l64 64v-192h-320zM576 128h-128v-64h128v64z"/>
            </svg>

            {
                showDelete? <PopUpAlert
                    show={showDelete}
                    isLoading={isLoading}
                    handleClose={handleCloseDelete}
                    variant="danger"
                    fireFunction={deleteHandler}
                    buttonToTrigger="Delete"
                    heading={"Delete Category"}
                    body={ errorStatus.isError ? errorStatus.errorMessage : "Are you sure you want to delete this category?"}
                /> : null
            }
        </>
    );
}

export default DeleteWMCategory;

