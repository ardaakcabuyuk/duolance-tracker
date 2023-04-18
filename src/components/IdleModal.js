import {Modal, Button} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import css from '../css/Modal.module.css';

const MODAL_SHOW_SECS = 30;
const USER_IDLE_AT = 1800;

export default function IdleModal(props) {    
    const [remaining, setRemaining] = useState(30);
    const [idleTime, setIdleTime] = useState(0);
    const [sessionEnded, setSessionEnded] = useState(false);

    if (!sessionEnded) {
        window.idle_api.getIdleTime().then((idleTime) => {
            setIdleTime(idleTime);
        });
    }

    useEffect(() => {  
        const interval = setInterval(() => {
          setRemaining(MODAL_SHOW_SECS + USER_IDLE_AT - idleTime);
        }, 200)
    
        return () => {
          clearInterval(interval)
        }
    }, [idleTime])

    if (remaining === 0 && !sessionEnded) {
        props.endSession(null, "User was idle for 30 minutes.", true);
        setSessionEnded(true);
    }
    
    return (    
        <Modal dialogClassName={css.modal} show={props.show} onHide={props.handleClose} centered>
            <Modal.Header className={css.header} closeButton closeVariant='white'>
            <Modal.Title className={css.title}>{sessionEnded ? "Session Terminated": "Are you there?"}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={css.body}>
                {sessionEnded ? <p>Your session has been terminated due to inactivity for 30 minutes.</p>: <p>You have been idle for 30 minutes. Your session will be terminated unless you take an action.</p>}          
            </Modal.Body>
            <Modal.Footer className={css.footer}>
                {sessionEnded ? 
                <Button className={css.button} variant="outline-light" onClick={props.handleClose}>
                    <FontAwesomeIcon icon={faCheck} className={`${css.icon}`} />
                    Understood
                </Button>: <p>{remaining} seconds remaining</p>}
            </Modal.Footer>
        </Modal>
    );
}