import React, { useMemo, useState, useEffect } from 'react';
import { Link, Navigate } from "react-router-dom";
import {Button, Col, Container, Row} from 'react-bootstrap';
import Navbar from "../navbar/Navbar";
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

function Home()
{
    // gets the header of the user after logging in

    let bp = require('../Path.js');

    const [benchmarkRecords, setBenchmarkRecords] = useState('');
    const [computerSpecsRecords, setComputerSpecsRecords] = useState('');
    const [recentBenchmarkRecords, setRecentBenchmarkRecords] = useState('');

    let recentBenchmarkData, computerSpecsData = [];
    let recentBenchmarkIndexSub = 0;

    console.log(recentBenchmarkRecords)

    useEffect(() => {

        getAllBenchmarks();
        getAllComputerSpecs();

        async function getAllBenchmarks()
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
                if ( res.error ) 
                {
                    console.log("error" + res.error);
                }
                else 
                {	
                    setBenchmarkRecords(res);
                    setRecentBenchmarkRecords(res.reverse());
                    console.log(res)

                    if ( res.length >= 11 )
                    {
                        
                        recentBenchmarkIndexSub = 11;
                    }
                }
            })
            .catch(function (error) 
            {
                console.log(error);
            });
        }

        async function getAllComputerSpecs()
        {
            var config = 
            {
                method: 'post',
                url: bp.buildPath('api/all-specs'),
                headers: 
                {
                    'Content-Type': 'application/json'
                },
                
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
                    setComputerSpecsRecords(res);
                    // console.log(res)
                }
            })
            .catch(function (error) 
            {
                console.log(error);
            });
        }

        

        return;
    }, [setBenchmarkRecords, setComputerSpecsRecords]);


    // function updateRecords() {
    //     recentBenchmarkData = benchmarkRecords;
    //     computerSpecsData   = computerSpecsRecords;




    //     // if ( recentBenchmarkData > 10)
    //     // console.log(recentBenchmarkData.reverse())
    //     return;
    // }
    // updateRecords();

    function getCurrentUser() { return JSON.parse(localStorage.getItem('auth-token')); }




    // auto filter search function
    const [search, setSearch] = useState("");
    const filteredUsers = useMemo(() => {  
        if (search) {
          return computerSpecsRecords.filter(
            (item) =>
              item['System Name'].toLowerCase().indexOf(search.toLocaleLowerCase()) > -1
          );
        }
        return computerSpecsRecords;
    }, [search]);

    const [searchBenchmark, setSearchBenchmark] = useState("");
    const filteredBenchmarks = useMemo(() => {  
        if (searchBenchmark) {
          return benchmarkRecords.filter(
            (item) =>
              item.UploadName.toLowerCase().indexOf(searchBenchmark.toLocaleLowerCase()) > -1
          );
        }
        return benchmarkRecords;
    }, [searchBenchmark]);



// Current barbaric way of authentication redirects to homepage
//     if(!AuthService.getCurrentUser()) {
//             return <Navigate to='/'/>
//     }


    if(benchmarkRecords.length != 0)

    {
    
    return(

        <Container className="page-container">

            <Row>
                <Col sm={12}>
                   <Navbar />
                </Col>
            </Row>
            <Row>
                <Col sm={8}>
                    <div className="homepage-subsection homepage-subsection-left scoll-overflow text-center">
                        <strong>Select the system configuration you would like to view below.</strong>
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
                            { search && 
                                <ul className="list-group recent-uploads-list-group">
                                    {filteredUsers.length > 0 ? (
                                    filteredUsers &&
                                    filteredUsers.map((item) => <Link key={item['Unique ID']} className="list-group-item" to="/system" state={{ UniqueID: item['Unique ID'], systemName: item['System Name']}}><strong>{item['System Name']}</strong></Link>)
                                    ) : (
                                        <div>No results</div>
                                    )}
                                </ul>
                            }
                            { !search && 
                                <ul className="list-group recent-uploads-list-group">
                                    {computerSpecsRecords.map((item) => <Link key={item['Unique ID']} className="list-group-item" to="/system" state={{ UniqueID: item['Unique ID'], systemName: item['System Name']}}><strong>{item['System Name']}</strong></Link>)}
                                </ul>
                            }
                            

                            

                        </div>
                    </div>
                </Col>
                <Col sm={4}>
                <div className="homepage-subsection homepage-subsection-right text-center">
                    <div className="recent-uploads-title">
                        <h4>Recently uploaded results</h4>
                        <hr id="recent-uploads-hr"/>
                    </div>
                    <div>
                        <div>
                            <ul className="list-group recent-uploads-list-group reverse-list">
                                {benchmarkRecords.slice(0, benchmarkRecords.length - recentBenchmarkIndexSub).map((benchmark) => 
                                    <Link key={benchmark.UploadName} className="list-group-item" to="/benchmark" state={{ benchmark: benchmark}}>{benchmark.UploadName}</Link>
                                )}
                            </ul>
                        </div>
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

export default Home;