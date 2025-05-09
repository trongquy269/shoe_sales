import { faMinus, faPlus, faSync } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import styles from './AddProducts.module.scss';
import Popup from '../../components/Popup';

const cx = classNames.bind(styles);

function AddProducts() {
	const colorInputRef = useRef();
	const colorQuantityRef = useRef();
	const sizeInputRef = useRef();
	const sizeQuantityRef = useRef();

	const [name, setName] = useState('');
	const [images, setImages] = useState([]);
	const [quantity, setQuantity] = useState();
	const [type, setType] = useState('Shoes');
	const [price, setPrice] = useState(0);
	const [brand, setBrand] = useState('Nike');
	const [colorList, setColorList] = useState([]);
	const [sizeList, setSizeList] = useState([]);
	const [description, setDescription] = useState('');
	const [color, setColor] = useState('');
	const [numberOfColor, setNumberOfColor] = useState(1);
	const [size, setSize] = useState('');
	const [colorOfSize, setColorOfSize] = useState('');
	const [numberOfSize, setNumberOfSize] = useState(1);
	const [isPopup, setIsPopup] = useState(false);
	const [preview, setPreview] = useState();
	const [files, setFiles] = useState(null);

	const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

	const addColorInput = () => {
		colorInputRef.current.value &&
			colorQuantityRef.current.value &&
			setColorList((prev) => [
				...prev,
				{ color, quantity: numberOfColor },
			]);
		colorInputRef.current.value = '';
		colorInputRef.current.focus();
		colorQuantityRef.current.value = '';
	};

	const removeColor = (index) => {
		const array = [...colorList];
		array.splice(index, 1);
		setColorList([...array]);
	};

	const removeItemSize = (index) => {
		const array = [...sizeList];
		array.splice(index, 1);
		setSizeList([...array]);
	};

	useEffect(() => {
		if (files) {
			for (let i = 0; i < files.length; i++) {
				setImages((prev) => [...prev, files[i]]);
			}
		}
	}, [files]);

	useEffect(() => {
		if (images.length) {
			Promise.all(
				images.map((file) => {
					return new Promise((resolve, reject) => {
						const reader = new FileReader();
						reader.addEventListener('load', (e) => {
							resolve(e.target.result);
						});
						reader.addEventListener('error', reject);
						reader.readAsDataURL(file);
					});
				})
			).then(
				(image) => {
					setPreview(image);
				},
				(error) => {
					console.error(error);
				}
			);
		}
	}, [images.length]);

	useEffect(() => {
		colorList.length !== 0 && setColorOfSize(colorList[0].color);
	}, [colorList.length !== 0]);

	const addSizeInput = () => {
		sizeInputRef.current.value &&
			sizeQuantityRef.current.value &&
			setSizeList((prev) => [
				...prev,
				{ size, color: colorOfSize, quantity: numberOfSize },
			]);
		sizeInputRef.current.value = '';
		sizeInputRef.current.focus();
		sizeQuantityRef.current.value = '';
	};

	const submitHandler = () => {
		if (
			name &&
			files &&
			quantity &&
			price &&
			colorList.length &&
			sizeList.length &&
			description
		) {
			const formData = new FormData();
			for (let i = 0; i < files.length; i++) {
				formData.append('photos', files[i]);
			}

			formData.append('name', name);
			formData.append('quantity', quantity);
			formData.append('type', type);
			formData.append('price', price);
			formData.append('brand', brand);
			formData.append('color', JSON.stringify(colorList));
			formData.append('size', JSON.stringify(sizeList));
			formData.append('description', description);

			setIsPopup('success');

			setTimeout(() => {
				setIsPopup(false);

				setTimeout(() => {
					window.location.reload(true);
				}, 1000);
			}, 5000);

			try {
				axios.post('http://localhost:3001/add-product', formData);
			} catch (error) {
				console.log(error);
			}

			console.log(formData);
		} else {
			setIsPopup(true);

			setTimeout(() => {
				setIsPopup(false);
			}, 5000);
		}
	};

	return (
		<div className={cx('wrap')}>
			<h1 className={cx('title')}>ADD PRODUCTS</h1>

			<div className={cx('content')}>
				{/* Name */}
				<label htmlFor="name">Enter the name of the product</label>
				<input
					placeholder="Enter name"
					id="name"
					type="text"
					onChange={(e) => setName(e.target.value)}
				></input>

				{/* Images */}
				<label htmlFor="img">
					Enter the folder containing the product's images
				</label>
				<input
					id="img"
					type="file"
					name="image"
					multiple
					accept="image/*"
					onChange={(e) => setFiles(e.target.files)}
				></input>
				<div className={cx('image-wrap')}>
					{preview &&
						preview.map((imageSrc, index) => (
							<img
								style={{ width: '100%' }}
								src={imageSrc}
								key={index}
							/>
						))}
				</div>

				{/* Quantity */}
				<label htmlFor="quantity">
					Enter the quantity of the product
				</label>
				<input
					id="quantity"
					type="number"
					min="1"
					step="1"
					placeholder="Enter number"
					onChange={(e) => setQuantity(e.target.value)}
				></input>

				{/* Type */}
				<label>Enter product type</label>
				<select onChange={(e) => setType(e.target.value)}>
					<option value="Shoes">Shoes</option>
					<option value="Men's Shoes">Men's Shoes</option>
					<option value="Women's Shoes">Women's Shoes</option>
					<option value="Older Kids's Shoes">
						Older Kids's Shoes
					</option>
				</select>

				{/* Price */}
				<label htmlFor="price">Enter the price of the product</label>
				<input
					id="price"
					type="number"
					min="1"
					step="1"
					placeholder="Ex: 1000000"
					onChange={(e) => setPrice(e.target.value)}
				></input>

				{/* Brand */}
				<label>Enter the product's manufacturer name</label>
				<select onChange={(e) => setBrand(e.target.value)}>
					<option value="Nike">Nike</option>
					<option value="Adidas">Adidas</option>
					<option value="Puma">Puma</option>
					<option value="New Balance">New Balance</option>
					<option value="Converse">Converse</option>
				</select>

				{/* Color */}
				<label htmlFor="color">Enter the color of the product</label>
				<div className={cx('input-has-btn')}>
					<div className={cx('default')}>
						<input
							placeholder="Ex: White"
							id="color"
							type="text"
							ref={colorInputRef}
							onChange={(e) =>
								setColor(capitalize(e.target.value + ' '))
							}
						></input>
						<input
							ref={colorQuantityRef}
							placeholder={`Number of products for ${color}color, Ex: 100`}
							type="number"
							min="1"
							max={quantity}
							style={{ marginLeft: '8px' }}
							onInput={(e) => setNumberOfColor(e.target.value)}
						></input>
						<FontAwesomeIcon
							icon={faPlus}
							className={cx('icon')}
							onClick={addColorInput}
						/>
					</div>

					<ul className={cx('items')}>
						{colorList.map((element, index) => (
							<li key={index}>
								<span>{element.color}</span>
								<span
									className={cx('color')}
									style={{ borderColor: element.color }}
								></span>
								<span style={{ marginRight: '10%' }}>
									{element.quantity}
								</span>
								<FontAwesomeIcon
									className={cx('icon')}
									icon={faMinus}
									onClick={() => removeColor(index)}
								/>
							</li>
						))}
					</ul>
				</div>

				{/* Size */}
				<label htmlFor="size">Enter the size of the product</label>
				<div className={cx('input-has-btn')}>
					<div className={cx('default')}>
						<input
							placeholder="Ex: 36.5"
							id="size"
							type="number"
							onChange={(e) => setSize(e.target.value + ' ')}
							ref={sizeInputRef}
						></input>
						{colorList.length !== 0 && (
							<select
								id="size-color"
								style={{ padding: 0, marginLeft: '8px' }}
								onChange={(e) => setColorOfSize(e.target.value)}
							>
								{colorList.length !== 0 &&
									colorList.map((color, index) => (
										<option
											key={index}
											value={color.color}
										>
											{color.color}
										</option>
									))}
							</select>
						)}
						<input
							placeholder={`Number of products for ${size}size, Ex: 100`}
							type="number"
							min="1"
							max={quantity}
							style={{ marginLeft: '8px' }}
							ref={sizeQuantityRef}
							onInput={(e) => setNumberOfSize(e.target.value)}
						></input>
						<FontAwesomeIcon
							icon={faPlus}
							className={cx('icon')}
							onClick={addSizeInput}
						/>
					</div>

					<ul className={cx('items')}>
						{sizeList.map((size, index) => (
							<li
								key={index}
								style={{
									display: 'flex',
									justifyContent: 'space-between',
								}}
							>
								<span style={{ marginRight: '20px' }}>
									{'Size: ' + size.size}
								</span>
								<span style={{ marginRight: '20px' }}>
									{'Color: ' + size.color}
								</span>
								<span>{'Quantity: ' + size.quantity}</span>
								<FontAwesomeIcon
									className={cx('icon')}
									icon={faMinus}
									onClick={() => removeItemSize(index)}
									style={{ marginLeft: 'auto' }}
								/>
							</li>
						))}
					</ul>
				</div>

				{/* Description */}
				<textarea
					name="description"
					maxLength="60000"
					placeholder="Description"
					onInput={(e) => setDescription(e.target.value)}
				></textarea>

				{/* Submit */}
				<button
					type="submit"
					className={cx('submit')}
					onClick={submitHandler}
				>
					ADD
				</button>
			</div>

			{isPopup === true && (
				<Popup
					content="Add product failed"
					type="error"
				/>
			)}
			{isPopup === 'success' && (
				<Popup
					content="Add product successful"
					type="success"
				/>
			)}
		</div>
	);
}

export default AddProducts;
