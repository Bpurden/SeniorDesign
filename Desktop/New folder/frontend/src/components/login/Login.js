import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import axios from "axios";

import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    let navigate = useNavigate();

    let bp = require('../Path.js');

    // eventual form validation
    /*function validateForm() {
        return email.length > 0 && password.length > 0;
    }*/

    const onFormSubmit = event => {
        event.preventDefault();
        login(email, password).then(
            () => {
                navigate("/homepage");
            },
            error => {
                alert("Login unsuccessful")
        });
      }

    function login(email, password) {
        return axios
            .post(bp.buildPath('api/login'), {
                email,
                password
            })
            .then(response => {
                if (response.data) {
                    localStorage.setItem("auth-token", JSON.stringify(response.data));
                }
                return response.data;
            });
    }

        return (
            <div id="login-div">
                <img src="./PEO_STRI_LOGO_LOGIN.png" style={{width: "300px"}} />
                <h1 id="login-title">Benchmark results</h1>
                <form className="login-credentials-section" onSubmit={onFormSubmit}>
                    <span id="inner-login-title">PLEASE LOGIN</span><br />
                    <input type="text" className="login-input" id="loginName" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} /><br />
                    <input type="password" className="login-input mb-3" id="loginPassword" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}  /><br />
                    <Button className="logout-login-register-button btn-dark" type="submit">
                        Log in
                    </Button>

                </form>

            </div>
        );
    }
