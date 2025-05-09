import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';

import styles from './ShowListProduct.module.scss';

const cx = classNames.bind(styles);

const ShowListProduct = () => {
	const [products, setProducts] = useState([]);

	// fetch products from server
	const fetchProducts = async () => {
		const response = await fetch('http://localhost:3001/api/admin');

		const data = await response.json();

		if (data) {
			setProducts(data);
		}
	};

	useEffect(() => {
		fetchProducts();
	}, []);

	return (
		<table className={cx('wrap')}>
			<thead>
				<tr>
					<th>STT</th>
					<th>Name</th>
					<th>Gender</th>
					<th>Brand</th>
					<th>Quantity</th>
					<th>Price</th>
				</tr>
			</thead>
			<tbody>
				{products.map((product, index) => (
					<tr
						className={cx('product')}
						key={product.id}
					>
						<td>{index + 1}</td>
						<td>{product.name}</td>
						<td>{product.gender}</td>
						<td>{product.brand}</td>
						<td>{product.amount}</td>
						<td>
							{new Intl.NumberFormat('vi-VN', {
								style: 'currency',
								currency: 'VND',
							}).format(product.price)}
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};

export default ShowListProduct;
