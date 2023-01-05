import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';

import styles from '../css/Timer.module.css';

const Timer = (props) => {
  const [captureAt, setCaptureAt] = useState(Math.floor(Math.random() * 9) + 1);   
  const [captureTimeSet, setCaptureTimeSet] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);

  function toggle() {
    if (!isActive) {
      props.sessionStarter();
    }

    setIsActive(!isActive);
  }

  function reset() {
    props.sessionEnder();
    setTime(0);
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
        setTime((time) => time + 10);
      }, 10);
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

  console.log("captureAt", captureAt);
  console.log("captured", captured);

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