import {
	faCircleQuestion,
	faXmark,
	faGhost,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { faHeart, faTrashCan } from '@fortawesome/free-regular-svg-icons';

import style from './Cart.module.scss';
import Popup from '../../components/Popup';

const cx = classnames.bind(style);

function Cart() {
	const navigate = useNavigate();

	const [userID, setUserID] = useState(0);
	const [products, setProducts] = useState([]);
	const [subtotal, setSubtotal] = useState(0);
	const [delivery, setDelivery] = useState(0);
	const [total, setTotal] = useState(0);
	const [isShowFreeDeliveryNotify, setIsShowFreeDeliveryNotify] =
		useState(true);
	const [isShowError, setIsShowError] = useState(false);
	const [isShowPasswordInput, setIsShowPasswordInput] = useState(0);
	const [passwordInputMB, setPasswordInputMB] = useState(0);
	const [password, setPassword] = useState('');
	const [message, setMessage] = useState('');
	const [isBuy, setIsBuy] = useState(false);

	const passwordRef = useRef(null);

	useEffect(() => {
		setTotal(subtotal + delivery);
	}, [subtotal, delivery]);

	useEffect(() => {
		if (!delivery) {
			setIsShowFreeDeliveryNotify(true);
		} else {
			setIsShowFreeDeliveryNotify(false);
		}
	}, [delivery]);

	useEffect(() => {
		// Get userToken from local storage
		const userToken = localStorage.getItem('token');

		if (userToken) {
			const { id } = jwtDecode(userToken);
			setUserID(id);
		}
	}, [userID]);

	useEffect(() => {
		async function fetchData() {
			const response = await axios.get('http://localhost:3001/cart', {
				params: {
					userID,
				},
			});

			console.log(response.data);
			setProducts(response.data);
		}

		userID && fetchData();
	}, [userID]);

	useEffect(() => {
		let subtotal = 0;

		products.forEach((product) => {
			if (product.state === 'Waiting') {
				const discount = (product.price * product.discount) / 100;
				const price = (product.price - discount) * product.amount;
				subtotal += price;
			}
		});

		setSubtotal(subtotal);
	}, [products]);

	const moveFavoritePage = () => {
		if (userID) {
			navigate('/favorite');
		} else {
			navigate('/signIn');
		}
	};

	const favoriteHandle = (e, id) => {
		e.stopPropagation();

		if (userID) {
			e.target.classList.toggle(cx('active'));

			axios.post('http://localhost:3001/favorite', {
				userID,
				id,
			});

			window.location.reload(true);
		} else {
			navigate('/signIn');
		}
	};

	const showItem = async (id, name) => {
		window.location.href = `/product?q=${id}&name=${encodeURIComponent(
			name
		)}`;
	};

	const removeItem = (e, id, color, size) => {
		e.stopPropagation();

		if (userID) {
			axios.post('http://localhost:3001/remove-product-in-cart', {
				userID,
				id,
				color,
				size,
			});

			window.location.reload(true);
		}
	};

	const decreaseItem = (e, id, color, size, amount) => {
		e.stopPropagation();

		if (userID) {
			if (amount > 1) {
				axios.post('http://localhost:3001/decrease-product-in-cart', {
					userID,
					id,
					color,
					size,
				});

				window.location.reload(true);
			} else {
				setIsShowError('decrease');

				setTimeout(() => {
					setIsShowError(false);
				}, 5000);
			}
		}
	};

	const increaseItem = (e, id, color, size, amount) => {
		e.stopPropagation();

		if (userID) {
			if (amount < 10) {
				axios.post('http://localhost:3001/increase-product-in-cart', {
					userID,
					id,
					color,
					size,
				});

				window.location.reload(true);
			} else {
				setIsShowError('increase');

				setTimeout(() => {
					setIsShowError(false);
				}, 5000);
			}
		}
	};

	const checkPassword = async () => {
		try {
			const response = await axios.post(
				'http://localhost:3001/password-check',
				{
					userID,
					password,
				}
			);

			// Get token
			const result = response.data.result;
			console.log(result);

			if (result === 'True') {
				axios.post('http://localhost:3001/update-state-cart', {
					userID,
					content: 'Ordered',
				});

				setIsBuy(true);
				setTimeout(() => {
					setIsBuy(false);
				}, 5000);

				window.location.reload(true);
			} else {
				setMessage(response.data.message);

				passwordRef.current.style.borderColor =
					'var(--warning-text-color)';

				// Add shake animation
				passwordRef.current.style.animation = `${style.shake} 200ms 2`;

				// Reset shake animation
				setTimeout(() => {
					passwordRef.current.style.animation = '';
				}, 200);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const buyHandler = () => {
		if (password === '') {
			setPasswordInputMB(32);
			setTimeout(() => {
				setIsShowPasswordInput(400);
			}, 300);

			isShowPasswordInput && passwordRef.current.focus();
		} else {
			checkPassword();
		}
	};

	const cancelHandler = (e, productID, color, size) => {
		e.stopPropagation();

		try {
			axios.post('http://localhost:3001/cancel-order', {
				userID,
				productID,
				color,
				size,
			});

			window.location.reload(true);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		isShowPasswordInput && passwordRef.current.focus();
	}, [isShowPasswordInput]);

	return (
		<div className={cx('wrap')}>
			<div className={cx('info')}>
				{isShowFreeDeliveryNotify && (
					<div className={cx('free-delivery-notify')}>
						<div>
							<div className={cx('title')}>FREE DELIVERY</div>
							<div className={cx('desc')}>
								<span>
									Applies to orders of 5.000.000₫ or more.
								</span>
								<a href="">View details.</a>
							</div>
						</div>
						<FontAwesomeIcon
							icon={faXmark}
							className={cx('icon')}
							onClick={() => setIsShowFreeDeliveryNotify(false)}
						/>
					</div>
				)}

				<div className={cx('heading')}>Bag</div>
				<div className={cx('products')}>
					{products.length !== 0 &&
						products.map((product, index) => (
							<div
								key={index}
								className={
									(product.state === 'Ordered' &&
										cx(['item', 'ordered'])) ||
									cx('item')
								}
								onClick={() =>
									showItem(product.productID, product.name)
								}
							>
								<img src={product.img + '/img1.png'} />
								<div className={cx('product-info')}>
									<div className={cx('name')}>
										{product.name}
									</div>
									<div className={cx('brand')}>
										{'Brand: ' + product.brand}
									</div>
									<div className={cx('color')}>
										{'Color: ' + product.color}
									</div>
									<div className={cx('size-and-quantity')}>
										<div className={cx('size')}>
											{'Size: ' + product.size}
										</div>

										<div className={cx('quantity')}>
											<div
												className={cx('btn')}
												onClick={(
													e,
													id = product.productID,
													color = product.color,
													size = product.size,
													amount = product.amount
												) =>
													decreaseItem(
														e,
														id,
														color,
														size,
														(amount =
															product.amount)
													)
												}
											>
												&#x2212;
											</div>
											<div className={cx('label')}>
												{'Quantity: ' + product.amount}
											</div>
											<div
												className={cx('btn')}
												onClick={(
													e,
													id = product.productID,
													color = product.color,
													size = product.size,
													amount = product.amount
												) =>
													increaseItem(
														e,
														id,
														color,
														size,
														(amount =
															product.amount)
													)
												}
											>
												+
											</div>
										</div>
									</div>

									<div className={cx('more')}>
										<FontAwesomeIcon
											icon={faHeart}
											className={
												(product.favorite === 'Yes' &&
													cx([
														'favorite',
														'active',
													])) ||
												cx('favorite')
											}
											onClick={(
												e,
												id = product.productID
											) =>
												favoriteHandle(
													e,
													(id = product.productID)
												)
											}
										></FontAwesomeIcon>
										{product.state === 'Waiting' && (
											<FontAwesomeIcon
												icon={faTrashCan}
												onClick={(
													e,
													id = product.productID,
													color = product.color,
													size = product.size
												) =>
													removeItem(
														e,
														id,
														color,
														size
													)
												}
											/>
										)}
										{product.state === 'Ordered' && (
											<button
												className={cx('cancel')}
												onClick={(
													e,
													id = product.productID,
													color = product.color,
													size = product.size
												) =>
													cancelHandler(
														e,
														id,
														color,
														size
													)
												}
											>
												CANCEL
											</button>
										)}
									</div>
								</div>
								<div className={cx('price-and-state')}>
									<div className={cx('price')}>
										{product.discount != 0 && (
											<div
												style={{
													textDecoration:
														'line-through',
												}}
												className={cx('price-old')}
											>
												{new Intl.NumberFormat(
													'vi-VN',
													{
														style: 'currency',
														currency: 'VND',
													}
												).format(product.price)}
											</div>
										)}

										<div>
											{new Intl.NumberFormat('vi-VN', {
												style: 'currency',
												currency: 'VND',
											}).format(
												product.price -
													(product.price *
														product.discount) /
														100
											)}
										</div>
									</div>
									<div>{'State: ' + product.state}</div>
								</div>

								{product.discount !== 0 && (
									<div className={cx('discount')}>
										{'- ' + product.discount + '%'}
									</div>
								)}
							</div>
						))}

					{products.length === 0 && (
						<div className={cx('nothing')}>
							<FontAwesomeIcon
								icon={faGhost}
								className={cx('nothing-icon')}
							/>
							<div>Nothing Here !</div>
						</div>
					)}
				</div>

				<div className={cx('heading')}>Favorites</div>
				<div className={cx('favorite')}>
					<span>Want to view your favorites?</span>
					<button onClick={moveFavoritePage}>
						{(userID && 'Move') || 'Sign In'}
					</button>
				</div>
			</div>

			<div className={cx('summary')}>
				<div className={cx('heading')}>Summary</div>
				<div className={cx('subtotal')}>
					<div className={cx('title')}>
						<span>Subtotal</span>
						<FontAwesomeIcon
							icon={faCircleQuestion}
							className={cx('icon')}
						/>
					</div>
					<span className={cx('price')}>
						{new Intl.NumberFormat('vi-VN', {
							style: 'currency',
							currency: 'VND',
						}).format(subtotal)}
					</span>
				</div>

				<div className={cx('delivery')}>
					<div className={cx('title')}>
						<span>Estimates Delivery</span>
					</div>
					<span className={cx('price')}>
						{delivery === 0
							? 'Free'
							: new Intl.NumberFormat('vi-VN', {
									style: 'currency',
									currency: 'VND',
							  }).format(delivery)}
					</span>
				</div>

				<div className={cx('total')}>
					<div className={cx('title')}>
						<span>Total</span>
					</div>
					<span className={cx('price')}>
						{new Intl.NumberFormat('vi-VN', {
							style: 'currency',
							currency: 'VND',
						}).format(total)}
					</span>
				</div>

				<div
					className={cx('confirm')}
					style={{
						maxHeight: isShowPasswordInput + 'px',
						marginBottom: passwordInputMB + 'px',
					}}
				>
					<label htmlFor="password">
						Enter the password to confirm the purchase
					</label>
					<input
						id="password"
						type="password"
						placeholder="Password"
						ref={passwordRef}
						onInput={(e) => setPassword(e.target.value)}
					></input>
					{message && (
						<span className={cx('message')}>{message}</span>
					)}
				</div>

				<button
					className={
						(total === 0 && cx(['buy', 'disable'])) || cx('buy')
					}
					onClick={buyHandler}
				>
					BUY
				</button>
			</div>

			{isShowError === 'decrease' && (
				<Popup
					content={
						'You must buy the product in a minimum quantity of 1'
					}
					type="error"
				/>
			)}

			{isShowError === 'increase' && (
				<Popup
					content={
						'You must buy the product in a maximum quantity of 10'
					}
					type="error"
				/>
			)}

			{isBuy && (
				<Popup
					content={'Ordered successfully'}
					type="success"
				/>
			)}
		</div>
	);
}

export default Cart;
