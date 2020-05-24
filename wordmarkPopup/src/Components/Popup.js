/*global chrome*/
/*global id*/
import React, { useState, useRef } from "react";
import { Col, Container, Row, Form } from "react-bootstrap";
import  Button  from "react-bootstrap/Button";
import { clone } from 'ramda';
import {headingStyle, textStyle} from "./PopupStyles";
import SuccessAlert from "./SuccessAlert";

const Popup = (props) => {
    const [ isSaving, setSaving ] = useState(false);
    const [ categories, setCategories ] = useState([]);
    const [isSynced, setSync] =useState(false);
    const [isSuccess, setSuccess] =useState(false);

    if(!isSynced){
        chrome.storage.sync.get("wmCategories", function (object) {
            let obj = clone(object);
            if(obj.wmCategories === null || obj.wmCategories === undefined){
                obj.wmCategories = [];
            }
            setCategories(obj.wmCategories);
            setSync(true);
        });
    }


    const [ isOther, setOther ] = useState(false);
    let note = useRef();
    let category = useRef();
    let categoryOther = useRef();

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

    let storeNewCategory = (sessionCategory) => {
        let newCategories = clone(categories);
        newCategories = [...newCategories, sessionCategory]
        setCategories(newCategories);
        chrome.storage.sync.get("wmCategories", function (object) {
            let obj = clone(object);
            if(obj.wmCategories === null || obj.wmCategories === undefined){
                obj.wmCategories = [];
            }
            obj.wmCategories = [...obj.wmCategories, sessionCategory];
            chrome.storage.sync.set({wmCategories: obj.wmCategories}, function () {
                //alert("Saved in store");
            });
        });
    }

    let submitHandler = () => {
        setSaving(true);
        chrome.storage.sync.get("temporary", function (obj) {
            if(obj.temporary === null || obj.temporary === undefined){
                window.close();
            }else{
                //alert("line54");
                //alert(JSON.stringify(obj));
                let { id, path, text, url, time } = obj.temporary;
                let sessionNote = note.current.value;
                let sessionCategory;
                if(!isOther){
                    sessionCategory = category.current.value;
                }
                else{
                    sessionCategory = getRefValue(categoryOther);
                    //alert(sessionCategory);
                }
                //alert("line65");

                let finalEntry = {
                    id: id,
                    path: path,
                    url: url,
                    text: text,
                    time: time,
                    category: sessionCategory,
                    note: sessionNote
                }

                //alert(JSON.stringify(finalEntry));


                chrome.storage.sync.get("wordMark", function (wm) {
                    if(wm.wordMark === null || wm.wordMark === undefined){
                        //alert("line89")
                        // alert(JSON.stringify({
                        //     wordMark : {
                        //         [sessionCategory] : [finalEntry]
                        //     }
                        // }))
                        chrome.storage.sync.set({ wordMark: {
                                [sessionCategory] : [finalEntry]
                            }}, function () {
                            //alert("first save");
                            if(isOther){
                                //alert("line106 inside isother printing categories");
                                //alert(JSON.stringify(categories));
                                storeNewCategory(sessionCategory);
                            }
                        })
                    }
                    else {
                        let newObj = clone(wm.wordMark);
                        if (newObj[sessionCategory] === null || newObj[sessionCategory] === undefined) {
                            newObj[sessionCategory] = [];
                        }
                        //alert("line92");
                        //alert(JSON.stringify(newObj));

                        newObj[sessionCategory] = [...newObj[sessionCategory], finalEntry];
                        //alert("line96");
                        //alert(JSON.stringify(newObj));
                        chrome.storage.sync.set({
                            wordMark: newObj
                        }, function () {
                            //alert("first not save");
                            if(isOther){
                                //alert("line106 inside isother printing categories");
                                //alert(JSON.stringify(categories));
                                storeNewCategory(sessionCategory);
                            }
                        })
                    }

                })

                setSaving(false);
                note.current.value = "";
                setOther(false);
                setSuccess(true);
            }
        })
    }

    let closeHandler = () => {
        window.close();
    }

    let form = () => (
        <>
            <Row>
                <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                    Save this as a WordMark
                </Col>
            </Row>
            <Row>
                <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                    <Form>
                        <Form.Group controlId="formRemark">
                            <Form.Label>Remark</Form.Label>
                            <Form.Control type="text" placeholder="WordMark Remark" maxLength={50} ref={note} />
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
            <Row>
                <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}}>
                    <Button variant="primary" outline-primary style={{ marginTop: "0.6rem", marginRight: "1rem"}} onClick={submitHandler} disabled={isSaving}>
                        Save
                    </Button>

                    <Button variant="primary" style={{backgroundColor: "#07285c", marginTop: "0.6rem" }} onClick={closeHandler} disabled={false}>
                        Cancel
                    </Button>
                    <Row>&nbsp;</Row>
                </Col>
            </Row>
        </>
    );

    return (
        <Container>
            <Row>
                <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                    WordMark - Save the Word
                    <hr
                        style={{
                            color: "#07285c",
                            paddingTop: 0,
                            paddingBottom: 0,
                            marginTop: 0,
                            marginBottom: 0,
                            backgroundColor: "#07285c",
                            height: 2
                        }}
                    />
                </Col>
            </Row>
            {
                isSuccess ?
                    <Row>
                        <Col sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                            <SuccessAlert dismiss={() => {window.close()}}/>
                        </Col>
                    </Row> : form()
            }
        </Container>
    );
}

export default Popup;
