import React, { useMemo, useState, useEffect } from 'react';
import $ from 'jquery';
import axios from 'axios';
import MetricsGraphics from 'react-metrics-graphics';
import { renderMatches, useLocation } from 'react-router-dom'
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'metrics-graphics/dist/metricsgraphics.css';
import { ConnectionClosedEvent } from 'mongodb';
import Navbar from "../navbar/Navbar";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'


function BenchmarkView()
{

    let bp = require('../Path.js');
    let i, scaledTime, currentMetricObject, yAxisKeyName;
    // let currentGraphTitle = "base title";
    let benchmarkDate, benchmarkUploadName, benchmarkTime;
    let systemID, passedInUploadName, systemUniqueID, yMax;
    let benchmarkToSave = [];
    let objKeys = [];

    const [records, setRecords] = useState(null);

    // Graph properties variables
    const [currentGraphTitle, setCurrentGraphTitle] = useState("base title");
    const [currentBenchmark, setCurrentBenchmark] = useState(null);
    const [yAxisName, setYAxisName] = useState(null);
    const [maxYAxisValue, setMaxYAxisValue] = useState(null);
    const [graphChange, setGraphChange] = useState(null);
    const [benchmarkName, setBenchmarkName] = useState(null);

    
    
    const location = useLocation()
        
    useEffect(() => {
        if (location.state != null)
        {
            const { benchmark } = location.state;
            setRecords(benchmark)
            setBenchmarkName(benchmark.UploadName)
        }
        return;
    }, [setRecords]);

    function doGraphChange(selectedKey, index) 
    {
        if ( index == -99 )
        {
            let newIndex = objKeys.indexOf(selectedKey)
            index = newIndex;
        }

        console.log(selectedKey, index);
        // set value to change the on-load screen that prompt user to pick key category
        setGraphChange(true);
        
        // updates graph title
        setCurrentGraphTitle(selectedKey);
        setYAxisName(selectedKey);


        let timeSubract, hours, minutes, seconds, timeSummed;
        yMax = 0;
        for ( i = 0; i < records.Time.length; i++ )
        {

            if ( records.Time[i] == "" )
                continue;

            let newTime = records.Time[i].split(':');
            if ( newTime.length == 3 )
            {
                hours   = parseFloat( newTime[0] * 60.0 * 60.0);
                minutes = parseFloat( newTime[1] * 60.0 );
                seconds = parseFloat( newTime[2] );
                timeSummed = hours + minutes + seconds;
            }
            else if ( newTime.length == 2 )
            {
                minutes = parseFloat( newTime[0] * 60.0 );
                seconds = parseFloat( newTime[1] );
                timeSummed = minutes + seconds;
            }

            if ( i == 0)
                timeSubract = timeSummed;
            
            scaledTime = timeSummed - timeSubract;
            console.log(scaledTime);

            yAxisKeyName = objKeys[index];            
            let currentY  = parseFloat(records[objKeys[index]][i]);
            if ( currentY > yMax )
                yMax = currentY;
          

            currentMetricObject  =
            {
                Time: parseFloat(scaledTime.toFixed(2)),
                [yAxisKeyName]: currentY
            }
            benchmarkToSave.push(currentMetricObject);
        }

        setMaxYAxisValue(yMax + (yMax*.05));
        setCurrentBenchmark(benchmarkToSave);

    }

    // handles and moves the important but not user important key values from incomming object
    function removeIdentifierKeys() {
        let index = objKeys.indexOf('_id');
        if ( index != -1 ) { objKeys.splice(index, 1); }

        // removes date from key values array and saves date in new variable
        index = objKeys.indexOf('Date');
        if ( index != -1 ) 
        { 
            benchmarkDate = objKeys[index];
            objKeys.splice(index, 1) ;
        }

        // removes uploadName from key values array and saves uploadName in new variable
        index = objKeys.indexOf('UploadName');
        if ( index != -1 ) 
        { 
            // benchmarkUploadName = objKeys[index];
            objKeys.splice(index, 1) ;
        }

        // removes time from key values array and saves time in new variable
        index = objKeys.indexOf('Time');
        if ( index != -1 ) 
        { 
            benchmarkTime = objKeys[index];
            objKeys.splice(index, 1) ;
        }

        index = objKeys.indexOf('Unique ID');
        if ( index != -1 ) 
        { 
            systemUniqueID = objKeys[index];
            objKeys.splice(index, 1) ;
        }

        index = objKeys.indexOf('Total Errors []');
        if ( index != -1 ) 
        { 
            objKeys.splice(index, 1) ;
        }
        
    }

    if (records != null)
    {
        // let timeSubract, hours, minutes, seconds, timeSummed;
        objKeys = Object.keys(records);
        console.log(objKeys)
        removeIdentifierKeys();    
    }

    // auto filter search function
    const [search, setSearch] = useState("");
    const filteredObjKeys = useMemo(() => {  
        if (search) {
          return objKeys.filter(
            (item) =>
              item.toLowerCase().indexOf(search.toLocaleLowerCase()) > -1);
        }
        return objKeys;
    }, [search]);

    
    if(objKeys.length != 0)

    {
    return(
        


        <Container className="page-container">
            <Row>
                <Col sm={12}>
                   <Navbar />
                </Col>
            </Row>

            <Row>
                <Col sm={12}>
                    <div className="dashboard-page scoll-overflow text-center">
                        <h5 className="title-panel">Current benchmark:</h5>
                        <h3 className="title-panel">{benchmarkName}</h3>
                    </div>
                </Col>
            </Row>

            <Row>
                {/* <h1 id="login-title">PEO STRI Benchmark testbed results</h1>
                <span id="inner-login-title">System {systemNumber}</span><br /> */}
                <Col xs={4}>
                    <div className="benchmark-page homepage-subsection-left scoll-overflow text-center scoll-overflow">
                        <div className="recent-uploads-title">
                            <h5>Key data categories</h5>
                            <hr id="recent-uploads-hr"/>
                        </div>
                        <div>

                            <div className="">
                                
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
                            
                            {/* Key data categories side of benchmark page */}
                            <div>
                                {/* checks if search currently has user inputted value, if so render list to match user input */}
                                { search && 
                                    
                                    <ul className="list-group recent-uploads-list-group">
                                        {filteredObjKeys.length > 0 ? (
                                        filteredObjKeys &&
                                        filteredObjKeys.map((item, index) => <Button className="list-group-item" onClick={() => doGraphChange(item, -99)}>{item}</Button>)
                                        ) : (
                                            <div>No results</div>
                                        )}
                                    </ul>
                                    
                                }
                                {/* checks if search currently has NO user inputted value, if so render entire list */}
                                { !search &&   
                                    
                                    <ul className="list-group recent-uploads-list-group">
                                        {objKeys.map((item, index) => <Button className="list-group-item" onClick={() => doGraphChange(item, index)}>{item}</Button>)}
                                    </ul>
                                
                                }
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xs={8}>
                    { graphChange &&
                        <div className="benchmark-page homepage-subsection-right" id="benchmarkGraph">

                            <MetricsGraphics
                                title={ currentGraphTitle }
                                description="This graphic is currently for testing"
                                data={ currentBenchmark }
                                width={800}
                                height={500}
                                right={40}
                                left={90}                         
                                x_accessor="Time"
                                y_accessor={ yAxisName }
                                x_label='Seconds'
                                y_label={ yAxisName }
                                min_y_from_data
                                max_y={ maxYAxisValue }
                                transition_on_update
                                area={false}


                            />
    
                        </div>
                    }
                    { !graphChange &&
                        <div className="benchmark-page-right text-center" id="benchmarkGraph" style={{height: "520px"}}>

                            <h3>Please select a key data category from the lefthand menu</h3>
    
                        </div>
                    }
                    
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

export default BenchmarkView;