/*global chrome*/
import React, { useState, useRef } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import  Button  from "react-bootstrap/Button";
import { clone } from 'ramda';
import {headingStyle, textStyle} from "./PopupStyles";
import SuccessAlert from "./SuccessAlert";

const Popup = (props) => {
    const [ isSaving, setSaving ] = useState(false);
    const [ isClicked, setClicked ] = useState(false);
    const [ categories, setCategories ] = useState([]);
    const [ isOther, setOther ] = useState(false);
    const [ isSuccess, setSuccess ] = useState(false);
    let note = useRef();
    let category = useRef();
    let categoryOther = useRef();

    let reset = () => {
        setClicked(false);
        setSaving(false);
    }

    let getRefValue = (ref) => {
        if(ref.current === undefined || ref.current === null){
            return " ";
        }
        else{
            return ref.current.value;
        }
    }

    let categoryHandler = () => {
        if(category.current.value === "Other"){
            setOther(true);
        }
        else{
            setOther(false);
        }
    }

    let submitHandler = () => {
        if(!isClicked){
            chrome.storage.sync.get("categories", function (obj) {
                if(obj.categories !== undefined)
                    setCategories(obj.categories);
                else {
                    setCategories([]);
                }
                setClicked(true);
            });
            return;
        }
        else{
            setSaving(true);
            chrome.windows.getCurrent(function(win)
            {
                chrome.tabs.getAllInWindow(win.id, function(tabs)
                {
                    chrome.storage.sync.get("session", function (obj) {
                        let tabInfo = [];
                        for(let tab of tabs){
                            tabInfo.push(tab.url);
                        }

                        let sessionCategory;
                        if(!isOther){
                            sessionCategory = category.current.value;
                        }
                        else{
                            sessionCategory = getRefValue(categoryOther);
                        }

                        if(obj.session !== null && obj.session !== undefined){
                            let sessionNote = note.current.value;
                            if(obj.session[sessionCategory] === undefined){
                                obj.session[sessionCategory] = [];
                            }
                            obj.session[sessionCategory] = [...obj.session[sessionCategory] , {
                                note: sessionNote,
                                tabs: tabInfo,
                                date: Date.now(),
				                category: sessionCategory
                            }];
                            chrome.storage.sync.set({session: obj.session}, function () {
                                // setSaving(false);
                                // setClicked(false);
                                //alert("saved");
                                //setSuccess(true);
                            });
                        }
                        else{
                            let sessionNote = note.current.value;
                            let session = {
                                [sessionCategory]: [{
                                    note: sessionNote,
                                    tabs: tabInfo,
                                    date: Date.now(),
				                    category: sessionCategory
                                }]
                            }
                            chrome.storage.sync.set({session: session});
                        }

                        let newCategories;
                        let oldCategories = clone(categories);
                        if(isOther){
                            newCategories = [...oldCategories, sessionCategory];
                        }else{
                            newCategories = oldCategories;
                        }
                        chrome.storage.sync.set({categories: newCategories}, function () {
                            setCategories(newCategories);
                            setOther(false);
                            setSaving(false);
                            setClicked(false);
                            setSuccess(true);
                            setTimeout(function(){ setSuccess(false); }, 3000);
                        });

                    });
                });
            })
        }
    }

    let launchHandler = () => {
        chrome.tabs.create({
            url: chrome.extension.getURL('launcher.html')
        });
    }

    return (
        <Container>
            <Row>
                <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                    WordMark
                    <hr
                        style={{
                            color: "#07285c",
                            paddingTop: 0,
                            paddingBottom: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            backgroundColor: "#07285c",
                            height: 1
                        }}
                    />
                </Col>
            </Row>
            {
                isSuccess ?
                <Row>
                    <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                        <SuccessAlert dismiss={() => {setSuccess(false)}}/>
                    </Col>
                </Row> : null
            }
            {
                !isClicked ?
                    <Row>
                        <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                            Save current browser state.
                        </Col>
                    </Row> :
                    <Row>
                        <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                            <Form>
                                <Form.Group controlId="formNote">
                                    <Form.Label>Remark</Form.Label>
                                    <Form.Control autoFocus type="text" placeholder="Session Remark" maxLength={50} ref={note} />
                                </Form.Group>
                                <Form.Group controlId="dropdown">
                                    <Form.Label>Category</Form.Label>
                                    <Form.Control as="select" onChange={categoryHandler} custom ref={category} >
                                        <option>General</option>
                                        {
                                            (categories !== null || categories !== undefined) ?
                                                    categories.map((category, index) => {
                                                        return <option key={index}>{category}</option> ;
                                                    }) :null
                                        }
                                        <option>Other</option>
                                    </Form.Control>
                                </Form.Group>
                                {   isOther ?
                                    <Form.Group controlId="formCategory">
                                        <Form.Label>New Category</Form.Label>
                                        <Form.Control placeholder="New Category" maxLength={20} ref={categoryOther}/>
                                    </Form.Group> : null
                                }
                            </Form>
                        </Col>
                    </Row>

            }

            <Row>
                <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}}>
                    <Button variant="primary" outline-primary style={{ marginTop: "0.6rem", marginRight: "1rem"}} onClick={submitHandler} disabled={isSaving && isClicked}>
                        Save State
                    </Button>
                    {
                        isClicked ?
                            <Button variant="primary" style={{backgroundColor: "#07285c", marginTop: "0.6rem" }} onClick={reset} disabled={false}>
                                Cancel&nbsp;&nbsp;&nbsp;&nbsp;
                            </Button> : null
                    }

                </Col>
            </Row>
            {
                !isClicked ?
                    <>
                    <Row>
                        <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                            View and manage all saved word-marks and browser states.
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}}>
                            <Button variant="primary" style={{backgroundColor: "#07285c", marginTop: "0.6rem" }} onClick={launchHandler} type="submit" disabled={false}>
                                Launcher&nbsp;&nbsp;
                            </Button>
                        </Col>
                    </Row>
                    </> : <Row>&nbsp;</Row>
            }
            {
                isSuccess ?
                    <Row>&nbsp;</Row> : null
            }
        </Container>
    );
}

export default Popup;
