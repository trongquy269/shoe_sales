import React, { lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import GlobalStyle from './components/GlobalStyles';
import Loading from './components/Loading';

const root = ReactDOM.createRoot(document.getElementById('root'));

const LazyLoad = lazy(() => import('./App'));

root.render(
	<React.StrictMode>
		<GlobalStyle>
			<Suspense fallback={<Loading />}>
				<LazyLoad />
			</Suspense>
		</GlobalStyle>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
