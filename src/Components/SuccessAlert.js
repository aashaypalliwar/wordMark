import React from "react";
import Alert from 'react-bootstrap/Alert'

const SuccessAlert = (props) => {
        return (
            <Alert variant="success" onClose={() => props.dismiss()} dismissible>
                <p style={{"fontSize": "1rem"}}>
                    Success!
                </p>
            </Alert>
        );
}

export default SuccessAlert;
