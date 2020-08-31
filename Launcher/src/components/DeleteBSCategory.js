/*global chrome*/
import React, {useState} from "react";
import { clone } from "ramda"
import PopUpAlert from "./PopUpAlert";

const DeleteBSCategory = (props) => {
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
        setLoading(true);

        let bsObj = clone(props.appState.browserStateInfo);
        let bsCategories = clone(props.appState.bsCategories);
        bsObj[props.category] = undefined;

        chrome.storage.sync.set({session : bsObj }, () => {
            if(props.category !== "General"){
                let bsIndex = bsCategories.findIndex((bsCat) => {
                    return bsCat === props.category;
                });
                bsCategories.splice(bsIndex,1);
                chrome.storage.sync.set({categories : bsCategories }, () => {
                    props.set({browserStateInfo: bsObj, bsCategories: bsCategories});
                    setLoading(false);
                    setShowDelete(false);
                })
            }
            else{
                props.set({browserStateInfo: bsObj, bsCategories: bsCategories});
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

export default DeleteBSCategory;