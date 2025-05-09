import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

import styles from './Comments.module.scss';

const cx = classNames.bind(styles);

function Comments({ userID, productID }) {
	const [comments, setComments] = useState([]);
	const [size, setSize] = useState(5);
	const [isShowChangeCmt, setIsShowChangeCmt] = useState(false);
	const [oldContent, setOldContent] = useState('');
	const [content, setContent] = useState('');
	const [star, setStar] = useState(0);
	const [id, setID] = useState(0);

	const getComments = async () => {
		const response = await axios.get('http://localhost:3001/feedback', {
			params: {
				productID,
			},
		});

		const sortedComments = response.data.sort(
			(a, b) => new Date(b.date) - new Date(a.date)
		);
		setComments(sortedComments);
	};

	useEffect(() => {
		getComments();
	}, []);

	// render star
	const renderStar = (star) => {
		const stars = [];

		for (let i = 1; i <= star; i++) {
			stars.push(
				<FontAwesomeIcon
					key={i}
					className={cx('star')}
					icon={faStar}
				/>
			);
		}

		return stars;
	};

	const saveComment = () => {
		axios.post('http://localhost:3001/update-feedback', {
			userID,
			productID,
			content,
			star,
			id,
		});
		setIsShowChangeCmt(false);
		// reload page
		window.location.reload(true);
	};

	const changeComment = (id, star, content) => {
		setIsShowChangeCmt(true);
		setStar(star);
		setID(id);
		setOldContent(content);
	};

	const removeComment = (id) => {
		axios.post('http://localhost:3001/remove-feedback', {
			userID,
			productID,
			id,
		});
		// reload page
		window.location.reload(true);
	};

	const timer = (time) => {
		const date = new Date(time);
		const now = new Date();

		const diff = now - date;

		// Convert milliseconds to different time units
		const minutes = Math.floor(diff / 60000);
		const hours = Math.floor(diff / 3600000);
		const days = Math.floor(diff / 86400000);
		const weeks = Math.floor(diff / 604800000);
		const months = Math.floor(diff / 2419200000);
		const years = Math.floor(diff / 29030400000);

		let roundedTime = 0;
		let timeUnit = '';

		if (years >= 1) {
			roundedTime = years;
			timeUnit = 'year';
		} else if (months >= 1) {
			roundedTime = months;
			timeUnit = 'month';
		} else if (weeks >= 1) {
			roundedTime = weeks;
			timeUnit = 'week';
		} else if (days >= 1) {
			roundedTime = days;
			timeUnit = 'day';
		} else if (hours >= 1) {
			roundedTime = hours;
			timeUnit = 'hour';
		} else {
			roundedTime = minutes;
			timeUnit = 'minute';
		}

		// Pluralize the time unit if roundedTime is greater than 1
		if (roundedTime > 1) {
			timeUnit += 's';
		}

		return `${roundedTime} ${timeUnit} ago`;
	};

	const writeReview = (e) => {
		setTimeout(() => {
			setContent(e.target.value);
		}, 300);
	};

	return (
		<div className={cx('wrap')}>
			{comments.slice(0, size).map((comment) => (
				<div
					className={cx('item')}
					key={comment.id}
				>
					<div className={cx('heading')}>
						<div className={cx('username')}>{comment.username}</div>
						<div className={cx('time')}>{timer(comment.date)}</div>
					</div>
					<div>{renderStar(comment.star)}</div>
					<div className={cx('content')}>{comment.content}</div>
					{userID === comment.userID && (
						<div className={cx('change-comment')}>
							<button
								className={cx('change')}
								onClick={() =>
									changeComment(
										comment.id,
										comment.star,
										comment.content
									)
								}
							>
								Change
							</button>
							<button
								className={cx('remove')}
								onClick={() => removeComment(comment.id)}
							>
								Remove
							</button>
						</div>
					)}
				</div>
			))}

			{size < comments.length && (
				<button
					className={cx('more')}
					onClick={() => setSize((size) => (size += 5))}
				>
					More
				</button>
			)}

			{/* Change comment */}
			{isShowChangeCmt && (
				<div className={cx('change-cmt-wrap')}>
					<div className={cx('title')}>Change comment</div>
					<div className={cx('rate')}>
						<div className={cx('star-wrap')}>
							<FontAwesomeIcon
								className={cx('star', {
									active: star === 5,
								})}
								onClick={() => setStar(5)}
								icon={faStar}
							/>
							<FontAwesomeIcon
								className={cx('star', {
									active: star === 4,
								})}
								onClick={() => setStar(4)}
								icon={faStar}
							/>
							<FontAwesomeIcon
								className={cx('star', {
									active: star === 3,
								})}
								onClick={() => setStar(3)}
								icon={faStar}
							/>
							<FontAwesomeIcon
								className={cx('star', {
									active: star === 2,
								})}
								onClick={() => setStar(2)}
								icon={faStar}
							/>
							<FontAwesomeIcon
								className={cx('star', {
									active: star === 1,
								})}
								onClick={() => setStar(1)}
								icon={faStar}
							/>
						</div>
						<span>{star} Star</span>
					</div>
					<textarea
						className={cx('text')}
						placeholder='Write a Review...'
						onChange={(e) => writeReview(e)}
						defaultValue={oldContent}
					></textarea>
					<div className={cx('button')}>
						<button onClick={() => setIsShowChangeCmt(false)}>
							CANCEL
						</button>
						<button
							onClick={() => {
								saveComment();
							}}
						>
							SAVE
						</button>
					</div>
				</div>
			)}
		</div>
	);
}

export default Comments;
