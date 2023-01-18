	import React, { useEffect, useState } from "react";
	import axios from 'axios';
	import { useLocation, useNavigate } from "react-router-dom";
	import LoadingScreen from "react-loading-screen";
	import Card from 'react-bootstrap/Card';
	import Col from 'react-bootstrap/Col';
	import Row from 'react-bootstrap/Row';
	import Button from 'react-bootstrap/Button';
	import styles from '../css/Cards.module.css';
	import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
	import { faChevronLeft } from "@fortawesome/fontawesome-free-solid";
	import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
	import 'react-circular-progressbar/dist/styles.css';
	import ChangingProgressProvider from "./ChangingProgressProvider";

	export default function Cards() {
		const state = useLocation();
		const navigate = useNavigate();
		const {contract} = state.state;
		const [boardCards, setBoardCards] = useState(undefined);
		const statusPriority = [
			'In Progress',
			'Planned',
			'Approved',
			'Open',
			'Completed',
			'Archived'
		];

		const sortCards = (cards) => {
		// Sort the cards by status priority
		cards.sort((a, b) => {
			return statusPriority.indexOf(a.status) - statusPriority.indexOf(b.status);
		});
	
		// Sort the cards with the same status by freelancerDueDate
		let currentStatus = cards[0].status;
		let startIndex = 0;
		for (let i = 1; i < cards.length; i++) {
			if (cards[i].status !== currentStatus) {
				sortCardsByDueDate(cards, startIndex, i - 1);
				startIndex = i;
				currentStatus = cards[i].status;
			}
		}
		sortCardsByDueDate(cards, startIndex, cards.length - 1);
		return cards;
		};
	
		const sortCardsByDueDate = (cards, start, end) => {
			cards.slice(start, end + 1).sort((a, b) => {
				return new Date(a.freelancerDueDate) - new Date(b.freelancerDueDate);
			});
		};

		useEffect (() => {
			axios.post(process.env.REACT_APP_BOARD_CARDS_URL, {
				boardKeyId: contract.board,
				duoUserId: contract.contractFreelancer  
			}).then(function (response) {
				console.log(response.data);
				setBoardCards(sortCards(response.data.response.cardList));
			}).catch(function (error) {
				console.log(error);
			});
		}, []);

		function handleCardClick(card) {
			navigate('/contract-details', { state: { contract: contract, card: card } });
		}

		function handleGoBack() {
			navigate('/dashboard', { state: { freelancerID: contract.contractFreelancer, from: 'cards' } });
		}

		function handleLogout() {
			navigate('/login');
		}

		function timeLeft(dueDate) {
			const now = new Date();
			const due = new Date(dueDate);
			const diff = due - now;
		
			if (diff < 0) {
				return 'Due date has passed.';
			}
		
			const second = 1000;
			const minute = second * 60;
			const hour = minute * 60;
			const day = hour * 24;
			const week = day * 7;
			const month = day * 30;
			const year = day * 365;
		
			if (diff < minute) {
				const seconds = Math.floor(diff / second);
				if (seconds === 1) {
					return seconds + ' second left.';
				}
				return seconds + ' seconds left.';
			} 
			else if (diff < hour) {
				const minutes = Math.floor(diff / minute);
				if (minutes === 1) {
					return minutes + ' minute left.';
				}
				return minutes + ' minutes left.';
			} 
			else if (diff < day) {
				const hours = Math.floor(diff / hour);
				if (hours === 1) {
					return hours + ' hour left.';
				}
				return hours + ' hours left.';
			} 
			else if (diff < week) {
				const days = Math.floor(diff / day);
				if (days === 1) {
					return days + ' day left.';
				}
				return days + ' days left.';
			} 
			else if (diff < month) {
				const weeks = Math.floor(diff / week);
				if (weeks === 1) {
					return weeks + ' week left.';
				}
				return weeks + ' weeks left.';
			} 
			else if (diff < year) {
				const months = Math.floor(diff / month);
				if (months === 1) {
					return months + ' month left.';
				}
				return months + ' months left.';
			} 
			else {
				const years = Math.floor(diff / year);
				if (years === 1) {
					return years + ' year left.';
				}
				return years + ' years left.';
			}
		}

		return (        
			boardCards ? <div className={styles.container}>
			<div className={styles.screen}>
				<div className={styles.header}>
				</div> 
				<div className={styles.top}>
					<div className={styles.back}>
						<Button 
							className={styles.back__button} 
							variant="outline-light" 
							onClick={() => handleGoBack()}>
							<FontAwesomeIcon icon={faChevronLeft} className={styles.button__icon} />
						</Button>
					</div>
					<div className={styles.title}>
						<h1 style={{
							marginLeft: "auto",
							marginRight: "auto"
						}}>Cards</h1>
					</div>
					<div>
					<hr style={{color: "white", marginLeft: "20px", marginRight: "20px"}}/>
					</div>
				</div>
				<div className={styles.content}>
				<div className={styles.contracts}>
					<div id="cards" style={{padding: "10px"}}>
					<Row xs={1} md={2} className="g-4">
						{boardCards.map(card => {
						return (
							<Col className={styles.col}>
							<Card className={`${styles.card} ${styles[card.status.toLowerCase().replace(' ', '')]}`} onClick={() => handleCardClick(card)}>
								<Card.Body style={{color: 'white'}}>
								<div style={{float: "left"}}>
									<Card.Title>{card.title}</Card.Title>   
									<Card.Text>
									Hours Worked: {Math.round(card.hoursWorked * 10) / 10} / {card.hoursMin}
									</Card.Text>
								</div>
								<div style={{float: "right", height: 56, width: 56}}>
									<ChangingProgressProvider values={[0, Math.round(card.hoursWorked / card.hoursMin * 100)]}>
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
								</div>
								</Card.Body>
								<Card.Footer style={{color: 'white'}}>
								{card.status} 
								<p style={{float: "right", marginBottom: 0}}>
									{timeLeft(card.dateDueFreelancer)}
								</p>
								</Card.Footer>
							</Card>
							</Col>
						)
						})}
					</Row>
					</div>
				</div>
				</div>
				<div className={styles.footer}>
				<Button className={styles.logout__button} onClick={handleLogout}>
					<span>Logout</span>
				</Button>
				</div>
			</div>
			</div> : <LoadingScreen
			loading={true}
			bgColor='#ffffff'
			spinnerColor='#9ee5f8'
			textColor='#676767'
			text = "Fetching Cards..."
			></LoadingScreen>
		)
	}