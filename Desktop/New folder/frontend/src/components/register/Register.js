import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function Register  ()  {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstname, setFirst] = useState("");
    const [lastname, setLast] = useState("");
    const [username,setUser] = useState('');
    let navigate = useNavigate();

    let bp = require('../Path.js');

    function doRegister(event) {
        event.preventDefault();
        register(username, email, password, firstname, lastname).then(
            () => {
                alert("Registration successful");
                navigate("/");
            },
            error => {
                alert("Registration unsuccessful")
            }
        );
    }

    function register(username, firstname, lastname, email, password) {
        return axios.post(bp.buildPath('api/register'), {
            username,
            firstname,
            lastname,
            email,
            password
        });
    }

    return ( 
        <div id="login-div">
            <h1 id="register-title">Register new user</h1>

            <div id="registerNames">
                <input type="text" className="register-input" id="registerFirstName" placeholder="First Name" value = {firstname} onChange = {(e) => setFirst(e.target.value)} /><br />
                <input type="text" className="register-input" id="registerLastName" placeholder="Last Name" value = {lastname} onChange = {(e) => setLast(e.target.value)} /><br />
            </div>

            <input type="text" className="register-input" id="registerEmail" placeholder="Email" value = {email} onChange = {(e) => setEmail(e.target.value)} /><br />
            <input type="text" className="register-input" id="registerUsername" placeholder="Username" value = {username} onChange = {(e) => setUser(e.target.value)}/><br />
            <input type="password" className="register-input mb-3" id="registerPassword" placeholder="Password" value = {password} onChange = {(e) => setPassword(e.target.value)} /><br />
            <Button className="logout-login-register-button mb-2 btn-dark" onClick={doRegister}>
                Register
            </Button>
        </div>
     );
}