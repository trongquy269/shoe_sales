import axios from 'axios';
import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import jwtDecode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { faGhost } from '@fortawesome/free-solid-svg-icons';

import style from './Favorite.module.scss';
import Nothing from '../../components/Nothing';

const cx = classNames.bind(style);

function Favorite() {
	const [userID, setUserID] = useState(null);
	const [products, setProducts] = useState([]);
	const [favorite, setFavorite] = useState({});

	useEffect(() => {
		// Get userToken from local storage
		const userToken = localStorage.getItem('token');

		if (userToken) {
			const { id } = jwtDecode(userToken);
			id !== userID && setUserID(id);
		}

		async function fetchData() {
			const response = await axios.get('http://localhost:3001/favorite', {
				params: {
					userID,
				},
			});

			setProducts(response.data);
			fetchPost();
		}

		userID && fetchData();
	}, [userID]);

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

	const showItem = async (id, name) => {
		window.location.href = `/product?q=${id}&name=${encodeURIComponent(
			name
		)}`;
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

			fetchPost();
		}
	};
	console.log(products);

	return (
		<div className={cx('wrap')}>
			{products.length !== 0 &&
				products.map((product) => (
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

			{products.length === 0 && <Nothing />}
		</div>
	);
}

export default Favorite;
