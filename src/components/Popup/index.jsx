import {
	faXmark,
	faTriangleExclamation,
	faCircleCheck,
	faXmarkCircle,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useRef } from 'react';

import style from './Popup.module.scss';

const cx = classNames.bind(style);

function Popup({ content, type }) {
	const wrapRef = useRef();

	// const backgroundColor = type === 'error' ? '#EB455F' : '#F2921D';
	const backgroundColor =
		(type === 'error' && '#EB455F') ||
		(type === 'warning' && '#F2921D') ||
		(type === 'success' && '#30E3DF');

	const closeHandler = () => {
		wrapRef.current.style.display = 'none';
	};

	return (
		<div
			className={cx('wrap')}
			style={{ backgroundColor: backgroundColor }}
			ref={wrapRef}
		>
			<span className={cx('icon')}>
				{type === 'error' && (
					<FontAwesomeIcon icon={faXmarkCircle}></FontAwesomeIcon>
				)}
				{type === 'warning' && (
					<FontAwesomeIcon
						icon={faTriangleExclamation}
					></FontAwesomeIcon>
				)}
				{type === 'success' && (
					<FontAwesomeIcon icon={faCircleCheck}></FontAwesomeIcon>
				)}
			</span>
			<span className={cx('content')}>{content}</span>
			<span>
				<FontAwesomeIcon
					icon={faXmark}
					className={cx('close')}
					onClick={closeHandler}
				></FontAwesomeIcon>
			</span>
		</div>
	);
}

export default Popup;
