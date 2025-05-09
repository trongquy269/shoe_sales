import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

import style from './ForgottenAccount.module.scss';
import { useState, useRef } from 'react';

const cx = classNames.bind(style);

function ForgottenAccount() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [rePassword, setRePassword] = useState('');
	const [status, setStatus] = useState('');
	const [isShowPassword, setIsShowPassword] = useState(faEye);
	const [isShowRePassword, setIsShowRePassword] = useState(faEye);

	const passwordRef = useRef();
	const rePasswordRef = useRef();

	const navigate = useNavigate();

	const signIn = () => {
		navigate('/signIn');
	};

	const handleSubmitEmail = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post(
				'http://localhost:3001/findEmail',
				{
					email,
				}
			);

			setStatus(response.data.message);
		} catch (error) {
			console.log(error);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post('http://localhost:3001/forgotPassword', {
				email,
				password,
			});

			// Store JWT token in local storage
			localStorage.setItem('token', response.data.token);

			// Page redirect by privilege user
			const { privilege } = jwtDecode(response.data.token);
			if (privilege === 'admin') {
				window.location.href = '/admin';
			} else if (privilege === 'manage') {
				window.location.href = '/add-products';
			} else {
				window.location.href = '/';
			}
		} catch (error) {
			console.log(error);
		}
	};

	const passwordHandler = () => {
		if (passwordRef.current.type === 'password') {
			passwordRef.current.type = 'text';
			setIsShowPassword(faEyeSlash);
		} else {
			passwordRef.current.type = 'password';
			setIsShowPassword(faEye);
		}
	};

	const rePasswordHandler = () => {
		if (rePasswordRef.current.type === 'password') {
			rePasswordRef.current.type = 'text';
			setIsShowRePassword(faEyeSlash);
		} else {
			rePasswordRef.current.type = 'password';
			setIsShowRePassword(faEye);
		}
	};

	return (
		<div className={cx('wrap')}>
			<img
				className={cx('logo')}
				src={'../../../logo.png'}
			/>

			<div className={cx('content')}>
				<div className={cx('title')}>RESET PASSWORD</div>
				<div className={cx('tutorial')}>
					Enter your email to receive instructions on how to reset
					your password.
				</div>
				{!status && (
					<form
						className={cx('form')}
						method="POST"
						onSubmit={handleSubmitEmail}
					>
						<div className={cx('input')}>
							<input
								type="email"
								placeholder="Email address"
								required
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							></input>
						</div>
						<button
							className={cx('submit')}
							type="submit"
						>
							NEXT
						</button>
					</form>
				)}

				{status && (
					<form
						className={cx('form')}
						method="POST"
						onSubmit={handleSubmit}
					>
						<div className={cx('input')}>
							<div className={cx('input-password')}>
								<input
									ref={passwordRef}
									placeholder="Password"
									type="password"
									required
									name="password"
									value={password}
									onChange={(e) =>
										setPassword(e.target.value)
									}
								></input>
								<div className={cx('icon')}>
									<FontAwesomeIcon
										icon={isShowPassword}
										onClick={passwordHandler}
									/>
								</div>
							</div>
							<div className={cx('input-password')}>
								<input
									ref={rePasswordRef}
									placeholder="Re - password"
									type="password"
									required
									name="re-password"
									value={rePassword}
									onChange={(e) =>
										setRePassword(e.target.value)
									}
								></input>
								<div className={cx('icon')}>
									<FontAwesomeIcon
										icon={isShowRePassword}
										onClick={rePasswordHandler}
									/>
								</div>
							</div>
						</div>
						<button
							className={cx('submit')}
							type="submit"
						>
							RESET
						</button>
					</form>
				)}

				<div
					className={cx('return')}
					onClick={signIn}
				>
					Or return to <button>Log In.</button>
				</div>
			</div>
		</div>
	);
}

export default ForgottenAccount;
