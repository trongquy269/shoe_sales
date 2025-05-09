import { Fragment, useEffect, useState, useContext } from 'react';
import classnames from 'classnames/bind';
import jwtDecode from 'jwt-decode';
import axios from 'axios';

import styles from '../Home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { SortContext } from '../../../components/Layout/DefaultLayout';

const cx = classnames.bind(styles);

function GetProduct({ size }) {
	const [userID, setUserID] = useState(null);
	const [products, setProducts] = useState([]);
	const [productsOrigin, setProductsOrigin] = useState([]);
	const [favorite, setFavorite] = useState({});
	const [colors, setColors] = useState([]);

	const { sort, filters } = useContext(SortContext);

	// Navigation
	const [url, setUrl] = useState(window.location.href);

	useEffect(() => {
		if (url && url.includes('=') && productsOrigin.length !== 0) {
			const index = url.indexOf('=');
			const navigate = url.substring(index + 1);

			if (
				navigate === 'men' ||
				navigate === 'women' ||
				navigate === 'kid'
			) {
				setProducts(
					[...productsOrigin].filter((item) =>
						item.gender.toLowerCase().includes(navigate)
					)
				);
			} else if (navigate === 'customize') {
				setProducts(
					[...productsOrigin].filter((item) =>
						item.name.toLowerCase().includes(navigate)
					)
				);
			} else if (navigate === 'sale') {
				setProducts(
					[...productsOrigin].filter((item) => item.discount !== 0)
				);
			}
		}
	}, [productsOrigin]);

	// Sorts
	useEffect(() => {
		if (sort === 'Newest') {
			const sortedProducts = [...products].sort(
				(a, b) => new Date(b.import_date) - new Date(a.import_date)
			);

			setProducts(sortedProducts);
		} else if (sort === 'PriceHigh2Low') {
			const sortedProducts = [...products].sort(
				(a, b) => b.price - a.price
			);

			setProducts(sortedProducts);
		} else if (sort === 'PriceLow2High') {
			const sortedProducts = [...products].sort(
				(a, b) => a.price - b.price
			);

			setProducts(sortedProducts);
		} else if (sort === 'Featured') {
			const sortedProducts = [...products].sort(
				(a, b) => b.color - a.color
			);

			setProducts(sortedProducts);
		}
	}, [sort]);

	// Filters
	useEffect(() => {
		setProducts(
			[...productsOrigin].filter((item) => {
				const checkList = [];

				for (let i = 0; i < filters.length; i++) {
					let check = true;

					// Gender
					if (
						filters[i] === 'Men' ||
						filters[i] === 'Women' ||
						filters[i] === 'Unisex' ||
						filters[i] === 'Boys' ||
						filters[i] === 'Girls'
					) {
						check = item.gender.includes(filters[i]);
						if (filters[i] === 'Unisex') {
							check =
								item.gender.includes('Shoes') &&
								!item.gender.includes('Kid');
						}
						checkList.push(check);
					}

					// Price
					if (
						filters[i] === '1000' ||
						filters[i] === '1001-2700' ||
						filters[i] === '2701-3999' ||
						filters[i] === '4000'
					) {
						if (filters[i].includes('under')) {
							const index = filters[i].indexOf('under');
							const price = filters[i].slice(0, index - 1);
							const priceNum = parseInt(price + '000');
							check = item.price <= priceNum;
							checkList.push(check);
						} else if (filters[i].includes('over')) {
							const index = filters[i].indexOf('over');
							const price = filters[i].slice(0, index - 1);
							const priceNum = parseInt(price + '000');
							check = item.price >= priceNum;
							checkList.push(check);
						} else {
							const index = filters[i].indexOf('-');
							const price1 = filters[i].slice(0, index);
							const price2 = filters[i].slice(index + 1);
							const priceNum1 = parseInt(price1 + '000');
							const priceNum2 = parseInt(price2 + '000');
							check =
								item.price >= priceNum1 &&
								item.price <= priceNum2;
							checkList.push(check);
						}
					}

					// Brand
					if (
						filters[i] === 'Nike' ||
						filters[i] === 'Adidas' ||
						filters[i] === 'Puma' ||
						filters[i] === 'New Balance' ||
						filters[i] === 'Converse'
					) {
						check = item.brand.includes(filters[i]);
						checkList.push(check);
					}

					// Color
					if (
						filters[i] === 'Purple' ||
						filters[i] === 'Black' ||
						filters[i] === 'Red' ||
						filters[i] === 'Orange' ||
						filters[i] === 'Blue' ||
						filters[i] === 'White' ||
						filters[i] === 'Brown' ||
						filters[i] === 'Green' ||
						filters[i] === 'Yellow' ||
						filters[i] === 'Multi-color' ||
						filters[i] === 'Gray' ||
						filters[i] === 'Pink'
					) {
						colors.forEach((color) => {
							if (color.productID === item.id) {
								check = false;
								const color1 = color.color.toLowerCase();
								const color2 = filters[i].toLowerCase();

								if (color1.includes(color2)) {
									check = true;
									return;
								}
							}
						});

						checkList.push(check);
					}
				}

				if (checkList.includes(true)) return true;
				else if (filters.length === 0) return true;
				else return false;
			})
		);
	}, [filters]);

	// Get userToken from local storage
	const userToken = localStorage.getItem('token');

	if (userToken) {
		const { id } = jwtDecode(userToken);
		id !== userID && setUserID(id);
	}

	// Get products and check products were favorite by user
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
		setProducts(data.products);
		setProductsOrigin(data.products);
	};

	const getColor = async () => {
		const response = await fetch('http://localhost:3001/api/colors');
		const data = await response.json();
		setColors(data);
	};

	useEffect(() => {
		fetchPost();
		getColor();
	}, []);

	// Show product if user click in it
	const showItem = async (id, name) => {
		window.open(
			`/product?q=${id}&name=${encodeURIComponent(name)}`,
			'_blank'
		);
	};

	const favoriteHandle = (e, id) => {
		e.stopPropagation();

		if (userID) {
			e.target.classList.toggle(cx('active'));

			axios.post('http://localhost:3001/favorite', {
				userID,
				id,
			});
		}
	};

	return (
		<Fragment>
			{products.length !== 0 &&
				products.slice(0, size).map((product) => (
					<div
						className={cx('items')}
						key={product.id}
						onClick={() => showItem(product.id, product.name)}
					>
						<img src={product.img + '/img1.png'} />
						<div className={cx('info')}>
							<div className={cx('name')}>{product.name}</div>
							<div className={cx('gender')}>{product.gender}</div>
							<div className={cx('color')}>
								{product.color > 1
									? product.color + ' colors'
									: product.color + ' color'}
							</div>
							<div className={cx('price')}>
								{product.discount !== 0 && (
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
								<div>
									{new Intl.NumberFormat('vi-VN', {
										style: 'currency',
										currency: 'VND',
									}).format(
										product.price -
											(product.price * product.discount) /
												100
									)}
								</div>
							</div>
						</div>
						<FontAwesomeIcon
							icon={faHeart}
							className={
								(favorite[product.id] &&
									cx(['favorite', 'active'])) ||
								cx('favorite')
							}
							onClick={(e, id = product.id) =>
								favoriteHandle(e, (id = product.id))
							}
						></FontAwesomeIcon>

						{product.discount !== 0 && (
							<div className={cx('discount')}>
								{'- ' + product.discount + '%'}
							</div>
						)}
					</div>
				))}
		</Fragment>
	);
}

export default GetProduct;
