import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from 'react-bootstrap/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faChevronRight } from '@fortawesome/fontawesome-free-solid';
import axios from 'axios';
import styles from "../css/Login.module.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [version, setVersion] = useState("");

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  useEffect(() => {
    window.version_api.requestVersion()
    .then(function (response) {
      console.log(response)
      setVersion(response);
    });
  }, []);

  function login(event) {
    event.preventDefault();
    axios.post(process.env.REACT_APP_LOGIN_URL, {
      id: email,
      password: password
    }).then(function (response) {
      console.log(response.data);
      if (response.data.response['login-success']) {
        navigate('/dashboard', { state: { freelancerID: response.data.response['user_id'], from: 'login' } });
      }
      else {
        unsuccessfulLogin();
      }
    }).catch(function (error) {
      unsuccessfulLogin();
      console.log(error);
    });
  }

  function unsuccessfulLogin() {
    setError(true);
    setPassword("");
  }

  return (
    <div className={styles.container}>
      <div className={styles.screen}>
        <div className={styles.screen__content}>
          <Form onSubmit={login} className={styles.login}>
            <Image src="static/duolance-logo.png" className={styles.duo__logo} />
            <div className={styles.login__field}>
              <Form.Group size="lg" controlId="email">
                <FontAwesomeIcon icon={faUser} className={styles.login__icon} />
                <Form.Control
                  autoFocus
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={styles.login__input}
                />
              </Form.Group>
            </div>
            <div className={styles.login__field}>
            <FontAwesomeIcon icon={faLock} className={styles.login__icon} />
              <Form.Group size="lg" controlId="password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={styles.login__input}
                />
              </Form.Group>
            </div>
            {error && <p className={styles.incorrect__message}>Incorrect email or password.</p>}
            <Button block size="lg" type="submit" disabled={!validateForm()} className={styles.login__submit}>
              <span className={styles.button__text}>Log In Now</span>
              <FontAwesomeIcon icon={faChevronRight} className={styles.button__icon} />
            </Button>
          </Form> 
          <p id="version" className={styles.version}>v{version}</p>
        </div>
        <div className={styles.screen__background}>
          <span className={`${styles.screen__background__shape} ${styles.screen__background__shape3}`}></span>		
          <span className={`${styles.screen__background__shape} ${styles.screen__background__shape2}`}></span>
          <span className={`${styles.screen__background__shape} ${styles.screen__background__shape1}`}></span>
        </div>		
      </div>
    </div>
  );
}

