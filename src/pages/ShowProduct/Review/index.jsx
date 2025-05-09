import { useContext, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Review.module.scss';
import { ReviewContext } from '..';

const cx = classNames.bind(styles);

function Review() {
	const [content, setContent] = useState('');
	const setReview = useContext(ReviewContext);

	const writeReview = (e) => {
		setTimeout(() => {
			setContent(e.target.value);
		}, 500);
	};

	return (
		<div className={cx('wrap')}>
			<textarea
				className={cx('text')}
				placeholder='Write a Review...'
				onChange={(e) => writeReview(e)}
			></textarea>
			<button
				className={cx('submit')}
				onClick={() => setReview(content)}
			>
				SEND
			</button>
		</div>
	);
}

export default Review;
