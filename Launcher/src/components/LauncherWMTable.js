/*global chrome*/
import { clone } from 'ramda'
import React, { Component } from 'react';
import {Button, Col, Container, Form, Row, Table} from "react-bootstrap";
import { headingStyle, textStyle, theadStyle, categoryStyle, descriptionStyle, bodyTextStyle, breadStyle, linkStyle, HeadLinkStyle } from "../containers/Launcher/LauncherStyles";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import LauncherWMRow from "./LauncherWMRow";



const LauncherWMTable = (props) => {
    let loading = (item) => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                <span onClick={this.displayState}>Loading {item}..</span>
            </Col>
        </Row>
    );

    let goBack = () => {
        console.log("trying to go back");
        this.props.history.replace('/');
    }

    let wmCategory = (category, isEmpty) => (
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
                                    isEmpty ?
                                        <p>No wordMarks under this category yet</p> :
                                        <Table responsive bordered style={{"marginTop": "1rem"}}>
                                            <thead style={theadStyle}>
                                            <tr>
                                                <th>Sr. No.</th>
                                                <th>Note</th>
                                                <th>Text</th>
                                                <th>Date</th>
                                                <th>Visit</th>
                                                <th>Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {props.appState.wordMarkInfo[category].map( (wm, index) => {
                                                return (
                                                    <LauncherWMRow key={wm.id} wm={wm} set={this.indirectSetState} index={index} wms={props.appState.wordMarkInfo[category]} />
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


    let wmTable = () => {
        let wmInfo = clone(props.appState.wordMarkInfo);
        for (let category in wmInfo) {
            if (Object.prototype.hasOwnProperty.call(wmInfo, category)) {

            }
        }
    }

    let emptyPage = (item) => (
        <Row>
            <Col md={ {span: 4, offset: 4}} lg={ {span: 6, offset: 3}} sm={ {span: 10, offset:1}} xs={ {span: 10, offset:1}} style={textStyle}>
                {"You don't have any " + item + " yet."}
            </Col>
        </Row>
    );

    return (
        <>
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
                                        (JSON.stringify(props.appState.wordMarkInfo["General"]) === "[]" || props.appState.wordMarkInfo["General"] === null || props.appState.wordMarkInfo["General"] === undefined) ?
                                            <p>No wordMarks under this category yet</p> :
                                            <Table responsive bordered style={{"marginTop": "1rem"}}>
                                                <thead style={theadStyle}>
                                                <tr>
                                                    <th>Sr. No.</th>
                                                    <th>Note</th>
                                                    <th>Text</th>
                                                    <th>Date</th>
                                                    <th>Visit</th>
                                                    <th>Action</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {props.appState.wordMarkInfo["General"].map( (wm, index) => {
                                                    return (
                                                        <LauncherWMRow key={wm.id} wm={wm} set={this.indirectSetState} index={index} wms={props.appState.wordMarkInfo[category]} />
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
            {
                ( props.appState.wmEmpty && props.appState.URLLoad === "loaded")?
                    this.emptyPage("WordMarks")
                    : this.wmTable()
            }
        </>
    );

}


export default LauncherWMTable;
