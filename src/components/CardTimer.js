import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import styles from '../css/CardTimer.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/fontawesome-free-solid";
import Timer from "./Timer";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ChangingProgressProvider from "./ChangingProgressProvider";

import { calcPercentage } from '../utils/Utils';
import LogoutButton from "./LogoutButton";

export default function CardTimer() {
  const state = useLocation();
  const navigate = useNavigate();
  const [contract, setContract] = useState(state.state.contract);
  const [card, setCard] = useState(state.state.card);
  const [memo, setMemo] = useState("");
  const [sessionID, setSessionID] = useState(undefined);
  const [lastUpdate, setLastUpdate] = useState(undefined);
  const [lastCapture, setLastCapture] = useState(undefined);

  useEffect(() => {
    return () => {
        // componentwillunmount in functional component.
        // Anything in here is fired on component unmount.
        if (sessionID)
          endSession("");
    }
  }, [])

  useEffect (() => {
    let updatedContract = null;
    if (lastUpdate) {
      axios.post(
        process.env.REACT_APP_CONTRACTS_URL, {
            freelancerID: contract.contractFreelancer
        }
      ).then(function (response) {
        console.log(response.data);
        updatedContract = response.data.response.responseContract.find(c => c._id === contract._id)
        setContract(updatedContract);
        console.log(updatedContract)
        return axios.post(process.env.REACT_APP_BOARD_CARDS_URL, {
          boardKeyId: updatedContract.board  ,
          duoUserId: updatedContract.contractFreelancer
        })
      }).then(function (response) {
        console.log(response.data);
        setCard(response.data.response.cardList.find(c => c._id === card._id));
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
      cardId: card._id,
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

  function endSession(endNote, idle=false) {
    const endTime = new Date(Date.now());
    if (idle) {
      endTime.setMinutes(endTime.getMinutes() - 30);
    }
    
    axios.post(process.env.REACT_APP_END_SESSION_URL, {
      end: endTime,
      sessionId: sessionID,
      contractId: contract._id,
      endNote: endNote
    }).then(function (response) {
      console.log(response.data);
      setSessionID(undefined);
      setMemo("");
      setLastUpdate(Date.now());
    }).catch(function (error) {
      console.log(error);
    });
  }

  //if there's a session while going back to the contracts, end it
  function handleGoBack() {
    if (sessionID) {
      endSession("");
    }
    navigate('/cards', {state: {contract: contract}})
  }

  //if there's a session while logging out, end it
  function handleLogout() {
    if (sessionID) {
      endSession("");
    }
    navigate('/login');
  }

  return (
    <div className={styles.container}>
      <div className={styles.screen}>
        <div className={styles.content}>
          <div className={`${styles.page__top} ${styles.draggable}`}>
            <div className={styles.page__top__upper}>
              <Button 
                className={`${styles.back__button} ${styles.non__draggable}`} 
                variant="outline-light" 
                onClick={() => handleGoBack()}>
                <FontAwesomeIcon icon={faChevronLeft} className={styles.button__icon} />
                Cards
              </Button>
            </div>
            <div>
              <div className={styles.title}>
                  {card.title}
              </div>
            </div>
          </div>
          <div className={`${styles.timer} ${styles.non__selectable}`}>
            <Timer 
              sessionStarter={startSession}
              sessionEnder={endSession}
              capturer={capture}
            />
          </div>
          <div className={`${styles.info__text} ${styles.non__selectable}`}>
            <ChangingProgressProvider values={[0, calcPercentage(card.hoursWorked, card.hoursMin)]}>
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
              <p>{(Math.round(card.hoursWorked * 10) / 10).toFixed(1)} / {card.hoursMin ? card.hoursMin.toFixed(1): "?"} hrs</p>
          </div>
          <p className={`${styles.due__date} ${styles.non__selectable}`}>
            {card.dateDueFreelancer ? `Due: ${new Date(card.dateDueFreelancer).toUTCString()}`: "Due date not specified."}
          </p>
        </div>
        <div className={styles.footer}>
              <LogoutButton></LogoutButton>
          </div>
      </div>
    </div>
  );
}


