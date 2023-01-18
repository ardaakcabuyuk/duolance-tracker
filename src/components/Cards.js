import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import LoadingScreen from "react-loading-screen";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import styles from '../css/Cards.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/fontawesome-free-solid";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ChangingProgressProvider from "./ChangingProgressProvider";

export default function Cards() {
    const state = useLocation();
    const navigate = useNavigate();
    const {contract} = state.state;
    const [boardCards, setBoardCards] = useState(undefined);

    useEffect (() => {
        axios.post(process.env.REACT_APP_BOARD_CARDS_URL, {
          boardKeyId: contract.board  
        }).then(function (response) {
          console.log(response.data);
          setBoardCards(response.data.response.cardList);
        }).catch(function (error) {
          console.log(error);
        });
      }, []);

    function handleCardClick(card) {
      navigate('/contract-details', { state: { contract: contract, card: card } });
    }

    function handleGoBack() {
      navigate('/dashboard', { state: { freelancerID: contract.contractFreelancer, from: 'cards' } });
    }

    function handleLogout() {
        navigate('/login');
      }

    return (        
        boardCards ? <div className={styles.container}>
          <div className={styles.screen}>
            <div className={styles.header}>
            </div> 
            <div className={styles.top}>
                <div className={styles.back}>
                    <Button 
                        className={styles.back__button} 
                        variant="outline-light" 
                        onClick={() => handleGoBack()}>
                        <FontAwesomeIcon icon={faChevronLeft} className={styles.button__icon} />
                    </Button>
                </div>
                <div className={styles.title}>
                    <h1 style={{
                        marginLeft: "auto",
                        marginRight: "auto"
                    }}>Cards</h1>
                </div>
                <div>
                <hr style={{color: "white", marginLeft: "20px", marginRight: "20px"}}/>
                </div>
            </div>
            <div className={styles.content}>
              <div className={styles.contracts}>
                <div id="cards" style={{padding: "10px"}}>
                  <Row xs={1} md={2} className="g-4">
                    {boardCards.map(card => {
                      return (
                        <Col className={styles.col}>
                          <Card className={`${styles.card} ${styles[card.status.toLowerCase()]}`} onClick={() => handleCardClick(card)}>
                            <Card.Body style={{color: 'white'}}>
                              <div style={{float: "left"}}>
                                <Card.Title>{card.title}</Card.Title>   
                                <Card.Text>
                                  Hours Worked: {Math.round(card.hoursWorked * 10) / 10} / {card.hoursMin}
                                </Card.Text>
                              </div>
                              <div style={{float: "right", height: 56, width: 56}}>
                                <ChangingProgressProvider values={[0, Math.round(card.hoursWorked / card.hoursMin * 100)]}>
                                  {percentage => (
                                    <CircularProgressbar
                                      value={percentage}
                                      text={`${percentage}%`}
                                      styles={buildStyles({
                                        strokeLinecap: 'butt',
                                        pathTransition: "stroke-dashoffset 0.5s ease 0s",
                                        pathColor: `rgba(4, 201, 168)`,
                                        textColor: '#ffffff',
                                        trailColor: '#ffffff',
                                        textSize: '25px',
                                      })}
                                    />
                                  )}
                                </ChangingProgressProvider>
                              </div>
                            </Card.Body>
                            <Card.Footer style={{color: 'white'}}>
                              {card.status}
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
              <Button className={styles.logout__button} onClick={handleLogout}>
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div> : <LoadingScreen
          loading={true}
          bgColor='#ffffff'
          spinnerColor='#9ee5f8'
          textColor='#676767'
          text = "Fetching Cards..."
        ></LoadingScreen>
    )
}