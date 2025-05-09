import {Fragment, useState, useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import Admin from './pages/Admin';
import AddProducts from './pages/AddProducts';
import Home from './pages/Home';
import Cart from './pages/Cart';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import ForgottenAccount from './pages/ForgottenAccount';
import {DefaultLayout} from './components/Layout';
import Header from './components/Layout/DefaultLayout/Header';
import ShowProduct from './pages/ShowProduct';
import Favorite from './pages/Favorite';

function App () {
	const [privilege, setPrivilege] = useState('client');

	// Get userToken from local storage
	const userToken = localStorage.getItem('token');

	useEffect(() => {
		if (userToken) {
			// Decode the token to get the payload
			const decodedToken = jwtDecode(userToken);

			// Extract the id and user name from payload
			const {privilege} = decodedToken;
			setPrivilege(privilege);
		} else {
			setPrivilege('client');
		}
	}, [userToken]);

	return (
		<Router>
			<div className="App">
				<Routes>
					{privilege === 'admin' && (
						<Route
							path="/admin"
							element={<Admin />}
						/>
					)}
					{(privilege === 'manager' || privilege === 'admin') && (
						<Route
							path="/add-products"
							element={<AddProducts />}
						/>
					)}
					<Route
						path="/"
						element={
							<DefaultLayout>
								<Home />
							</DefaultLayout>
						}
					/>
					<Route
						path="/cart"
						element={
							<Fragment>
								<Header />
								<Cart />
							</Fragment>
						}
					/>
					<Route
						path="/favorite"
						element={
							<DefaultLayout>
								<Favorite />
							</DefaultLayout>
						}
					/>
					<Route
						path="/signIn"
						element={
							<Fragment>
								<Header />
								<SignIn />
							</Fragment>
						}
					/>
					<Route
						path="/register"
						element={
							<Fragment>
								<Header />
								<Register />
							</Fragment>
						}
					/>
					<Route
						path="/forgotten-account"
						element={
							<Fragment>
								<Header />
								<ForgottenAccount />
							</Fragment>
						}
					/>
					<Route
						path="/product"
						element={
							<Fragment>
								<Header />
								<ShowProduct />
							</Fragment>
						}
					/>
				</Routes>
			</div>
		</Router>
	);
}

export default App;
