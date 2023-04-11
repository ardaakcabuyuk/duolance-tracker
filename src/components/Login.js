import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Image from 'react-bootstrap/Image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faChevronRight } from '@fortawesome/fontawesome-free-solid';
import axios from 'axios';
import styles from "../css/Login.module.css";

import { isTokenExpired } from "../utils/Token";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [version, setVersion] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("user_id"));
  const [tokenExpired, setTokenExpired] = useState(false);

  function validateForm() {
    return email.length > 0 && password.length > 0;
  }

  function setAuthToken(token) {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    else
        delete axios.defaults.headers.common["Authorization"];
  }

  useEffect(() => {
    if (userId) {
      const token = localStorage.getItem("token");
      const expires = localStorage.getItem("expires");
      const tokenExpired = isTokenExpired(token, expires);
      setTokenExpired(tokenExpired);

      if (!tokenExpired) {
        setAuthToken(token);
        navigate('/contracts', { state: { freelancerID: userId, from: 'login' } });
      }
      else {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
      }
    }
    window.version_api.requestVersion().then(function (response) {
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
        const token = response.data.response.token;
        //set JWT token to local
        localStorage.setItem("token", token);
        localStorage.setItem("expires", Date.now() + response.data.response.expires * 1000);
        localStorage.setItem("user_id", response.data.response['user_id'])
        //set token to axios common header
        setAuthToken(token);
        navigate('/contracts', { state: { freelancerID: response.data.response['user_id'], from: 'login' } });
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
    (!userId || tokenExpired) && <div className={`${styles.container} ${styles.non__selectable}`}>
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
        <div className={`${styles.screen__background} ${styles.draggable}`}>
          <span className={`${styles.screen__background__shape} ${styles.screen__background__shape3}`}></span>		
          <span className={`${styles.screen__background__shape} ${styles.screen__background__shape2}`}></span>
          <span className={`${styles.screen__background__shape} ${styles.screen__background__shape1}`}></span>
        </div>		
      </div>
    </div>
  );
}

