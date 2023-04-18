import {Modal, Button} from 'react-bootstrap';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import css from '../css/Modal.module.css';

export default function EndSessionModal(props) {    
    const [endNote, setEndNote] = useState('');

    function endSession(endNote) {
        props.endSession(null, endNote);
    }

    return (    
        <Modal dialogClassName={css.modal} show={props.show} onHide={props.handleClose} centered>
            <Modal.Header className={css.header} closeButton closeVariant='white'>
            <Modal.Title className={css.title}>End Session</Modal.Title>
            </Modal.Header>
            <Modal.Body className={css.body}>
                <div>
                    Give a few words about your session.
                    <textarea placeholder="Session summary..." className={css.input} cols="30" rows="5" onChange={e => setEndNote(e.target.value)}></textarea>
                </div>
            </Modal.Body>
            <Modal.Footer className={css.footer}>
                <Button className={css.button} variant="outline-light" onClick={props.handleClose}>
                    <FontAwesomeIcon icon={faTimes} className={`${css.icon}`} />
                    Cancel
                </Button>
                <Button className={css.button} variant="outline-light" onClick={() => endSession(endNote)}>
                    <FontAwesomeIcon icon={faCheck} className={`${css.icon}`}/>
                    End Session
                </Button>
            </Modal.Footer>
        </Modal>
    );
    }