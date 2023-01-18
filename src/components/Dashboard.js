import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import LoadingScreen from "react-loading-screen";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ChangingProgressProvider from "./ChangingProgressProvider";
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
      navigate('/cards', { state: { contract: contract, from: 'dashboard' } });
    }

    return (        
      contractList ?
        <div className={styles.container}>
          <div className={styles.screen}>
            <div className={styles.header}>
            </div> 
            <div className={styles.title}>
              <h1>Contracts</h1>
              <hr style={{marginLeft: "20px", marginRight: "20px"}}/>
            </div>
            <div className={styles.content}>
              <div className={styles.contracts}>
                <div id="contracts" style={{padding: "10px"}}>
                  <Row xs={1} md={2} className="g-4">
                    {contractList.map(contract => {
                      return (
                        <Col className={styles.col}>
                          <Card className={styles.card} onClick={() => handleContractClick(contract)}>
                            <Card.Body>
                              <div style={{float: "left"}}>
                                <Card.Title>{contract.title}</Card.Title>   
                                <Card.Text>
                                  Total hours: {Math.round(contract.totalHours * 10) / 10}
                                  <br/>
                                  Weekly hours: {Math.round(contract.weeklyHours * 10) / 10} / {contract.minWeeklyHour}
                                </Card.Text>
                              </div>
                              <div style={{float: "right", height: 80, width: 80}}>
                                <ChangingProgressProvider values={[0, Math.round(contract.weeklyHours / contract.minWeeklyHour * 100)]}>
                                  {percentage => (
                                    <CircularProgressbar
                                      value={percentage}
                                      text={`${percentage}%`}
                                      styles={buildStyles({
                                        pathTransition: "stroke-dashoffset 0.5s ease 0s",
                                        pathColor: `rgba(4, 201, 168, ${percentage / 50})`,
                                        textColor: '#04c9a8',
                                        trailColor: '#dceced'
                                      })}
                                    />
                                  )}
                                </ChangingProgressProvider>
                              </div>
                            </Card.Body>
                            <Card.Footer className="text-muted">
                              <p className={contract.contractStatus === "Active" ? styles.status__active: styles.status__inactive}>{contract.contractStatus}</p>
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