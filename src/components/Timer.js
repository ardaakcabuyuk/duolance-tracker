import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import styles from '../css/Timer.module.css';
import EndSessionModal from './EndSessionModal';
import IdleModal from './IdleModal';

const USER_IDLE_AT = 1800;

const Timer = (props) => {

  const [sessionId, setSessionId] = useState(null);

  const [captureAt, setCaptureAt] = useState(null);   
  const [captureTimeSet, setCaptureTimeSet] = useState(false);
  const [captured, setCaptured] = useState(false);

  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [startTime, setStartTime] = useState(null);

  const [showEndSessionModal, setShowEndSessionModal] = useState(false);

  const [idleTime, setIdleTime] = useState();
  const [showIdleModal, setShowIdleModal] = useState(false);

  async function toggle() {
    if (!isActive) {
      setStartTime(Date.now());
      setIsActive(true);
      const sessionId = await props.sessionStarter();
      console.log('Session started: ' + sessionId);
      setCaptureTimeRandomly();
      window.main_process.on('system-state-change', () => {
        endSession(sessionId, "User device went sleeping or shut down.", true);
      });
      setSessionId(sessionId);
    }
    else {
      setIsActive(false);
    }
  }

  function endSession(id=null, endNote, idle=false) {
    handleCloseEndSessionModal();

    if (id)
      props.sessionEnder(id, endNote, idle);
    else
      props.sessionEnder(sessionId, endNote, idle);

    setTime(0);
    setIsActive(false);
    setCaptured(false);
    setStartTime(null);

    window.main_process.removeListener('system-state-change');
  }

  function capture() {
    props.capturer();
  }

  function setCaptureTimeRandomly() {
    setCaptureAt(Math.floor(Math.random() * 9) + 1);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTime(Date.now() - startTime);
      }, 100);
    } else if (!isActive && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const hours = Math.floor(time / 3600000);
  const minutes = Math.floor((time / 60000) % 60);
  const seconds = Math.floor((time / 1000) % 60);

  if (minutes % 10 === captureAt && !captured) {
    capture();
    setCaptured(true);
    setCaptureTimeSet(false);
  }

  if (minutes > 0 && minutes % 10 === 0 && !captureTimeSet) {
    setCaptured(false);
    setCaptureTimeRandomly();
    setCaptureTimeSet(true);
  }

  function n(n){
    return n > 9 ? "" + n: "0" + n;
  }

  function handleShowEndSessionModal() {
    setShowEndSessionModal(true);
  }

  function handleCloseEndSessionModal() {
    setShowEndSessionModal(false);
  }

  function handleCloseIdleModal() {
    setShowIdleModal(false);
  }

  if (isActive) {
    window.idle_api.getIdleTime().then(function (response) {
      setIdleTime(response);
    });

    // window.idle_api.receiveSystemState('system-state-change', (data) => {
    //   console.log('event received:')
    //   console.log('data', data);
    // });
  }

  useEffect(() => {
    if (idleTime >= USER_IDLE_AT) {
      setShowIdleModal(true);
    }
    else {
      setShowIdleModal(false);
    }
  }, [idleTime]);

  return (
    <div className={styles.app}>
      Current Session
      <div className={styles.time}>
        {n(hours)}:{n(minutes)}:{n(seconds)}
      </div>
      <div className={styles.row}>
        <Button 
          className={`${styles.start__button} ${isActive ? styles.start__button__clicked : ""}`} 
          onClick={toggle}
          disabled={isActive ? true : false}
        >
          Start
        </Button>
        <Button 
          className={styles.stop__button} 
          onClick={handleShowEndSessionModal} 
          disabled={isActive ? false : true}
        >
          Stop
        </Button>
        <EndSessionModal show={showEndSessionModal} handleClose={handleCloseEndSessionModal} endSession={endSession}/>
        {showIdleModal ? <IdleModal show={showIdleModal} handleClose={handleCloseIdleModal} endSession={endSession}/> : null}
      </div>
    </div>
  );
};

export default Timer;