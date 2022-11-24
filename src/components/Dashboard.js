import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import LoadingScreen from "react-loading-screen";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';

import styles from '../css/Dashboard.module.css';

export default function Dashboard() {
    const state = useLocation();
    const navigate = useNavigate();
    const {freelancerID, from} = state.state;
    const [contractList, setContractList] = useState(undefined);

    useEffect (() => {
      console.log(process.env.REACT_APP_ENVIRONMENT)
      axios.post(
          process.env.REACT_APP_CONTRACTS_URL, {
              freelancerID: freelancerID
          }
      ).then(function (response) {
        console.log(response.data);
        setContractList(response.data.response.responseContract);
      }).catch(function (error) {
        console.log(error);
      });
    }, [freelancerID]);

    function handleContractClick(contract) {
      navigate('/contract-details', { state: { contract: contract } });
    }

    return (        
      contractList ?
        <div className={styles.container}>
          <div className={styles.screen}>
            <div className={styles.header}>
            </div> 
            <div className={styles.title}>
              <h1>Contracts</h1>
              <hr style={{marginLeft: "10px", marginRight: "10px"}}/>
            </div>
            <div className={styles.content}>
              <div className={styles.contracts}>
                <div id="contracts" style={{padding: "10px"}}>
                  <Row xs={1} md={2} className="g-4">
                    {contractList.map(contract => {
                      return (
                        <Col>
                          <Card onClick={() => handleContractClick(contract)}>
                            <Card.Body>
                              <Card.Title>{contract.title}</Card.Title>               
                              <Card.Text>
                                Total hours: {Math.round(contract.totalHours * 10) / 10}
                                <br/>
                                Weekly hours: {Math.round(contract.weeklyHours * 10) / 10}
                              </Card.Text>
                            </Card.Body>
                            <Card.Footer className="text-muted">
                              Status: <p className={contract.contractStatus === "Active" ? styles.status__active: styles.status__inactive}>{contract.contractStatus}</p>
                            </Card.Footer>
                          </Card>
                        </Col>
                      )
                    })}
                  </Row>
                </div>
              </div>
            </div>
            <div className={styles.footer}>
              <Button className={styles.logout__button} onClick={() => navigate('/login')}>
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div> : <LoadingScreen
          loading={true}
          bgColor='#ffffff'
          spinnerColor='#9ee5f8'
          textColor='#676767'
          text = {from === 'login' ? "Logging in..." : "Loading contracts..."}
        ></LoadingScreen>
    )
}