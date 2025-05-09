import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

import style from './Register.module.scss';
import { useState, useRef } from 'react';

const cx = classNames.bind(style);

function Register() {

	const [username, setUsername] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [isShowPassword, setIsShowPassword] = useState(faEye)

	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const response = await axios.post('http://localhost:3001/register', {
				username,
				email,
				password,
			});
			console.log(1)
			console.log(response)
			console.log("token", response.data.token);

			// Store JWT token in local storage
			localStorage.setItem('token', response.data.token);

			// Redirect to protected page
			window.location.href = '/';
		} catch (error) {
			console.log(error);
		}
	};

    const navigate = useNavigate()

    const signIn = () => {
        navigate('/signIn')
    }

	const passwordHandler = () => {
		if (passwordRef.current.type === 'password') {
			passwordRef.current.type = 'text'
			setIsShowPassword(faEyeSlash)
		} else {
			passwordRef.current.type = 'password'
			setIsShowPassword(faEye)
		}
	}

	return (
		<div className={cx('wrap')}>
			<img
				className={cx('logo')}
				src={'../../../logo.png'}
			/>

			<div className={cx('content')}>
				<div className={cx('title')}>
					REGISTER YOUR ACCOUNT FOR EVERYTHING WyVy
				</div>
				<form
					className={cx('form')}
					onSubmit={handleSubmit}
				>
					<div className={cx('input')}>
						<input
							type="text"
							placeholder="User name"
							required
							name="username"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						></input>
						<input
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
								<FontAwesomeIcon icon={isShowPassword} onClick={passwordHandler} />
							</div>
						</div>
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
                            onClick={signIn}
						>
							Had account?
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
						REGISTER
					</button>
				</form>
			</div>
		</div>
	);
}

export default Register;
