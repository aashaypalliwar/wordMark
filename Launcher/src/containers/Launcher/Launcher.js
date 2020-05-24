/*global chrome*/
import { clone } from 'ramda'
import React, { Component } from 'react';
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import { headingStyle, accordionStyle, textStyle, theadStyle, subHeadingStyle, categoryStyle, descriptionStyle, bodyTextStyle, breadStyle, linkStyle, HeadLinkStyle } from "./LauncherStyles";
import LauncherWMRow from "../../components/LauncherWMRow";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import LauncherBSRow from "../../components/LauncherBSRow";
import DeleteWMCategory from "../../components/DeleteWMCategory";
import DeleteBSCategory from "../../components/DeleteBSCategory";



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
        chrome.storage.sync.get("wordMark",  (wm) => {
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
            this.setState({
                wordMarkInfo: wordMarkInfo,
                wmEmpty: wmEmpty,
                wmLoad: wmLoad
            })
        });

        chrome.storage.sync.get("session", (obj) => {
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
            this.setState({
                browserStateInfo: browserStateInfo,
                bsLoad: bsLoad,
                bsEmpty: bsEmpty
            })
        });

        chrome.storage.sync.get("wmCategories", (obj) => {
            if(obj.wmCategories === null || obj.wmCategories === undefined ) {
                //alert("line46");
                wmCategoriesLoad = "loaded";
            }
            else {
                wmCategories = clone(obj.wmCategories);
                wmCategoriesLoad = "loaded";
            }
            this.setState({
                wmCategories: wmCategories,
                wmCategoriesLoad: "loaded"
            })
        });

        chrome.storage.sync.get("categories",  (obj) => {
            if(obj.categories === null || obj.categories === undefined ) {
                //alert("line46");
                bsCategoriesLoad = "loaded";
            }
            else {
                bsCategories = clone(obj.categories);
                bsCategoriesLoad = "loaded";
            }
            this.setState({
                bsCategories: bsCategories,
                bsCategoriesLoad: "loaded"
            })
        });
    }

    indirectSetState = (newState) => {
        this.setState(newState);
    }

    loading = (item) => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                <span>Loading {item}..</span>
            </Col>
        </Row>
    );

    wmCategory = (category, isNotEmpty) => (
        <Row>
            <Col md={ {span: 10, offset: 1}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                <Accordion >
                    <Card>
                        <Accordion.Toggle as={Card.Header}  eventKey="0">
                            <span style={accordionStyle}>{category}</span>
                            {!isNotEmpty ?
                                null:
                                <DeleteWMCategory category={category}  set={this.indirectSetState} appState={this.state} />
                            }
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {
                                    !isNotEmpty ?
                                        <p>No wordMarks under this category yet</p> :
                                        <>
                                        <Table responsive bordered style={{"marginTop": "0.2rem"}}>
                                            <thead style={theadStyle}>
                                            <tr>
                                                <th width="25%">Remark</th>
                                                <th width="40%">Text</th>
                                                <th width="17%">Date</th>
                                                <th width="9%">Visit</th>
                                                <th width="9%">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.wordMarkInfo[category].map( (wm, index) => {
                                                return (
                                                    <LauncherWMRow key={wm.id} wm={wm} set={this.indirectSetState} index={index} appState={this.state} wms={this.state.wordMarkInfo[category]} />
                                                );
                                            })}
                                            </tbody>
                                        </Table>
                                    </>
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
                <Accordion >
                    <Card>
                        <Accordion.Toggle as={Card.Header}  eventKey="0">
                            <span style={accordionStyle}>{category}</span>
                            {!isNotEmpty ?
                                null:
                                <DeleteBSCategory category={category} set={this.indirectSetState} appState={this.state} />
                            }
                        </Accordion.Toggle>
                        <Accordion.Collapse eventKey="0">
                            <Card.Body>
                                {
                                    !isNotEmpty ?
                                        <p>No wordMarks under this category yet</p> :
                                        <>
                                        <Table responsive bordered style={{"marginTop": "0.2rem"}}>
                                            <thead style={theadStyle}>
                                            <tr>
                                                <th width="45%">Remark</th>
                                                <th width="20%">Date</th>
                                                <th width="20%">Visit</th>
                                                <th width="15%">Delete</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.browserStateInfo[category].map( (bs, index) => {
                                                return (
                                                    <LauncherBSRow key={bs.date} bs={bs} set={this.indirectSetState} index={index} appState={this.state} bss={this.state.browserStateInfo[category]} />
                                                );
                                            })}
                                            </tbody>
                                        </Table>
                                        </>
                                }

                            </Card.Body>
                        </Accordion.Collapse>
                    </Card>
                </Accordion>
            </Col>
        </Row>
    );

    emptyPage = (item) => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                {"Your " + item + " will appear here."}
            </Col>
        </Row>
    );


    render () {
        return (
            <Container>
                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={headingStyle}>
                        WordMark Launcher
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
                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={subHeadingStyle}>
                        Browser Sessions
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
                                <Accordion >
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                            <span style={accordionStyle}>General</span>
                                            {
                                                (JSON.stringify(this.state.browserStateInfo["General"]) === "[]" || this.state.browserStateInfo["General"] === null || this.state.browserStateInfo["General"] === undefined) ?
                                                    null:
                                                    <DeleteBSCategory category="General"  set={this.indirectSetState} appState={this.state} />
                                            }

                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                {
                                                    (JSON.stringify(this.state.browserStateInfo["General"]) === "[]" || this.state.browserStateInfo["General"] === null || this.state.browserStateInfo["General"] === undefined) ?
                                                        <p>No browser sessions saved under this category yet</p> :
                                                        <>
                                                        <Table responsive bordered style={{"marginTop": "0.2rem"}}>
                                                            <thead >
                                                            <tr>
                                                                <th width="45%">Remark</th>
                                                                <th width="20%">Date</th>
                                                                <th width="20%">Visit</th>
                                                                <th width="15%">Delete</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.state.browserStateInfo["General"].map( (bs, index) => {
                                                                return (
                                                                    <LauncherBSRow key={bs.date} bs={bs} set={this.indirectSetState} index={index} appState={this.state} bss={this.state.browserStateInfo["General"]} />
                                                                );
                                                            })}
                                                            </tbody>
                                                        </Table>
                                                    </>
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

                <Row>
                    <Col md={ {span: 4, offset: 4}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={subHeadingStyle}>
                        WordMarks
                    </Col>
                </Row>

                {
                    this.state.wmLoad === "loading" ? this.loading("WordMarks") : null
                }
                {
                    ( this.state.wmEmpty && this.state.wmLoad === "loaded" && this.state.wmCategoriesLoad === "loaded")?
                        this.emptyPage("WordMarks")
                        :
                        <Row>
                            <Col md={ {span: 10, offset: 1}} lg={ {span: 10, offset: 1}} sm={ {span: 10, offset:1}}  xs={ {span: 10, offset:1}} >
                                <Accordion>
                                    <Card>
                                        <Accordion.Toggle as={Card.Header} eventKey="0">
                                            <span style={accordionStyle}>General</span>

                                            {
                                                (JSON.stringify(this.state.wordMarkInfo["General"]) === "[]" || this.state.wordMarkInfo["General"] === null || this.state.wordMarkInfo["General"] === undefined) ?
                                                null:
                                                    <DeleteWMCategory category="General"  set={this.indirectSetState} appState={this.state} />

                                            }

                                        </Accordion.Toggle>
                                        <Accordion.Collapse eventKey="0">
                                            <Card.Body>
                                                {
                                                    (JSON.stringify(this.state.wordMarkInfo["General"]) === "[]" || this.state.wordMarkInfo["General"] === null || this.state.wordMarkInfo["General"] === undefined) ?
                                                        <p>No wordMarks saved under this category yet</p> :
                                                        <>
                                                        <Table responsive bordered style={{"marginTop": "0.2rem"}}>
                                                            <thead style={theadStyle}>
                                                            <tr>
                                                                <th width="25%">Remark</th>
                                                                <th width="40%">Text</th>
                                                                <th width="17%">Date</th>
                                                                <th width="9%">Visit</th>
                                                                <th width="9%">Action</th>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            {this.state.wordMarkInfo["General"].map( (wm, index) => {
                                                                return (
                                                                    <LauncherWMRow key={wm.id} wm={wm} set={this.indirectSetState} index={index} appState={this.state} wms={this.state.wordMarkInfo["General"]} />
                                                                );
                                                            })}
                                                            </tbody>
                                                        </Table>
                                                    </>
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
