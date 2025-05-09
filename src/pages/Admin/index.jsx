import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortDown } from '@fortawesome/free-solid-svg-icons';

import style from './Admin.module.scss';
import ShowListProduct from './ShowListProduct';

const cx = classNames.bind(style);

function Admin() {
	// const [users, setUsers] = useState([]);
	// const [products, setProducts] = useState([]);
	const [sort, setSort] = useState('A - Z');
	const [brand, setBrand] = useState('All');
	const [gender, setGender] = useState('All');

	// const fetchPost = async () => {
	// 	const responseUser = await fetch('http://localhost:3001/api/accounts');
	// 	const responseProd = await fetch('http://localhost:3001/api/admin');
	// 	const dataUser = await responseUser.json();
	// 	const dataProd = await responseProd.json();
	// 	setUsers(dataUser);
	// 	setProducts(dataProd);
	// };

	// useEffect(() => {
	// 	fetchPost();
	// }, []);

	// const showHandle = (id) => {
	// 	console.log(id);
	// };

	return (
		<div className={cx('wrap')}>
			<div className={cx('navbar')}>
				<h1 className={cx('heading')}>ADMIN</h1>
				<ul className={cx('nav')}>
					<li className={cx('item')}>Products</li>
					<li className={cx('item', 'child')}>Discounting</li>
					<li className={cx('item', 'child')}>Sales History</li>
					<li className={cx('item', 'child')}>Import History</li>
					<li className={cx('item', 'child')}>Sales</li>
					<li className={cx('item')}>Users</li>
				</ul>
			</div>

			<div className={cx('content')}>
				<ul className={cx('tools')}>
					<li className={cx('item')}>
						<div className={cx('title')}>Gender: {gender}</div>
						<ul className={cx('dropdown')}>
							<li onClick={() => setGender('All')}>All</li>
							<li onClick={() => setGender('Men')}>Men</li>
							<li onClick={() => setGender('Women')}>Women</li>
							<li onClick={() => setGender('Unisex')}>Unisex</li>
							<li onClick={() => setGender('Kid')}>Kid</li>
							<li onClick={() => setGender('Other')}>Other</li>
						</ul>
					</li>
					<li className={cx('item')}>
						<div className={cx('title')}>Brand: {brand}</div>
						<ul className={cx('dropdown')}>
							<li onClick={() => setBrand('All')}>All</li>
							<li onClick={() => setBrand('Nike')}>Nike</li>
							<li onClick={() => setBrand('Adidas')}>Adidas</li>
							<li onClick={() => setBrand('Puma')}>Puma</li>
							<li onClick={() => setBrand('New Balance')}>
								New Balance
							</li>
							<li onClick={() => setBrand('Converse')}>
								Converse
							</li>
							<li onClick={() => setBrand('Other')}>Other</li>
						</ul>
					</li>
					<li className={cx('item')}>
						<div className={cx('title')}>Sort: {sort}</div>
						<ul className={cx('dropdown')}>
							<li onClick={() => setSort('A - Z')}>A - Z</li>
							<li onClick={() => setSort('Z - A')}>Z - A</li>
							<li onClick={() => setSort('Newest')}>Newest</li>
							<li onClick={() => setSort('Oldest')}>Oldest</li>
							<li onClick={() => setSort('Brand')}>Brand</li>
						</ul>
					</li>
				</ul>

				<div className={cx('show')}>
					<ShowListProduct />
				</div>
			</div>
		</div>
	);
}

export default Admin;
