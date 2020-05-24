import React from "react";
import Alert from 'react-bootstrap/Alert'

const SuccessAlert = (props) => {
        return (
            <Alert variant="success" onClose={() => props.dismiss()} dismissible>
                <p style={{"fontSize": "1rem"}}>
                    WordMark Saved! Use Launcher to access the information.
                </p>
            </Alert>
        );
}

export default SuccessAlert;
