import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState, useContext } from 'react';

import styles from './Sidebar.module.scss';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { SortContext } from '..';

const cx = classNames.bind(styles);

function Sidebar({ width, marginRight }) {
	const [isExtend1, setIsExtend1] = useState(true);
	const [isExtend2, setIsExtend2] = useState(true);
	const [isExtend3, setIsExtend3] = useState(true);
	const [isExtend4, setIsExtend4] = useState(true);
	const [isExtend5, setIsExtend5] = useState(true);
	const [contentHeight1, setContentHeight1] = useState('500px');
	const [contentHeight2, setContentHeight2] = useState('500px');
	const [contentHeight3, setContentHeight3] = useState('500px');
	const [contentHeight4, setContentHeight4] = useState('500px');
	const [contentHeight5, setContentHeight5] = useState('500px');

	const { filters, setFilters } = useContext(SortContext);

	const filterHandler = (value) => {
		if (!filters.includes(value)) {
			setFilters((prev) => [...prev, value]);
		} else {
			setFilters((prev) => prev.filter((item) => item !== value));
		}
	};

	return (
		<div
			className={cx('wrap')}
			style={{ width: width, marginRight: marginRight }}
		>
			{/* Gender */}
			<div className={cx('items')}>
				<button
					className={cx('title')}
					onClick={() => {
						setContentHeight1(isExtend1 === true ? 0 : '500px');
						setIsExtend1((isExtend) => !isExtend);
					}}
				>
					<span>Gender</span>
					<div className={cx('icon')}>
						{isExtend1 && (
							<FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
						)}
						{!isExtend1 && (
							<FontAwesomeIcon
								icon={faAngleDown}
							></FontAwesomeIcon>
						)}
					</div>
				</button>
				<div
					className={cx('content')}
					style={{ maxHeight: contentHeight1 }}
				>
					<div
						className={cx('options')}
						onClick={() => filterHandler('Men')}
					>
						<input
							type={'checkbox'}
							id={'filter-men'}
							checked={filters.includes('Men')}
							readOnly
						/>
						<label
							htmlFor={'filter-men'}
							onClick={(e) => e.stopPropagation()}
						>
							Men
						</label>
					</div>
					<div
						className={cx('options')}
						onClick={() => filterHandler('Women')}
					>
						<input
							type={'checkbox'}
							id={'filter-women'}
							checked={filters.includes('Women')}
							readOnly
						/>
						<label
							htmlFor={'filter-women'}
							onClick={(e) => e.stopPropagation()}
						>
							Women
						</label>
					</div>
					<div
						className={cx('options')}
						onClick={() => filterHandler('Unisex')}
					>
						<input
							type={'checkbox'}
							id={'filter-unisex'}
							checked={filters.includes('Unisex')}
							readOnly
						/>
						<label
							htmlFor={'filter-unisex'}
							onClick={(e) => e.stopPropagation()}
						>
							Unisex
						</label>
					</div>
				</div>
			</div>
			{/* Kids */}
			<div className={cx('items')}>
				<button
					className={cx('title')}
					onClick={() => {
						setContentHeight2(isExtend2 === true ? 0 : '500px');
						setIsExtend2((isExtend) => !isExtend);
					}}
				>
					<span>Kids</span>
					<div className={cx('icon')}>
						{isExtend2 && (
							<FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
						)}
						{!isExtend2 && (
							<FontAwesomeIcon
								icon={faAngleDown}
							></FontAwesomeIcon>
						)}
					</div>
				</button>
				<div
					className={cx('content')}
					style={{ maxHeight: contentHeight2 }}
				>
					<div
						className={cx('options')}
						onClick={() => filterHandler('Boys')}
					>
						<input
							type={'checkbox'}
							id={'filter-boys'}
							checked={filters.includes('Boys')}
							readOnly
						/>
						<label
							htmlFor={'filter-boys'}
							onClick={(e) => e.stopPropagation()}
						>
							Boys
						</label>
					</div>
					<div
						className={cx('options')}
						onClick={() => filterHandler('Girls')}
					>
						<input
							type={'checkbox'}
							id={'filter-girls'}
							checked={filters.includes('Girls')}
							readOnly
						/>
						<label
							htmlFor={'filter-girls'}
							onClick={(e) => e.stopPropagation()}
						>
							Girls
						</label>
					</div>
				</div>
			</div>
			{/* Shop By Price */}
			<div className={cx('items')}>
				<button
					className={cx('title')}
					onClick={() => {
						setContentHeight3(isExtend3 === true ? 0 : '500px');
						setIsExtend3((isExtend) => !isExtend);
					}}
				>
					<span>Shop By Price</span>
					<div className={cx('icon')}>
						{isExtend3 && (
							<FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
						)}
						{!isExtend3 && (
							<FontAwesomeIcon
								icon={faAngleDown}
							></FontAwesomeIcon>
						)}
					</div>
				</button>
				<div
					className={cx('content')}
					style={{ maxHeight: contentHeight3 }}
				>
					<div
						className={cx('options')}
						onClick={() => filterHandler('under1000')}
					>
						<input
							type={'checkbox'}
							id={'filter-price-under-1m'}
							checked={filters.includes('under1000')}
							readOnly
						/>
						<label
							htmlFor={'filter-price-under-1m'}
							onClick={(e) => e.stopPropagation()}
						>
							Under 1,000,000đ
						</label>
					</div>
					<div
						className={cx('options')}
						onClick={() => filterHandler('1001-2700')}
					>
						<input
							type={'checkbox'}
							id={'filter-price-1m-to-2m7'}
							checked={filters.includes('1001-2700')}
							readOnly
						/>
						<label
							htmlFor={'filter-price-1m-to-2m7'}
							onClick={(e) => e.stopPropagation()}
						>
							1,001,000đ - 2,700,000đ
						</label>
					</div>
					<div
						className={cx('options')}
						onClick={() => filterHandler('2701-3999')}
					>
						<input
							type={'checkbox'}
							id={'filter-price-2m7-to-3m9'}
							checked={filters.includes('2701-3999')}
							readOnly
						/>
						<label
							htmlFor={'filter-price-2m7-to-3m9'}
							onClick={(e) => e.stopPropagation()}
						>
							2,701,000đ - 3,999,000đ
						</label>
					</div>
					<div
						className={cx('options')}
						onClick={() => filterHandler('over4000')}
					>
						<input
							type={'checkbox'}
							id={'filter-price-over-4m'}
							checked={filters.includes('over4000')}
							readOnly
						/>
						<label
							htmlFor={'filter-price-over-4m'}
							onClick={(e) => e.stopPropagation()}
						>
							Over 4,000,000đ
						</label>
					</div>
				</div>
			</div>
			{/* Brand */}
			<div className={cx('items')}>
				<button
					className={cx('title')}
					onClick={() => {
						setContentHeight4(isExtend4 === true ? 0 : '500px');
						setIsExtend4((isExtend) => !isExtend);
					}}
				>
					<span>Brand</span>
					<div className={cx('icon')}>
						{isExtend4 && (
							<FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
						)}
						{!isExtend4 && (
							<FontAwesomeIcon
								icon={faAngleDown}
							></FontAwesomeIcon>
						)}
					</div>
				</button>
				<div
					className={cx('content')}
					style={{ maxHeight: contentHeight4 }}
				>
					<div
						className={cx('options')}
						onClick={() => filterHandler('Nike')}
					>
						<input
							type={'checkbox'}
							id={'filter-brand-nike'}
							checked={filters.includes('Nike')}
							readOnly
						/>
						<label
							htmlFor={'filter-brand-nike'}
							onClick={(e) => e.stopPropagation()}
						>
							Nike
						</label>
					</div>
					<div
						className={cx('options')}
						onClick={() => filterHandler('Adidas')}
					>
						<input
							type={'checkbox'}
							id={'filter-brand-adidas'}
							checked={filters.includes('Adidas')}
							readOnly
						/>
						<label
							htmlFor={'filter-brand-adidas'}
							onClick={(e) => e.stopPropagation()}
						>
							Adidas
						</label>
					</div>
					<div
						className={cx('options')}
						onClick={() => filterHandler('Puma')}
					>
						<input
							type={'checkbox'}
							id={'filter-brand-puma'}
							checked={filters.includes('Puma')}
							readOnly
						/>
						<label
							htmlFor={'filter-brand-puma'}
							onClick={(e) => e.stopPropagation()}
						>
							Puma
						</label>
					</div>
					<div
						className={cx('options')}
						onClick={() => filterHandler('New Balance')}
					>
						<input
							type={'checkbox'}
							id={'filter-brand-new-balance'}
							checked={filters.includes('New Balance')}
							readOnly
						/>
						<label
							htmlFor={'filter-brand-new-balance'}
							onClick={(e) => e.stopPropagation()}
						>
							New Balance
						</label>
					</div>
					<div
						className={cx('options')}
						onClick={() => filterHandler('Converse')}
					>
						<input
							type={'checkbox'}
							id={'filter-brand-converse'}
							checked={filters.includes('Converse')}
							readOnly
						/>
						<label
							htmlFor={'filter-brand-converse'}
							onClick={(e) => e.stopPropagation()}
						>
							Converse
						</label>
					</div>
				</div>
			</div>
			{/* Colors */}
			<div className={cx('items')}>
				<button
					className={cx('title')}
					onClick={() => {
						setContentHeight5(isExtend5 === true ? 0 : '500px');
						setIsExtend5((isExtend) => !isExtend);
					}}
				>
					<span>Colors</span>
					<div className={cx('icon')}>
						{isExtend5 && (
							<FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
						)}
						{!isExtend5 && (
							<FontAwesomeIcon
								icon={faAngleDown}
							></FontAwesomeIcon>
						)}
					</div>
				</button>
				<div
					className={cx('content', 'special')}
					style={{ maxHeight: contentHeight5 }}
				>
					<button
						className={cx('options')}
						onClick={() => filterHandler('Purple')}
					>
						<span className={cx('color', 'purple')}></span>
						<span>Purple</span>
					</button>

					<button
						className={cx('options')}
						onClick={() => filterHandler('Black')}
					>
						<span className={cx('color', 'black')}></span>
						<span>Black</span>
					</button>
					<button
						className={cx('options')}
						onClick={() => filterHandler('Red')}
					>
						<span className={cx('color', 'red')}></span>
						<span>Red</span>
					</button>
					<button
						className={cx('options')}
						onClick={() => filterHandler('Orange')}
					>
						<span className={cx('color', 'orange')}></span>
						<span>Orange</span>
					</button>
					<button
						className={cx('options')}
						onClick={() => filterHandler('Blue')}
					>
						<span className={cx('color', 'blue')}></span>
						<span>Blue</span>
					</button>
					<button
						className={cx('options')}
						onClick={() => filterHandler('White')}
					>
						<span className={cx('color', 'white')}></span>
						<span>White</span>
					</button>
					<button
						className={cx('options')}
						onClick={() => filterHandler('Brown')}
					>
						<span className={cx('color', 'brown')}></span>
						<span>Brown</span>
					</button>
					<button
						className={cx('options')}
						onClick={() => filterHandler('Green')}
					>
						<span className={cx('color', 'green')}></span>
						<span>Green</span>
					</button>
					<button
						className={cx('options')}
						onClick={() => filterHandler('Yellow')}
					>
						<span className={cx('color', 'yellow')}></span>
						<span>Yellow</span>
					</button>
					<button
						className={cx('options')}
						onClick={() => filterHandler('Multi-color')}
					>
						<span className={cx('color', 'multi-color')}></span>
						<span>Multi-color</span>
					</button>
					<button
						className={cx('options')}
						onClick={() => filterHandler('Gray')}
					>
						<span className={cx('color', 'gray')}></span>
						<span>Gray</span>
					</button>
					<button
						className={cx('options')}
						onClick={() => filterHandler('Pink')}
					>
						<span className={cx('color', 'pink')}></span>
						<span>Pink</span>
					</button>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;
