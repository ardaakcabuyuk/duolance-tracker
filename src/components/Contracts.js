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
import styles from '../css/Contracts.module.css';

import SearchBar from "./SearchBar";
import LogoutButton from "./LogoutButton";
import { calcPercentage } from '../utils/Utils';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

export default function Contracts() {
    const state = useLocation();
    const navigate = useNavigate();
    const {freelancerID, from} = state.state;
    const [contractList, setContractList] = useState(undefined);
    const [searchKey, setSearchKey] = useState("");

    function handleScroll(e) {
      const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
      if (bottom) {
        e.target.className = styles.content__scroll_bottom;
      }
      else {
        e.target.className = styles.content;
      }
    }

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

    const filteredContractList = contractList ? contractList.filter(contract => {
      return contract.title.toLowerCase().includes(searchKey.toLowerCase());
    }) : [];

    function handleContractClick(contract) {
      navigate('/cards', { state: { contract: contract, from: 'contracts' } });
    }

    return (        
      contractList ?
        <div className={styles.container}>
          <div className={`${styles.screen} ${styles.non__selectable}`}>
            <div className={`${styles.header} ${styles.draggable}`}>
            </div> 
            <div className={`${styles.title} ${styles.draggable}`}>
              <h1 style={{fontWeight: 600}}>Contracts</h1>
            </div>
            <SearchBar 
              setSearchKey={setSearchKey}
              type="Contracts"
            />
            <div className={styles.content} onScroll={handleScroll}>
              <div className={styles.contracts}>
                <div id="contracts" style={{padding: "10px"}}>
                  <Row xs={1} md={2} className="g-4">
                    {filteredContractList.length ? filteredContractList.map(contract => {
                      return (
                        <Col className={styles.col}>
                          <Card className={styles.card} onClick={() => handleContractClick(contract)}>
                            <Card.Body>
                              <div style={{float: "left"}}>
                                <Card.Title style={{fontWeight: '600'}}>{contract.title}</Card.Title>   
                                <Card.Text>
                                  <span>
                                    <AccessTimeIcon sx={{ fontSize: 16 }}/>   <span style={{verticalAlign: 'middle'}}>{Math.round(contract.totalHours * 10) / 10} hrs</span>
                                    </span>
                                </Card.Text>
                              </div>
                              <div style={{float: "right", height: 56, width: 56}}>
                                <ChangingProgressProvider values={[0, calcPercentage(contract.weeklyHours, contract.minWeeklyHour)]}>
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
                              <p style={{fontWeight: '600'}} className={contract.contractStatus === "Active" ? styles.status__active: styles.status__inactive}>{contract.contractStatus}</p>
                            </Card.Footer>
                          </Card>
                        </Col>
                      )
                    }) : 
                    <div style={{textAlign: "center", height: "100%"}}>
                      <h5 style={{color: "white"}}>Oh, snap!</h5>
                      <p style={{color: "white"}}>There are no contracts.</p>
                    </div>
                    }
                  </Row>
                </div>
              </div>
            </div>
            <div className={styles.footer}>
              <LogoutButton></LogoutButton>
            </div>
          </div>
        </div> : <LoadingScreen
          loading={true}
          logoSrc="https://s3.amazonaws.com/appforest_uf/f1680688260742x718604605764663200/icon.png"
          bgColor='#ffffff'
          spinnerColor='#9ee5f8'
          textColor='#676767'
          text = {from === 'login' ? "Logging in..." : "Loading contracts..."}
        ></LoadingScreen>
    )
}