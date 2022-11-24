import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import styles from '../css/Timer.module.css';

const Timer = (props) => {
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);   
  const [captureAt, setCaptureAt] = useState(Math.floor(Math.random() * 10));   
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    if (!isActive && !seconds && !minutes && !hours) {
      props.sessionStarter();
    }

    setIsActive(!isActive);
  }

  function reset() {
    props.sessionEnder();
    setSeconds(0);
    setMinutes(0);
    setHours(0);
    setIsActive(false);
  }

  function capture() {
    props.capturer();
  }

  function setCaptureTimeRandomly() {
    setCaptureAt(Math.floor(Math.random() * 10));
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds + 1);
        if (seconds + 1 === 60) {
          setMinutes(minutes => minutes + 1);
          setSeconds(0);
        }
        if (minutes === 60) {
          setHours(hours => hours + 1);
          setMinutes(0);
        }
      }, 1000);
      if (minutes % 10 === captureAt) {
        capture();
      }
      if (minutes > 0 && minutes % 10 === 0) {
        setCaptureTimeRandomly();
      }
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, minutes, hours]);  

  function n(n){
    return n > 9 ? "" + n: "0" + n;
  }

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
        <Button className={styles.stop__button} onClick={reset}>
          Stop
        </Button>
      </div>
    </div>
  );
};

export default Timer;