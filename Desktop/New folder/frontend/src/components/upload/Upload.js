import React, { useMemo, useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import {Button, Col, Container, Row} from 'react-bootstrap';
import Navbar from "../navbar/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileUpload } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';


function Upload()
{
    const [records, setRecords] = useState('');
    const [file, setFile] = useState()

    let uploadedFileDetails;

    let bp = require('../Path.js');

    const getAllBenchmarks = async event => 
    {
        var config = 
        {
            method: 'post',
            url: bp.buildPath('api/all-benchmarks'),
            headers: 
            {
                'Content-Type': 'application/json'
            },
            
        };

        axios(config)
            .then(function (response) 
        {
            var res = response.data;
            console.log(res)
            if ( res.error ) 
            {
                console.log("error" + res.error);
            }
            else 
            {	
                setRecords(res);
            }
        })
        .catch(function (error) 
        {
            console.log(error);
        });
    }


    // Use useEffect to make a function trigger only once
    useEffect(()=>{
        getAllBenchmarks();
    }, [])

    function handleChange(event) {
        let currentFile = event.target.files[0];
        setFile(currentFile)
        console.log(currentFile)

        document.getElementById('uploadedFileDetails').innerText = "File Name: " + currentFile.name 
            + "\nLast Modified: " + currentFile.lastModifiedDate;
        document.getElementById('uploadedFileDetails').style = "color: black; font-weight: bold;";
    }

    // Handles the call to '/api/upload' api endpoint and file upload
    function handleSubmit(event) {
        event.preventDefault()
        const url = bp.buildPath('api/upload');
        const formData = new FormData();
        formData.append('file', file);
        
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };

        axios.post(url, formData, config).then((response) => {
          console.log(response.data);
          if ( response.data == 'File Uploaded')
          {
            document.getElementById('uploadedFileStatus').innerText = "File Uploaded!";
            document.getElementById('uploadedFileStatus').style = "color: green; font-weight: bold;";
          }
          else
          {
            document.getElementById('uploadedFileStatus').innerText = "File failed to upload!";
            document.getElementById('uploadedFileStatus').style = "color: red; font-weight: bold;";
          }
          
        });
    }


    return(

        <Container className="page-container">

            <Row>
                <Col sm={12}>
                   <Navbar />
                </Col>
            </Row>
            <Row>
                <Col sm={12}>
                    <div className="homepage-subsection homepage-subsection-left scoll-overflow text-center">
                        <h2><strong> File Upload </strong></h2>
                        <hr id="recent-uploads-hr"/>  

                        <div className="recent-uploads-container">
                            
                            
                            <form onSubmit={handleSubmit}>
                                
                                

                                <span className="btn btn-outline-dark btn-file">
                                    <FontAwesomeIcon className="btn-file" icon={faFileUpload} /> 
                                    Choose file <input type="file" onChange={handleChange} />
                                </span>

                                <Button variant="outline-success" type="submit">
                                Upload!
                                </Button>
                            </form>
                            
                            
                        </div>
                        <p id="uploadedFileDetails"></p>
                        <p id="uploadedFileStatus"></p>

                        
                    </div>
                </Col>
            </Row>
            
        </Container>
    );
};

export default Upload;