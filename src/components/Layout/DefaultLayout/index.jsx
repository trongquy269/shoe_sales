import classNames from 'classnames/bind';
import {
	faAngleDown,
	faAngleUp,
	faSliders,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Header from './Header';
import Sidebar from './Sidebar';
import styles from './DefaultLayout.module.scss';
import {useState, createContext, useEffect} from 'react';

const cx = classNames.bind(styles);
export const SortContext = createContext();

function DefaultLayout ({children}) {
	const [isAnimating, setIsAnimating] = useState(false);
	const [hideFilter, setHideFilter] = useState(false);
	const [sidebarWidth, setSidebarWidth] = useState('260px');
	const [sidebarMarginRight, setSidebarMarginRight] = useState(
		'var(--margin-distance)'
	);
	const [isExtend, setIsExtend] = useState(false);
	const [maxHeight, setMaxHeight] = useState(0);
	const [sort, setSort] = useState('');
	const [filters, setFilters] = useState([]);

	const hideFilterHandle = () => {
		if (!hideFilter) {
			setSidebarWidth('0px');
			setSidebarMarginRight('0');
		} else {
			setSidebarWidth('260px');
			setSidebarMarginRight('var(--margin-distance)');
		}

		setHideFilter((hideFilter) => !hideFilter);
	};

	const handleSort = () => {
		if (isExtend) {
			setMaxHeight(0);
		} else {
			setMaxHeight('200px');
		}
		setIsExtend((isExtend) => !isExtend);
	};

	const closeSort = () => {
		setMaxHeight(0);
		setIsExtend(false);
	};

	useEffect(() => {
		const timer = setInterval(() => {
			setIsAnimating(true);

			setTimeout(() => {
				setIsAnimating(false);
			}, 800);
		}, 10000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
		<SortContext.Provider value={{sort, filters, setFilters}}>
			<div>
				<Header />
				<div className={cx('container')}>
					<div className={cx('tools')}>
						<span className={isAnimating ? cx('title', 'shine') : cx('title')}>Let your feet do the talking</span>
						<div className={cx('items')}>
							<div onClick={hideFilterHandle}>
								<span>Hide Filters</span>
								<FontAwesomeIcon
									icon={faSliders}
								></FontAwesomeIcon>
							</div>
							<div
								onBlur={closeSort}
								onClick={handleSort}
							>
								<span>Sort By</span>
								<div className={cx('icon')}>
									{!isExtend && (
										<FontAwesomeIcon
											icon={faAngleDown}
										></FontAwesomeIcon>
									)}
									{isExtend && (
										<FontAwesomeIcon
											icon={faAngleUp}
										></FontAwesomeIcon>
									)}
								</div>
								<div
									style={{
										maxHeight: maxHeight,
									}}
									className={cx('dropdown')}
								>
									<button onClick={() => setSort('Featured')}>
										Featured
									</button>
									<button onClick={() => setSort('Newest')}>
										Newest
									</button>
									<button
										onClick={() => setSort('PriceHigh2Low')}
									>
										Price: High - Low
									</button>
									<button
										onClick={() => setSort('PriceLow2High')}
									>
										Price: Low - High
									</button>
								</div>
							</div>
						</div>
					</div>
					<div className={cx('wrap')}>
						<Sidebar
							width={sidebarWidth}
							marginRight={sidebarMarginRight}
						/>
						<div className={cx('content')}>{children}</div>
					</div>
				</div>
			</div>
		</SortContext.Provider>
	);
}

export default DefaultLayout;
