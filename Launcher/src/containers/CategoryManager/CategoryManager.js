/*global chrome*/
import { clone } from 'ramda'
import React, { Component } from 'react';
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import { headingStyle, textStyle, theadStyle, categoryStyle, descriptionStyle, bodyTextStyle, breadStyle, linkStyle, HeadLinkStyle } from "./LauncherStyles";
import LauncherWMRow from "../../components/LauncherWMRow";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import LauncherBSRow from "../../components/LauncherBSRow";



class Launcher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            browserStateInfo: {},
            wordMarkInfo: {},
            bsLoad: "loading",
            bsEmpty: false,
            wmEmpty: false,
            wmLoad: "loading",
            wmCategoriesLoad: "loading",
            bsCategoriesLoad: "loading",
            wmCategories: [],
            bsCategories: []
        }
        console.log("categurlconstructor worked");
        console.log("printing state", this.state);
    }


    componentDidMount() {
        let browserStateInfo= {};
        let wordMarkInfo = {};
        let bsLoad = "loading";
        let bsEmpty = false;
        let wmEmpty = false;
        let wmLoad = "loading";
        let wmCategoriesLoad = "loading";
        let bsCategoriesLoad = "loading";
        let wmCategories = [];
        let bsCategories = [];
        chrome.storage.sync.get("wordMark", function (wm) {
            if(wm.wordMark === null || wm.wordMark === undefined) {
                //alert("line28");
                wmEmpty = true;
                wmLoad = "loaded";
            }
            else{
                let wmInfo = clone(wm.wordMark);
                wordMarkInfo = wmInfo;
                wmLoad = "loaded";
            }
            chrome.storage.sync.get("session", function (obj) {
                if(obj.session === null || obj.session === undefined ) {
                    //alert("line46");
                    bsEmpty = true;
                    bsLoad = "loaded";
                }
                else {
                    let bsInfo = clone(obj.session);
                    browserStateInfo = bsInfo;
                    bsLoad = "loaded";
                }
                chrome.storage.sync.get("wmCategories", function (obj) {
                    if(obj.wmCategories === null || obj.wmCategories === undefined ) {
                        alert("line46");
                        wmCategoriesLoad = "loaded";
                    }
                    else {
                        wmCategories = clone(obj.wmCategories);
                        wmCategoriesLoad = "loaded";
                    }
                    chrome.storage.sync.get("categories", function (obj) {
                        if(obj.categories === null || obj.categories === undefined ) {
                            alert("line46");
                            bsCategoriesLoad = "loaded";
                        }
                        else {
                            bsCategories = clone(obj.categories);
                            bsCategoriesLoad = "loaded";
                        }
                        this.setState({
                            bsCategories: bsCategories,
                            bsCategoriesLoad: "loaded",
                            wmCategories: wmCategories,
                            wmCategoriesLoad: "loaded",
                            browserStateInfo: browserStateInfo,
                            bsLoad: bsLoad,
                            bsEmpty: bsEmpty,
                            wordMarkInfo: wordMarkInfo,
                            wmEmpty: wmEmpty,
                            wmLoad: wmLoad
                        })
                    });
                });
            });
        });







        // console.log("inside cdm");
        // console.log("printing state", this.state);
        // axios.get('/api/admin/users', { withCredentials: true})
        //     .then((response) => {
        //         if(response.status === 200){
        //             console.log(response);
        //             console.log("fetched user info")
        //             this.setState({userInfo: response.data.allUsers, userLoad: "loaded"})
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         console.log("Couldnot fetch user data")
        //     })
        // axios.get('/api/admin/suborgs', { withCredentials: true})
        //     .then((response) => {
        //         if(response.status === 200){
        //             console.log(response);
        //             console.log("fetched  suborgs info")
        //             this.setState({suborgInfo: response.data.allSuborgs, suborgLoad: "loaded"})
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         //throw error
        //         console.log("Couldnot fetch suborg data")
        //     })
        // axios.get('/api/admin/urls', { withCredentials: true})
        //     .then((response) => {
        //         if(response.status === 200){
        //             console.log(response);
        //             console.log("fetched  url info")
        //             this.setState({URLInfo: response.data.allURLs, URLLoad: "loaded"})
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //         //throw error
        //         console.log("Couldnot fetch url data")
        //     })
    }

    indirectSetState = (newState) => {
        this.setState(newState);
    }

    displayState = () => console.log(this.state);

    loading = (item) => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                <span>Loading {item}..</span>
            </Col>
        </Row>
    );

    wmCategory = (category, isNotEmpty) => (
        <Row>
            <Col md={ {span: 10, offset: 1}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} style={{"cursor": "pointer"}} eventKey="0">
                            {category}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {
                                    !isNotEmpty ?
                                        <p>No wordMarks under this category yet</p> :
                                        <Table responsive bordered style={{"marginTop": "1rem"}}>
                                            <thead style={theadStyle}>
                                            <tr>
                                                <th>Note</th>
                                                <th>Text</th>
                                                <th>Date</th>
                                                <th>Visit</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.wordMarkInfo[category].map( (wm, index) => {
                                                return (
                                                    <LauncherWMRow key={wm.id} wm={wm} set={this.indirectSetState} index={index} wms={this.state.wordMarkInfo[category]} />
                                                );
                                            })}
                                            </tbody>
                                        </Table>
                                }
                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Col>
        </Row>
    );

    bsCategory = (category, isNotEmpty) => (
        <Row>
            <Col md={ {span: 10, offset: 1}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                <Accordion defaultActiveKey="0">
                    <Card>
                        <Accordion.Toggle as={Card.Header} style={{"cursor": "pointer"}} eventKey="0">
                            {category}
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {
                                    !isNotEmpty ?
                                        <p>No wordMarks under this category yet</p> :
                                        <Table responsive bordered style={{"marginTop": "1rem"}}>
                                            <thead style={theadStyle}>
                                            <tr>
                                                <th>Note</th>
                                                <th>Date</th>
                                                <th>Visit</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.browserStateInfo[category].map( (bs, index) => {
                                                return (
                                                    <LauncherBSRow key={bs.date} bs={bs} set={this.indirectSetState} index={index} bss={this.state.browserStateInfo[category]} />
                                                );
                                            })}
                                            </tbody>
                                        </Table>
                                }

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Col>
        </Row>
    );

    // wmTable = () => {
    //     let wmInfo = clone(this.state.wordMarkInfo);
    //     for (let category in wmInfo) {
    //         if (Object.prototype.hasOwnProperty.call(wmInfo, category)) {
    //
    //         }
    //     }
    // }
    //
    // bsTable = () => {
    //
    // }

    emptyPage = (item) => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                {"Your " + item + " will appear here."}
            </Col>
        </Row>
    );


    render () {
        return (
            <Container>
                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                        WordMark Launcher
                    </Col>
                </Row>

                {
                    this.state.bsLoad === "loading" ? this.loading("Browser States") : null
                }
                {
                    ( this.state.bsEmpty && this.state.bsLoad === "loaded" && this.state.bsCategoriesLoad === "loaded")?
                        this.emptyPage("Browser States")
                        :
                        <Row>
                            <Col md={ {span: 10, offset: 1}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                                <Accordion defaultActiveKey="0">
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} style={{"cursor": "pointer"}} eventKey="0">
                                            General
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                {
                                                    (JSON.stringify(this.state.browserStateInfo["General"]) === "[]" || this.state.browserStateInfo["General"] === null || this.state.browserStateInfo["General"] === undefined) ?
                                                        <p>No browser sessions saved under this category yet</p> :
                                                        <Table responsive bordered style={{"marginTop": "1rem"}}>
                                                            <thead style={theadStyle}>
                                                            <tr>
                                                                <th>Note</th>
                                                                <th>Date</th>
                                                                <th>Visit</th>
                                                                <th>Delete</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.state.browserStateInfo["General"].map( (bs, index) => {
                                                                return (
                                                                    <LauncherBSRow key={bs.date} bs={bs} set={this.indirectSetState} index={index} bss={this.state.browserStateInfo["General"]} />
                                                                );
                                                            })}
                                                            </tbody>
                                                        </Table>
                                                }
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </Col>
                        </Row>
                }
                {
                    (!this.state.bsEmpty && this.state.bsLoad === "loaded" && this.state.bsCategoriesLoad === "loaded")?
                        this.state.bsCategories.map((bs, index) => {
                            if(Object.prototype.hasOwnProperty.call(this.state.browserStateInfo, bs)){
                                return (this.bsCategory(bs, this.state.browserStateInfo[bs].length) )
                            }
                            else return null;
                        })
                        : null
                }

                {
                    this.state.wmLoad === "loading" ? this.loading("WordMarks") : null
                }
                {
                    ( this.state.wmEmpty && this.state.wmLoad === "loaded" && this.state.wmCategoriesLoad === "loaded")?
                        this.emptyPage("WordMarks")
                        :
                        <Row>
                            <Col md={ {span: 10, offset: 1}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                                <Accordion defaultActiveKey="0">
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} style={{"cursor": "pointer"}} eventKey="0">
                                            General
                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                {
                                                    (JSON.stringify(this.state.wordMarkInfo["General"]) === "[]" || this.state.wordMarkInfo["General"] === null || this.state.wordMarkInfo["General"] === undefined) ?
                                                        <p>No wordMarks saved under this category yet</p> :
                                                        <Table responsive bordered style={{"marginTop": "1rem"}}>
                                                            <thead style={theadStyle}>
                                                            <tr>
                                                                <th>Note</th>
                                                                <th>Text</th>
                                                                <th>Date</th>
                                                                <th>Visit</th>
                                                                <th>Action</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.state.wordMarkInfo["General"].map( (wm, index) => {
                                                                return (
                                                                    <LauncherWMRow key={wm.id} wm={wm} set={this.indirectSetState} index={index} wms={this.state.wordMarkInfo["General"]} />
                                                                );
                                                            })}
                                                            </tbody>
                                                        </Table>
                                                }
                                            </Card.Body>
                                        </Accordion.Collapse>
                                    </Card>
                                </Accordion>
                            </Col>
                        </Row>
                }
                {
                    (!this.state.wmEmpty && this.state.wmLoad === "loaded" && this.state.wmCategoriesLoad === "loaded")?
                        this.state.wmCategories.map((wm, index) => {
                            if(Object.prototype.hasOwnProperty.call(this.state.wordMarkInfo, wm)){
                                return  this.wmCategory(wm, this.state.wordMarkInfo[wm].length)
                            }
                            else return null;
                        })
                        : null
                }

            </Container>
        );
    }
}


export default Launcher;
