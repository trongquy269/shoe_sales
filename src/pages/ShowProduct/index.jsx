import axios from 'axios';
import { useEffect, useState, Fragment, createContext } from 'react';
import classnames from 'classnames/bind';
import jwtDecode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faAngleDown, faStar } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Popup from '../../components/Popup';

import style from './ShowProduct.module.scss';
import Review from './Review';
import Comments from './Comments';

const cx = classnames.bind(style);
export const ReviewContext = createContext();

function ShowProduct() {
	const [url, setUrl] = useState(window.location.href);
	const [product, setProduct] = useState('');
	const [colorValue, setColorValue] = useState('');
	const [sizeValue, setSizeValue] = useState(0);
	const [imageLength, setImageLength] = useState(0);
	const [imageList, setImageList] = useState([]);
	const [userID, setUserID] = useState(null);
	const [colorList, setColorList] = useState([]);
	const [sizeList, setSizeList] = useState([]);
	const [favorite, setFavorite] = useState({});
	const [deliveryMore, setDeliveryMore] = useState(false);
	const [reviewsMore, setReviewsMore] = useState(false);
	const [isPopup, setIsPopup] = useState(false);
	const [isAddBag, setIsAddBag] = useState(false);
	const [isShowReview, setIsShowReview] = useState(false);
	const [activeStar, setActiveStar] = useState(0);
	const [comments, setComments] = useState([]);
	const [starRate, setStarRate] = useState(0);
	const [review, setReview] = useState('');
	const [idComment, setIDComment] = useState(0);

	const navigate = useNavigate();

	useEffect(() => {
		// Get userToken from local storage
		const userToken = localStorage.getItem('token');

		if (userToken) {
			const { id } = jwtDecode(userToken);
			id !== userID && setUserID(id);
		}
	}, [userID]);

	useEffect(() => {
		const startIndex = url.indexOf('?') + 1;
		const newUrl = url.substring(startIndex);

		async function fetchApi() {
			if (newUrl === '') return;
			const startIndex = newUrl.indexOf('q=') + 2;
			const endIndex = newUrl.indexOf('&name');
			const id = newUrl.substring(startIndex, endIndex);

			const response = await axios.get(
				'http://localhost:3001/get/product',
				{
					params: {
						id,
					},
				}
			);

			setProduct(response.data.data[0]);
			setImageLength(response.data.imageLength);
			setColorList(response.data.colors);
			setSizeList(response.data.sizes);
		}

		fetchApi();
	}, [url]);

	const getComments = async () => {
		const response = await axios.get('http://localhost:3001/feedback', {
			params: {
				productID: product.id,
			},
		});

		setComments(response.data);
	};

	useEffect(() => {
		const arr = [];

		for (let i = 1; i <= imageLength; i++) {
			arr.push(product.img + `/img${i}.png`);
		}

		setImageList(arr);
		getComments();
	}, [product]);

	const fetchPost = async () => {
		const response = await fetch(
			`http://localhost:3001/home?auth_id=${userID}`
		);
		const data = await response.json();
		const favorite = data.favorite;
		if (favorite) {
			const obj = favorite.reduce((acc, curr) => {
				acc[curr.productID] = true;
				return acc;
			}, {});
			setFavorite(obj);
		}
	};

	useEffect(() => {
		fetchPost();
	}, [userID]);

	const favoriteHandle = (e, id) => {
		if (userID) {
			e.target.classList.toggle(cx('active'));

			axios.post('http://localhost:3001/favorite', {
				userID,
				id,
			});
		} else {
			navigate('/signIn');
		}
	};

	const addCart = () => {
		axios.post(`http://localhost:3001/add-cart`, {
			userID,
			color: colorValue,
			size: sizeValue,
			id: product.id,
		});
	};

	const buyHandler = () => {
		if (userID) {
			if (colorValue && sizeValue) {
				// Show popup
				setIsAddBag(true);

				setTimeout(() => {
					setIsAddBag(false);
				}, 5000);

				// send request
				addCart();
			} else {
				if (!colorValue) {
					setIsPopup('color');

					setTimeout(() => {
						setIsPopup(false);
					}, 5000);
				} else {
					setIsPopup('size');

					setTimeout(() => {
						setIsPopup(false);
					}, 5000);
				}
			}
		} else {
			navigate('/signIn');
		}
	};

	const handleStar = (star) => {
		if (userID) {
			console.log(userID, product.id, star);
			if (activeStar === 0) {
				axios.post('http://localhost:3001/add-feedback', {
					userID,
					productID: product.id,
					star,
					content: "The customer didn't write anything",
				});
			} else {
				axios.post('http://localhost:3001/update-feedback-non-id', {
					userID,
					productID: product.id,
					star,
					content: "The customer didn't write anything",
				});
			}
			setActiveStar(star);
		}
	};

	useEffect(() => {
		const star = comments.reduce((acc, curr) => {
			return acc + curr.star;
		}, 0);

		const starRate = Math.round(star / comments.length);
		setStarRate(starRate);
	}, [comments]);

	// Send review
	useEffect(() => {
		setIsShowReview(false);

		axios.post('http://localhost:3001/update-feedback-non-id', {
			userID,
			productID: product.id,
			star: activeStar,
			content: review,
		});
	}, [review]);

	return (
		<ReviewContext.Provider value={setReview}>
			<div className={cx('wrap')}>
				<div className={cx('image-wrap')}>
					{imageList.map((url, index) => (
						<img
							src={url}
							key={index}
						/>
					))}
				</div>
				<div className={cx('info-wrap')}>
					{!userID && (
						<div className={cx('warning')}>Member Access</div>
					)}
					<div className={cx('name')}>{product.name}</div>
					<div className={cx('type')}>{product.gender}</div>
					<div className={cx('price')}>
						<div>
							{new Intl.NumberFormat('vi-VN', {
								style: 'currency',
								currency: 'VND',
							}).format(
								product.price -
									(product.price * product.discount) / 100
							)}
						</div>
						{product.discount != 0 && (
							<div
								style={{
									textDecoration: 'line-through',
								}}
							>
								{new Intl.NumberFormat('vi-VN', {
									style: 'currency',
									currency: 'VND',
								}).format(product.price)}
							</div>
						)}
					</div>
					<div className={cx('color-title')}>
						<span>Select Color</span>
						<span>Color guide</span>
					</div>
					<div className={cx('color-list')}>
						{colorList.map((color, index) => (
							<Fragment key={index}>
								<input
									type='radio'
									name='color'
									id={color.color}
									value={color.color}
									checked={colorValue === color.color}
									onChange={(e) =>
										setColorValue(e.target.value)
									}
									hidden
								></input>
								<label htmlFor={color.color}>
									{color.color}
								</label>
							</Fragment>
						))}
					</div>
					<div className={cx('size-title')}>
						<span>Select Size</span>
						<span>Size guide</span>
					</div>
					<div className={cx('size-list')}>
						{sizeList.map((size, index) => (
							<Fragment key={index}>
								<input
									type='radio'
									name='size'
									id={size.size}
									value={size.size}
									checked={sizeValue == size.size}
									onChange={(e) =>
										setSizeValue(e.target.value)
									}
									hidden
								></input>
								<label htmlFor={size.size}>{size.size}</label>
							</Fragment>
						))}
					</div>
					<button
						className={cx('buy')}
						onClick={buyHandler}
					>
						{userID ? 'Add to Bag' : 'Sign In to Buy'}
					</button>
					<div
						className={
							favorite[product.id]
								? cx(['favorite', 'active'])
								: cx('favorite')
						}
						onClick={(e, id = product.id) =>
							favoriteHandle(e, (id = product.id))
						}
					>
						<span>Favorite</span>
						<FontAwesomeIcon
							icon={faHeart}
							className={cx('favorite-icon')}
						></FontAwesomeIcon>
					</div>
					<div className={cx('description')}>
						{product.description}
					</div>
					<div className={cx('more')}>
						<div
							className={cx('header')}
							onClick={() => setDeliveryMore(!deliveryMore)}
						>
							<span>Free Delivery and Returns</span>
							<FontAwesomeIcon icon={faAngleDown} />
						</div>
						{deliveryMore && (
							<div className={cx('content')}>
								<div>
									Your order of 5.000.000₫ or more gets free
									standard delivery.
								</div>
								<ul>
									<li>
										Standard delivered 4-5 Business Days
									</li>
									<li>Express delivered 2-4 Business Days</li>
								</ul>
								<div>
									Orders are processed and delivered
									Monday-Friday (excluding public holidays)
								</div>
								<div>
									Nike Members enjoy{' '}
									<a href=''>free returns</a>.
								</div>
							</div>
						)}
					</div>
					<div className={cx('more')}>
						<div
							className={cx('header')}
							onClick={() => setReviewsMore(!reviewsMore)}
						>
							<span>Reviews ({comments.length})</span>
							<span>
								<div className={cx('star-wrap')}>
									<FontAwesomeIcon
										className={cx('star', {
											active: starRate === 5,
										})}
										icon={faStar}
									/>
									<FontAwesomeIcon
										className={cx('star', {
											active: starRate === 4,
										})}
										icon={faStar}
									/>
									<FontAwesomeIcon
										className={cx('star', {
											active: starRate === 3,
										})}
										icon={faStar}
									/>
									<FontAwesomeIcon
										className={cx('star', {
											active: starRate === 2,
										})}
										icon={faStar}
									/>
									<FontAwesomeIcon
										className={cx('star', {
											active: starRate === 1,
										})}
										icon={faStar}
									/>
								</div>
								<FontAwesomeIcon icon={faAngleDown} />
							</span>
						</div>
						{reviewsMore && (
							<div className={cx('content')}>
								<Comments
									userID={userID}
									productID={product.id}
								/>
								<div className={cx('rate')}>
									<div className={cx('star-wrap')}>
										<FontAwesomeIcon
											className={cx('star', {
												active: activeStar === 5,
											})}
											onClick={() => handleStar(5)}
											icon={faStar}
										/>
										<FontAwesomeIcon
											className={cx('star', {
												active: activeStar === 4,
											})}
											onClick={() => handleStar(4)}
											icon={faStar}
										/>
										<FontAwesomeIcon
											className={cx('star', {
												active: activeStar === 3,
											})}
											onClick={() => handleStar(3)}
											icon={faStar}
										/>
										<FontAwesomeIcon
											className={cx('star', {
												active: activeStar === 2,
											})}
											onClick={() => handleStar(2)}
											icon={faStar}
										/>
										<FontAwesomeIcon
											className={cx('star', {
												active: activeStar === 1,
											})}
											onClick={() => handleStar(1)}
											icon={faStar}
										/>
									</div>
									<span>{activeStar} Star</span>
								</div>
								<div>
									Have your say. Be the first to review the
									Nike Wildhorse 8.
								</div>
								<div>
									{!isShowReview && (
										<button
											className={cx('review-btn')}
											onClick={() =>
												setIsShowReview(true)
											}
										>
											Write a Review
										</button>
									)}
									{isShowReview && <Review />}
								</div>
							</div>
						)}
					</div>
					{product.discount !== 0 && (
						<div className={cx('discount')}>
							{'- ' + product.discount + '%'}
						</div>
					)}
				</div>
				{isPopup === 'color' && (
					<Popup
						content='Select the COLOR of the product, please!'
						type='error'
					/>
				)}
				{isPopup === 'size' && (
					<Popup
						content='Select the SIZE of the product, please!'
						type='error'
					/>
				)}
				{isAddBag && (
					<Popup
						content='Added to Bag'
						type='success'
					/>
				)}
			</div>
		</ReviewContext.Provider>
	);
}

export default ShowProduct;
