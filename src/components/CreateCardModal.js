import {Modal, Button} from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

import css from '../css/Modal.module.css';

export default function CreateCardModal(props) {    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    return (    
        <Modal dialogClassName={css.modal} show={props.show} onHide={props.handleClose} centered>
            <Modal.Header className={css.header} closeButton closeVariant='white'>
            <Modal.Title className={css.title}>Create Card</Modal.Title>
            </Modal.Header>
            <Modal.Body className={css.body}>
                Title
                <input type="text" className={css.input} onChange={e => setTitle(e.target.value)} style={{marginBottom: "10px"}}></input>
                Description
                <textarea type="text" className={css.input} onChange={e => setDescription(e.target.value)}></textarea>
            </Modal.Body>
            <Modal.Footer className={css.footer}>
                <Button className={css.button} variant="outline-light" onClick={() => props.createCard(title, description)}>
                    <FontAwesomeIcon icon={faCheck} className={`${css.icon}`} />
                    Create
                </Button>
            </Modal.Footer>
        </Modal>
    );
}