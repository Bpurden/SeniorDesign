import React, { useMemo, useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';
import MetricsGraphics from 'react-metrics-graphics';
import { Link, useLocation } from 'react-router-dom'
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'metrics-graphics/dist/metricsgraphics.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import Navbar from '../../components/navbar/Navbar';


function System()
{

    let bp = require('../Path.js');

    const [currentSystemBenchmarkRecords, setCurrentSystemBenchmarkRecords] = useState('');

    let i, currentMetricObject, xAxisName;
    let systemID, displaySystemName, yMax = 0;
    let currentSystemBenchmarkData = [];

    // for receiving data from previous page (Homepage)
    const location = useLocation()
    if (location.state != null)
    {
        
        const { UniqueID, systemName } = location.state;
        systemID = UniqueID;
        displaySystemName = systemName;

        // console.log(systemID + "    " + displaySystemName)

    }

    // Use useEffect to make a function trigger only once
    useEffect(()=>{

        getSpecificSystemBenchmarks();

        async function getSpecificSystemBenchmarks()
        {
            var config = 
            {
                method: 'post',
                url: bp.buildPath('api/benchmarks'),
                headers: 
                {
                    'Content-Type': 'application/json'
                },
                params:
                {
                    id: systemID
                }
                
            };

            axios(config)
                .then(function (response) 
            {
                var res = response.data;
                if ( res.error ) 
                {
                    console.log("error" + res.error);
                }
                else 
                {	
                    setCurrentSystemBenchmarkRecords(res);
                    console.log(res)
                }
            })
            .catch(function (error) 
            {
                console.log(error);
            });
        }

    }, [setCurrentSystemBenchmarkRecords])

    function updateRecords() {
        currentSystemBenchmarkData = currentSystemBenchmarkRecords;
        console.log(currentSystemBenchmarkData)
        return;
    }
    updateRecords();


    // if (records != null)
    // {
    //     let timeSubract, scaledTime, hours, minutes, seconds, timeSummed;
    //     const objKeys = Object.keys(records[0]);

    //     for ( i = 0; i < records[0].Time.length; i++ )
    //     {
    //         // console.log(records[0].Time[i])
            
    //         if ( records[0].Time[i] == "" )
    //             continue;

    //         let newTime = records[0].Time[i].split(':');
    //         if ( newTime.length == 3 )
    //         {
    //             hours   = parseFloat( newTime[0] * 60.0 * 60.0);
    //             minutes = parseFloat( newTime[1] * 60.0 );
    //             seconds = parseFloat( newTime[2] );
    //             timeSummed = hours + minutes + seconds;
    //         }
    //         else if ( newTime.length == 2 )
    //         {
    //             minutes = parseFloat( newTime[0] * 60.0 );
    //             seconds = parseFloat( newTime[1] );
    //             timeSummed = minutes + seconds;
    //         }

    //         if ( i == 0)
    //             timeSubract = timeSummed;
            
    //         scaledTime = timeSummed - timeSubract;

    //         xAxisName = objKeys[5]; 
    //         let currentX  = parseFloat(records[0][objKeys[5]][i]);
    //         if ( currentX > yMax )
    //             yMax = currentX;
          
    //         currentMetricObject  =
    //         {
    //             time: parseFloat(scaledTime.toFixed(2)),
    //             [xAxisName]: currentX
    //         }
    //         currentCpuAvgBenchmark.push(currentMetricObject);
    //     }
        
    // }
    
    // console.log((currentCpuAvgBenchmark));
    // console.log((yMax));
    
    // auto filter search function
    const [search, setSearch] = useState("");
    const filteredUsers = useMemo(() => {  
        if (search) {
            return currentSystemBenchmarkData.filter(
            (item) =>
                item.UploadName.toLowerCase().indexOf(search.toLocaleLowerCase()) > -1
            );
        }
        return currentSystemBenchmarkData;
    }, [search]);
    

    if(currentSystemBenchmarkData.length != 0)

    {

    return(
        


        <Container className="">
            <Row>
                <Col sm={12}>
                    <Navbar />
                </Col>
            </Row>
            
            <Row>
                <Col sm={12}>
                    <div className="dashboard-page scoll-overflow text-center">
                        <h5 className="title-panel">Current System:</h5>
                        <h2 className="title-panel">{displaySystemName}</h2>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div className="dashboard-page scoll-overflow text-center">
                        {/* <h5>Current System:</h5>
                        <h2>{displaySystemName}</h2>
                        <hr id="recent-uploads-hr"/>   */}

                        <strong>Select which benchmark you would like to view below.</strong>
                        <hr id="recent-uploads-hr"/>  

                        <div className="recent-uploads-container">
                            
                            <FontAwesomeIcon icon={faSearch} /> 
                            <input                            
                                className="recent-uploads-input"
                                type="text"
                                name="search"
                                value={search}
                                placeholder="Search"
                                // Prevents search suggestions from covering system names
                                autoComplete="off"
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            
                        </div>

                        <div>
                            {/* <ul className="list-group recent-uploads-list-group">
                                {filteredUsers.length > 0 ? (
                                filteredUsers &&
                                filteredUsers.map((item) => <Link key={item.id} className="list-group-item" to="/benchmark" state={{ uniqueId: item.id, runName: item.runName}}><strong>{item.runName}</strong></Link>)
                                ) : (
                                <div>empty</div>
                                )}
                            </ul> */}

                            { search && 
                                <ul className="list-group recent-uploads-list-group">
                                    {filteredUsers.length > 0 ? (
                                    filteredUsers &&
                                    filteredUsers.map((item) => <Link key={item['Unique ID']} className="list-group-item" to="/benchmark" state={{benchmark: item}}><strong>{item.UploadName}</strong></Link>)
                                    ) : (
                                    <div>No results</div>
                                    )}
                                </ul>
                            }
                            { !search && 
                                <ul className="list-group recent-uploads-list-group">
                                    {currentSystemBenchmarkData.map((item) => <Link key={item['Unique ID']} className="list-group-item" to="/benchmark" state={{benchmark: item}}><strong>{item.UploadName}</strong></Link>)}
                                </ul>
                            }

                            

                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
    }else{
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
                        <strong>Loading...</strong>
                    </div>
                </Col>
            </Row>
                
            
        </Container>



        )
    }
};

export default System;