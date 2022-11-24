import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Select from 'react-select';
import styles from '../css/ContractDetails.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/fontawesome-free-solid";
import Timer from "./Timer";

export default function ContractDetails() {
  const state = useLocation();
  const navigate = useNavigate();
  const [contract, setContract] = useState(state.state.contract);
  const [boardCards, setBoardCards] = useState([]);
  const [memo, setMemo] = useState("");
  const [sessionID, setSessionID] = useState(undefined);
  const [lastUpdate, setLastUpdate] = useState(undefined);
  const [lastCapture, setLastCapture] = useState(undefined);

  useEffect (() => {
    console.log(process.env.REACT_APP_ENVIRONMENT)
    axios.post(process.env.REACT_APP_BOARD_CARDS_URL, {
      boardKeyId: contract.board  
    }).then(function (response) {
      console.log(response.data);
      setBoardCards(response.data.response.cardList);
    }).catch(function (error) {
      console.log(error);
    });
  }, []);

  useEffect (() => {
    if (lastUpdate) {
      axios.post(
        process.env.REACT_APP_CONTRACTS_URL, {
            freelancerID: contract.contractFreelancer
        }
      ).then(function (response) {
        console.log(response.data);
        setContract(response.data.response.responseContract.find(c => c._id === contract._id));
      }).catch(function (error) {
        console.log(error);
      });
    }
  }, [lastUpdate]);

  useEffect (() => {
    if (lastCapture) {
      axios.post(
        process.env.REACT_APP_SEND_MEMO_URL, {
            sessionId: sessionID,
            memotext: memo,
            image: lastCapture
        }
      ).then(function (response) {
        console.log(response.data);
      }).catch(function (error) {
        console.log(error.message);
      });
    }
  }, [lastCapture]);

  function startSession() {
    axios.post(process.env.REACT_APP_START_SESSION_URL, {
      start: Date.now(),
      contractId: contract._id,
    }).then(function (response) {
      console.log(response.data);
      setSessionID(response.data.response['session-id']);
    }).catch(function (error) {
      console.log(error);
    });
  }

  function capture() {
    window.capture_api.capture(Date.now())
    .then((result) => {
      console.log(result);
      setLastCapture(result.encoded);
    })
    .catch((error) => {
      console.log(error);
    });
  }

  function endSession() {
    axios.post(process.env.REACT_APP_END_SESSION_URL, {
      end: Date.now(),
      sessionId: sessionID,
      contractId: contract._id,
    }).then(function (response) {
      console.log(response.data);
      setSessionID(undefined);
      setMemo("");
      setLastUpdate(Date.now());
    }).catch(function (error) {
      console.log(error);
    });
  }

  //if there's a session while going back to the dashboard, end it
  function handleGoBack() {
    if (sessionID) {
      endSession();
    }
    navigate('/dashboard', {state: {freelancerID: contract.contractFreelancer, from: 'details'}})
  }

  //if there's a session while logging out, end it
  function handleLogout() {
    if (sessionID) {
      endSession();
    }
    navigate('/login');
  }

  return (
    <div className={styles.container}>
      <div className={styles.screen}>
        <div className={styles.content}>
          <div className={styles.page__top}>
            <div className={styles.page__top__upper}>
              <Button 
                className={styles.back__button} 
                variant="outline-light" 
                onClick={() => handleGoBack()}>
                <FontAwesomeIcon icon={faChevronLeft} className={styles.button__icon} />
              </Button>
            </div>
            <div>
              <div className={styles.header}>
                  {contract.title}
              </div>
            </div>
          </div>
          <div className={styles.memo__container}>
            <Select 
              options={boardCards.map(card => {
                return {value: card.title, label: card.title}
              })}
              onChange={(value) => setMemo(value.label)}
              value={memo.label}
              placeholder="What are you working on today?"
              className="react-select__container"
            />
          </div>
          <div className={styles.timer}>
            <Timer 
              sessionStarter={startSession}
              sessionEnder={endSession}
              capturer={capture}
            />
          </div>
          <div className={styles.info__text}>
            This week: {Math.round(contract.weeklyHours * 10) / 10} hours
            <br/>
            Total: {Math.round(contract.totalHours * 10) / 10} hours
          </div>
        </div>
        <div className={styles.footer}>
              <Button className={styles.logout__button} onClick={handleLogout}>
                <span>Logout</span>
              </Button>
          </div>
      </div>
    </div>
  );
}


