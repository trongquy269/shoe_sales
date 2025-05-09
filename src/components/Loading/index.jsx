import classNames from 'classnames/bind';

import style from './Loading.module.scss';

const cx = classNames.bind(style);

function Loading() {
	return <span className={cx('loader')}></span>;
}

export default Loading;
