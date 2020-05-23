import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {categoryStyle, whiteStyle, descriptionStyle, textStyle, deleteStyle, linkStyle} from "../containers/Launcher/LauncherStyles";
import React, {useState} from "react";
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import ErrorAlert from "./ErrorAlert";
import PopUpAlert from "./PopUpAlert";
import { clone } from "ramda"

const LauncherBSRow = (props) => {
    // const [ isLoading, setLoading ] = useState(false);
    // const [ isBlacklisted, setBlacklisted ] = useState(props.user.blacklisted);
    // const [ errorStatus, setError ] = useState({
    //     isError: false,
    //     errorMessage: ""
    // })
    // const [showDelete, setShowDelete] = useState(false);
    // const handleCloseDelete = () => setShowDelete(false);
    // const handleShowDelete = () => setShowDelete(true);
    // let history = useHistory();
    //
    // let triggerDeleteModal = () => {
    //     setShowDelete(true);
    // }

    // let whiteList = () => {
    //     console.log(props.users);
    //     let users = clone(props.users);
    //     let id = props.user._id;
    //     console.log("before req");
    //     axios.put(`/api/admin/user`, { blacklisted: 0, _id: id },{ withCredentials: true } )
    //         .then((response) => {
    //             console.log(response);
    //             if(response.status === 200){
    //                 setBlacklisted(false);
    //             }
    //         }).catch((error) => {
    //         console.log(error);
    //         if (error.response) {
    //             console.log(error.response.data.message);
    //             console.log(error.response.status);
    //         }
    //     })
    // }

    // let blackList = () => {
    //     console.log(props.users);
    //     let urls = clone(props.users);
    //     let id = props.user._id;
    //     console.log("before req");
    //     axios.put(`/api/admin/user`, { blacklisted: 1, _id: id },{ withCredentials: true } )
    //         .then((response) => {
    //             console.log(response);
    //             if(response.status === 200){
    //                 setBlacklisted(true);
    //             }
    //         }).catch((error) => {
    //         console.log(error);
    //         if (error.response) {
    //             console.log(error.response.data.message);
    //             console.log(error.response.status);
    //         }
    //     })
    // }

    let viewHandler = () => {
        alert("view");
    }

    let deleteHandler = () => {
        alert("delete");
    }

    return (
        // showRow ?
        <>
            <tr>
                <td style={descriptionStyle}>{props.bs.note}</td>
                <td style={descriptionStyle}>{(new Date(props.bs.date)).toDateString()}</td>
                <td style={whiteStyle} onClick={viewHandler}>Visit</td>
                <td style={deleteStyle} onClick={deleteHandler}>Delete</td>
            </tr>
        </>
    );
}

export default LauncherBSRow;

