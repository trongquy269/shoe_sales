import classNames from 'classnames/bind';
import style from './Nothing.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGhost } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(style);

function Nothing() {
	return (
		<div className={cx('nothing')}>
			<FontAwesomeIcon
				icon={faGhost}
				className={cx('nothing-icon')}
			/>
			<div>Nothing Here !</div>
		</div>
	);
}

export default Nothing;
