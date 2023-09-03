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
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { faChevronLeft, faPlus } from "@fortawesome/fontawesome-free-solid";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ChangingProgressProvider from "./ChangingProgressProvider";

import LogoutButton from "./LogoutButton";
import { calcPercentage } from '../utils/Utils';
import SearchBar from "./SearchBar";
import CreateCardModal from "./CreateCardModal";

export default function Cards() {
	const state = useLocation();
	const navigate = useNavigate();
	const {contract} = state.state;
	const [boardCards, setBoardCards] = useState(undefined);
	const [searchKey, setSearchKey] = useState("");
	const [showCreateCardModal, setShowCreateCardModal] = useState(false);
	const statusPriority = [
		'In Progress',	
		'Review',
		'Approved',
	];

	const statusIcon = {
		'In Progress': <MoreHorizIcon />,
		'Review': <TroubleshootIcon />,
		'Approved': <ScatterPlotIcon />
	}

	function handleScroll(e) {
		const bottom = e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight;
		if (bottom) {
		  e.target.className = styles.content__scroll_bottom;
		}
		else {
		  e.target.className = styles.content;
		}
	}

	function handleShowCreateCardModal() {
		setShowCreateCardModal(true);
	}

	function handleCloseCreateCardModal() {
		setShowCreateCardModal(false);
	}

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

			if (response.data.response.cardList.length)
				setBoardCards(sortCards(response.data.response.cardList));
			else
				setBoardCards([]);
		}).catch(function (error) {
			console.log(error);
		});
	}, []);

	const filteredCardList = boardCards ? boardCards.filter(card => {
		return card.title.toLowerCase().includes(searchKey.toLowerCase());
	}) : [];

	function handleCardClick(card) {
		navigate('/card-timer', { state: { contract: contract, card: card } });
	}

	function handleGoBack() {
		navigate('/contracts', { state: { freelancerID: contract.contractFreelancer, from: 'cards' } });
	}

	function handleLogout() {
		navigate('/login');
	}

	function timeLeft(dueDate) {
		if (!dueDate) {
			return 'No due date.';
		}

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

	function createCard(title, description) {
		axios.post(process.env.REACT_APP_CREATE_CARD_URL, {
			boardId: contract.board,
			userId: contract.contractFreelancer,
			title: title,
			description: description	
		}).then(function (response) {	
			console.log(response.data);	
			if (response.data.response.cardList.length)
				setBoardCards(sortCards(response.data.response.cardList));
			else
				setBoardCards([]);
		}).catch(function (error) {
			console.log(error);
		});
		setShowCreateCardModal(false);
	}

	return (        
		boardCards ? <div className={styles.container}>
		<div className={`${styles.screen} ${styles.non__selectable}`}>
			<div className={`${styles.header} ${styles.draggable}`}>
			</div> 
			<div className={`${styles.top} ${styles.draggable}`}>
				<div className={styles.back}>
					<Button 
						className={styles.back__button} 
						variant="outline-light" 
						onClick={() => handleGoBack()}>
						<FontAwesomeIcon icon={faChevronLeft} className={styles.button__icon} />
						Contracts
					</Button>
				</div>
				<div className={styles.title}>
					<h1 style={{
						marginLeft: "auto",
						marginRight: "auto",
						fontWeight: 600						
					}}>Cards</h1>
				</div>
				<div className={styles.create__card}>
					<Button 
						className={styles.back__button} 
						variant="outline-light" 
						onClick={() => handleShowCreateCardModal()}>
						<FontAwesomeIcon icon={faPlus} />
					</Button>
				</div>
			</div>
			<SearchBar 
				setSearchKey={setSearchKey}
				type="Cards"
			/>
			<div className={styles.content} onScroll={handleScroll}>
				<div id="cards" style={{padding: "10px", height: "100%"}}>
					<Row xs={1} md={2} className="g-4">
						{filteredCardList.length ? filteredCardList.map(card => {
						return (
							<Col className={styles.col}>
							<Card className={`${styles.card} ${styles[card.status.toLowerCase().replace(' ', '')]}`} onClick={() => handleCardClick(card)}>
								<Card.Body style={{color: 'white'}}>
								<div style={{float: "left"}}>
									<Card.Title style={{fontWeight: '600', fontSize: '18px'}}>{card.title}</Card.Title>   
									<Card.Text>
									<span>
										<AccessTimeIcon sx={{ fontSize: 14 }}/>  <span style={{verticalAlign: 'middle', fontSize: '14px'}}>{(Math.round(card.hoursWorked * 10) / 10).toFixed(1)} hrs</span>
									</span>	
									</Card.Text>
								</div>
								<div style={{float: "right", height: 56, width: 56, display: "flex"}}>
									<ChangingProgressProvider values={[0, calcPercentage(card.hoursWorked, card.hoursMin)]}>
									{percentage => (
										<CircularProgressbar
										value={percentage}
										text={`${percentage}%`}
										styles={buildStyles({
											strokeLinecap: 'butt',
											pathTransition: "stroke-dashoffset 0.5s ease 0s",
											pathColor: `#b5b5b5`,
											textColor: '#ffffff',
											trailColor: '#ffffff',
											textSize: '25px',
										})}
										/>
									)}
									</ChangingProgressProvider>
								</div>
								</Card.Body>
								<Card.Footer style={{color: 'white', fontWeight: '600'}}>		
									<span>{statusIcon[card.status]}  {card.status}</span>
									<span style={{float: "right", marginBottom: 0, verticalAlign: 'middle'}}>
										{timeLeft(card.dateDueFreelancer)}
									</span>
								</Card.Footer>
							</Card>
							</Col>
						)
						}): 
						<div style={{textAlign: "center", height: "100%"}}>
							<h5 style={{color: "white"}}>Oh, snap!</h5>
							<p style={{color: "white"}}>There are no cards.</p>
						</div>}
					</Row>
				</div>
			</div>
			<CreateCardModal show={showCreateCardModal} handleClose={handleCloseCreateCardModal} createCard={createCard} />
			<div className={styles.footer}>
				<LogoutButton></LogoutButton>
			</div>
		</div>
	</div> : 
	<LoadingScreen
		loading={true}
		bgColor='#ffffff'
		logoSrc="https://s3.amazonaws.com/appforest_uf/f1680688260742x718604605764663200/icon.png"
		spinnerColor='#9ee5f8'
		textColor='#676767'
		text = "Fetching Cards..."
		>
	</LoadingScreen>
	)
}