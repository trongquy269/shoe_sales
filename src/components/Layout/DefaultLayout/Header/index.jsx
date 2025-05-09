import { Fragment, useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faArrowRightFromBracket,
	faBagShopping,
	faMagnifyingGlass,
	faStore,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart, faUser } from '@fortawesome/free-regular-svg-icons';
import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import styles from './Header.module.scss';
import MenuDropdown from '../../../MenuDropdown';
import useDebounce from '../../../../hooks/useDebounce';

const cx = classNames.bind(styles);

function Header() {
	const [maxHeightHelp, setMaxHeightHelp] = useState(0);
	const [maxHeightUser, setMaxHeightUser] = useState(0);
	const [searchLeft, setSearchLeft] = useState('calc(100% - 144px - 110px)');
	const [searchWidth, setSearchWidth] = useState('220px');
	const [display, setDisplay] = useState('flex');
	const [headerHeight, setHeaderHeight] = useState('60px');
	const [headerTop, setHeaderTop] = useState('0');
	const [isOpenSearch, setIsOpenSearch] = useState(false);
	const [username, setUsername] = useState('Sign In');
	const [searchValue, setSearchValue] = useState('');
	const [searchResult, setSearchResult] = useState([]);

	// Get userToken from local storage
	const userToken = localStorage.getItem('token');

	const debounced = useDebounce(searchValue, 500);

	useEffect(() => {
		if (userToken) {
			// Decode the token to get the payload
			const decodedToken = jwtDecode(userToken);

			// Extract the id and user name from payload
			const { username } = decodedToken;
			setUsername(username);
		} else {
			setUsername('Sign In');
		}
	}, [userToken]);

	useEffect(() => {
		debounced.trim() &&
			fetch(
				`http://localhost:3001/search?q=${encodeURIComponent(
					debounced
				)}`
			)
				.then((res) => res.json())
				.then((res) => {
					setSearchResult(res);
				});
	}, [debounced]);

	let isFocus = false;
	let cancelDisplay = display === 'flex' ? 'none' : 'flex';

	const navigate = useNavigate();

	const inputRef = useRef(null);
	const searchRef = useRef(null);

	const handleMouseLeave = () => {
		!isFocus && setMaxHeightHelp(0);
		setMaxHeightUser(0);
	};

	const handleFocus = () => {
		isFocus = true;
		setMaxHeightHelp(300);
	};

	const handleBlur = () => {
		isFocus = false;
		setMaxHeightHelp(0);
	};

	const cartClick = () => {
		navigate('/cart');
	};

	const FavoritePageNav = () => {
		navigate('/favorite');
	};

	const logoClick = () => {
		navigate('/');
		window.location.reload(true);
	};

	const signInClick = () => {
		if (username === 'Sign In') {
			navigate('/signIn');
		}
	};

	const searchFocus = () => {
		setSearchLeft('50%');
		setTimeout(() => {
			setSearchWidth('656px');
		}, 100);
		setDisplay('none');
		setIsOpenSearch(true);

		setTimeout(() => {
			setHeaderHeight('300px');
			setHeaderTop('-36px');
		}, 200);
	};

	const closeSearch = () => {
		setSearchLeft('calc(100% - 144px - 110px)');
		setSearchWidth('220px');
		setDisplay('flex');
		setHeaderHeight('60px');
		setHeaderTop('0');
		setIsOpenSearch(false);
	};

	const logOutHandle = () => {
		setMaxHeightUser(0);
		localStorage.removeItem('token');
		window.location.reload(true);
	};

	const showItem = async (id, name) => {
		window.location.href = `/product?q=${id}&name=${encodeURIComponent(
			name
		)}`;
	};

	const handleNavigate = (nav) => {
		window.location.href = `/?q=${nav}`;
	};

	return (
		<Fragment>
			<div className={cx('header-top')}>
				<svg
					height='24px'
					width='24px'
					fill='#111'
					viewBox='0 0 26 32'
				>
					<path d='M14.4 5.52v-.08q0-.56.36-1t.92-.44 1 .36.48.96-.36 1-.96.4l-.24.08.08.12-.08.44-.16 1.28q.08.08.08.16l-.16.8q-.08.16-.16.24l-.08.32q-.16.64-.28 1.04t-.2.64V12q-.08.4-.12.64t-.28.8q-.16.32 0 1.04l.08.08q0 .24.2.56t.2.56q.08 1.6-.24 2.72l.16.48q.96.48.56 1.04l.4.16q.96.48 1.36.84t.8.76q.32.08.48.24l.24.08q1.68 1.12 3.36 2.72l.32.24v.08l-.08.16.24.16h.08q.24.16.32.16h.08q.08 0 .16-.08l.16-.08q.16-.16.32-.24h.32q.08 0 0 .08l-.32.16-.4.48h.56l.56.08q.24-.08.4-.16l.4-.24q.24-.08.48.16h.08q.08.08-.08.24l-.96.88q-.4.32-.72.4l-1.04.72q-.08.08-.16 0l-.24-.32-.16-.32-.2-.28-.24-.32-.2-.24-.16-.2-.32-.24q-.16 0-.32-.08l-1.04-.8q-.24 0-.56-.24-1.2-1.04-1.6-1.28l-.48-.32-.96-.16q-.48-.08-1.28-.48l-.64-.32q-.64-.32-.88-.32l-.32-.16q-.32-.08-.48-.16l-.16-.16q-.16 0-.32.08l-1.6.8-2 .88q-.8.64-1.52 1.04l-.88.4-1.36.96q-.16.16-.32 0l-.16.16q-.24.08-.32.08l-.32.16v.16h-.16l-.16.24q-.16.32-.32.36t-.2.12-.08.12l-.16.16-.24.16-.36-.04-.48.08-.32.08q-.4.08-.64-.12t-.4-.6q-.16-.24.16-.4l.08-.08q.08-.08.24-.08h.48L1.6 26l.32-.08q0-.16.08-.24.08-.08.24-.08v-.08q-.08-.16-.08-.32-.08-.16-.04-.24t.08-.08h.04l.08.24q.08.4.24.24l.08-.16q.08-.16.24-.16l.16.16.16-.16-.08-.08q0-.08.08-.08l.32-.32q.4-.48.96-.88 1.12-.88 2.4-1.36.4-.4.88-.4.32-.56.96-1.2.56-.4.8-.56.16-.32.4-.32H10l.16-.16q.16-.08.24-.16v-.4q0-.4.08-.64t.4-.24l.32-.32q-.16-.32-.16-.72h-.08q-.16-.24-.16-.48-.24-.4-.32-.64h-.24q-.08.24-.4.32l-.08.16q-.32.56-.56.84t-.88.68q-.4.4-.56.88-.08.24 0 .48l-.08.16h.08q0 .16.08.16h.08q.16.08.16.2t-.24.08-.36-.16-.2-.12l-.24.24q-.16.24-.32.2t-.08-.12l.08-.08q.08-.16 0-.16l-.64.16q-.08.08-.2 0t.04-.16l.4-.16q0-.08-.08-.08-.32.16-.64.08l-.4-.08-.08-.08q0-.08.08-.08.32.08.8-.08l.56-.24.64-.72.08-.16q.32-.64.68-1.16t.76-.84l.08-.32q.16-.32.32-.56t.4-.64l.24-.32q.32-.48.72-.48l.24-.24q.08-.08.08-.24l.16-.16-.08-.08q-.48-.4-.48-.72-.08-.56.36-.96t.88-.36.68.28l.16.16q.08 0 .08.08l.32.16v.24q.16.16.16.24.16-.24.48-.56l.4-1.28q0-.32.16-.64l.16-.24v-.16l.24-.96h.16l.24-.96q.08-.24 0-.56l-.32-.8z'></path>
				</svg>

				<div className={cx('navigation')}>
					<div
						className={cx('help-btn')}
						onMouseEnter={() => setMaxHeightHelp(300)}
						onMouseLeave={handleMouseLeave}
						onFocus={handleFocus}
						onBlur={handleBlur}
					>
						<button className={cx('title')}>Help</button>
						<MenuDropdown
							title={'Help'}
							width={'216px'}
							maxHeight={maxHeightHelp + 'px'}
						>
							<button className={cx('item')}>Contact US</button>
							<button className={cx('item')}>
								Send Us Feedback
							</button>
						</MenuDropdown>
					</div>
					<button>Join Us</button>
					<div
						className={cx('user')}
						onMouseEnter={() => setMaxHeightUser(300)}
						onMouseLeave={handleMouseLeave}
					>
						<button
							onClick={signInClick}
							className={cx('title')}
						>
							{username}
						</button>
						{username !== 'Sign In' && (
							<MenuDropdown
								title={username}
								width={'216px'}
								maxHeight={maxHeightUser + 'px'}
							>
								<button className={cx('item')}>
									<span>Profile</span>
									<FontAwesomeIcon icon={faUser} />
								</button>
								<button
									className={cx('item')}
									onClick={cartClick}
								>
									<span>Your cart</span>
									<FontAwesomeIcon icon={faStore} />
								</button>
								<button
									className={cx('item')}
									onClick={FavoritePageNav}
								>
									<span>Favorites</span>
									<FontAwesomeIcon icon={faHeart} />
								</button>
								<button
									className={cx('item')}
									onClick={logOutHandle}
								>
									<span>Log out</span>
									<FontAwesomeIcon
										icon={faArrowRightFromBracket}
									/>
								</button>
							</MenuDropdown>
						)}
					</div>
				</div>
			</div>

			<div
				style={{
					height: headerHeight,
					top: headerTop,
				}}
				className={cx('header')}
			>
				<button className={cx('logo')}>
					<img
						onClick={logoClick}
						src='../../../../../logo.png'
					></img>
				</button>

				<div
					style={{ display: display }}
					className={cx('navbar')}
				>
					<button onClick={() => handleNavigate('men')}>Men</button>
					<button onClick={() => handleNavigate('women')}>
						Women
					</button>
					<button onClick={() => handleNavigate('kid')}>Kids</button>
					<button onClick={() => handleNavigate('customize')}>
						Customize
					</button>
					<button onClick={() => handleNavigate('sale')}>Sale</button>
				</div>

				<div className={cx('tools')}>
					{/* Search */}
					<div
						ref={searchRef}
						className={cx('search')}
						style={{
							left: `${searchLeft}`,
							width: `${searchWidth}`,
						}}
					>
						<FontAwesomeIcon
							onClick={() => inputRef.current.focus()}
							className={cx('search-icon')}
							icon={faMagnifyingGlass}
						></FontAwesomeIcon>

						<input
							ref={inputRef}
							className={cx('search-input')}
							type='text'
							placeholder='Search'
							onFocus={searchFocus}
							onChange={(e) => setSearchValue(e.target.value)}
						></input>
					</div>

					<FontAwesomeIcon
						className={cx('tool-icon', 'heart')}
						icon={faHeart}
						style={{ display: display }}
						onClick={FavoritePageNav}
					></FontAwesomeIcon>

					<FontAwesomeIcon
						className={cx('tool-icon')}
						onClick={cartClick}
						icon={faBagShopping}
						style={{ display: display }}
					></FontAwesomeIcon>
				</div>

				<button
					style={{ display: cancelDisplay }}
					className={cx('cancel')}
					onClick={closeSearch}
				>
					Cancel
				</button>

				{isOpenSearch && (
					<div className={cx('popular-search-terms')}>
						{!searchResult.length && (
							<span className={cx('popular-search-title')}>
								Popular Search Terms
							</span>
						)}

						{!searchResult.length && (
							<div className={cx('popular-search-items')}>
								<button style={{ animationDelay: '.2s' }}>
									Air Force
								</button>
								<button style={{ animationDelay: '.25s' }}>
									Jordan
								</button>
								<button style={{ animationDelay: '.3s' }}>
									Air Max
								</button>
								<button style={{ animationDelay: '.35s' }}>
									Blazer
								</button>
							</div>
						)}

						{searchResult.length > 0 &&
							searchResult.map((item) => (
								<div
									className={cx('item')}
									key={item.id}
									onClick={() => showItem(item.id, item.name)}
								>
									<img src={item.img + '/img1.png'} />
									<div className={cx('info')}>
										<div className={cx('name')}>
											{item.name}
										</div>
										<div className={cx('more')}>
											<span>
												{'Type: ' + item.gender}
											</span>
											<span>
												{'Brand: ' + item.brand}
											</span>
											<span>
												Price:{' '}
												{new Intl.NumberFormat(
													'vi-VN',
													{
														style: 'currency',
														currency: 'VND',
													}
												).format(item.price)}
											</span>
										</div>
									</div>
								</div>
							))}
					</div>
				)}
			</div>

			{isOpenSearch && (
				<div
					onClick={closeSearch}
					className={cx('layer')}
				></div>
			)}
		</Fragment>
	);
}

export default Header;
