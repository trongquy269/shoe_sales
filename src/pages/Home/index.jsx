import { useRef, useEffect, useState } from 'react';
import classnames from 'classnames/bind';

import styles from './Home.module.scss';
import GetProduct from './GetProduct';

const cx = classnames.bind(styles);

function Home() {
	const [isScrollBottom, setIsScrollBottom] = useState(false);
	const [displayedProducts, setDisplayedProducts] = useState(9);

	const listInnerRef = useRef();

	const onScroll = () => {
		if (listInnerRef.current) {
			const { scrollTop, scrollHeight, clientHeight } =
				listInnerRef.current;
			const currentScroll = Math.round(scrollTop + clientHeight);

			if (currentScroll === scrollHeight && !isScrollBottom) {
				setIsScrollBottom(true);
			} else {
				isScrollBottom && setIsScrollBottom(false);
			}
		}
	};

	useEffect(() => {
		if (isScrollBottom) {
			setDisplayedProducts((prev) => (prev += 9));
		}
	}, [isScrollBottom]);

	return (
		<div
			className={cx('wrap')}
			onScroll={() => onScroll()}
			ref={listInnerRef}
		>
			<GetProduct size={displayedProducts}></GetProduct>
		</div>
	);
}

export default Home;
