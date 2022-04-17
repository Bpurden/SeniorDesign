import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const ConfirmRegister = () => {



    let registerCode;
    let returnMessage;

    const [message,setMessage] = useState('');

    const doRegisterConfirm = async event => 
    {
        
    }

    return ( 
        <div id="login-div">
            <h1 id="register-title">Confirm Verification</h1>

            <h3 id="check-email-confirm">Check your email for a verification code</h3>
            <input type="text" className="register-input" id="registerCode" maxlength="4"
             placeholder="Enter four digit code" ref={(c) => registerCode = c} /><br />
            {/* <input type="submit" id="login-button" className="buttons" value = "Confirm" onClick={doRegisterConfirm} /><br /> */}
            <Button className="logout-login-register-button" onClick={doRegisterConfirm}>
                Confirm
            </Button>
            <p id="returnMessage" ref={(c) => returnMessage = c} ></p>
        </div>
     );
}
 
export default ConfirmRegister;