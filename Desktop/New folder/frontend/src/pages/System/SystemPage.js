import React, { useState } from 'react';
import { useLocation } from 'react-router-dom'
import { Button, Container, Row, Col } from 'react-bootstrap';
import Navbar from '../../components/navbar/Navbar';
import System from '../../components/system/System';



function SystemPage()
{
    // const location = useLocation()
    
    // let systemNumber = 0;
    // if (location.state != null)
    // {
        
    //     const { systemId } = location.state;
    //     systemNumber = systemId;

    // }
    

    return(


        <Container className="page-container">
            {/* <Row>
                <Col sm={12}>
                    <Navbar />
                </Col>
            </Row> */}

            <Row>
                <Col xs={12}>
                    <System />
                </Col>

            </Row>
        </Container>
    );
};

export default SystemPage;