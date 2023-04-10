import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function LogoutButton() {
    const styles = {
        button: {
            padding: "5px 10px",
            borderRadius: "10px",
            textTransform: "uppercase",
            fontSize: ".8rem",
        },
        text: {
            fontWeight: 800,
        }
    };

    function handleLogout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        navigate('/login');
        console.log("Logged out")
        console.log(localStorage.getItem("token"))
        console.log(localStorage.getItem("user_id"))
    }

    const navigate = useNavigate();
    return (
        <Button variant="outline-light" style={styles.button} onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} style={{marginRight: "5px"}}/>
            <span style={styles.text}>Logout</span>
        </Button>
    );
}