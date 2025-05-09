import className from 'classnames/bind';
import {useRef, useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import styles from './SignIn.module.scss';
import {faEye, faEyeSlash} from '@fortawesome/free-regular-svg-icons';

const cx = className.bind(styles);

function SignIn () {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isShowPassword, setIsShowPassword] = useState(faEye);
	const [message, setMessage] = useState('');

	const emailRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post('http://localhost:3001/signIn', {
				email,
				password,
			});

			// Get token
			const token = response.data.token;

			if (token) {
				// Store JWT token in local storage
				localStorage.setItem('token', token);

				// Page redirect by privilege user
				const {privilege} = jwtDecode(token);
				if (privilege === 'admin') {
					window.location.href = '/admin';
				} else if (privilege === 'manager') {
					window.location.href = '/add-products';
				} else {
					window.location.href = '/';
				}
			} else {
				setMessage(response.data.message);
				emailRef.current.style.borderColor =
					'var(--warning-text-color)';
				emailRef.current.focus();
				passwordRef.current.style.borderColor =
					'var(--warning-text-color)';

				// Add shake animation
				emailRef.current.style.animation = `${styles.shake} 200ms 2`;
				passwordRef.current.style.animation = `${styles.shake} 200ms 2`;

				// Reset shake animation
				setTimeout(() => {
					emailRef.current.style.animation = '';
					passwordRef.current.style.animation = '';
				}, 200);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const register = () => {
		navigate('/register');
	};

	const forgottenAccount = () => {
		navigate('/forgotten-account');
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

	return (
		<div className={cx('wrap')}>
			<img
				className={cx('logo')}
				src={'../../../logo.png'}
			/>

			<div className={cx('content')}>
				<div className={cx('title')}>
					YOUR ACCOUNT FOR EVERYTHING WyVy
				</div>
				<form
					className={cx('form')}
					onSubmit={handleSubmit}
				>
					<div className={cx('input')}>
						<input
							ref={emailRef}
							type="email"
							placeholder="Email address"
							required
							name="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						></input>
						<div className={cx('input-password')}>
							<input
								ref={passwordRef}
								placeholder="Password"
								type="password"
								required
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							></input>
							<div className={cx('icon')}>
								<FontAwesomeIcon
									icon={isShowPassword}
									onClick={passwordHandler}
								/>
							</div>
						</div>

						{message && (
							<span className={cx('message')}>{message}</span>
						)}
					</div>
					<div className={cx('password')}>
						<div className={cx('remember')}>
							<input
								type="checkbox"
								id="keep-me-sign-in"
							// checked
							></input>
							<label
								htmlFor="keep-me-sign-in"
								className={cx('check-mark')}
							></label>
							<label
								htmlFor="keep-me-sign-in"
								className={cx('text')}
							>
								Keep me signed in
							</label>
						</div>
						<button
							type="button"
							className={cx('forgot')}
							onClick={forgottenAccount}
						>
							Forgotten your password?
						</button>
					</div>
					<div className={cx('policy')}>
						By logging in, you agree to WyVy's{' '}
						<a href="">Privacy Policy</a> and{' '}
						<a href="">Terms of Use</a>.
					</div>
					<button
						className={cx('submit')}
						type="submit"
					>
						SIGN IN
					</button>
				</form>
				<div
					className={cx('return')}
					onClick={register}
				>
					<button>I don't have an account</button>
				</div>
			</div>
		</div>
	);
}

export default SignIn;
