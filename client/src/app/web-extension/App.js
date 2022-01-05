import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from '../../store';
import Layout from '../../components/web-extension/Common/Layout';
import OuterLayout from '../../components/web-extension/Common/Layout/OuterLayout';
import WithAccount from '../../components/Common/Auth/WithAccount';
import routeConfig from './routeConfig';

import 'react-toastify/dist/ReactToastify.css';
import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.scss';

const getRoutes = (routes) => {
	return (
		routes &&
		routes.map((route) => {
			const Component = route.component;
			return <Route key={`route_${route.name}`} exact path={route.route} element={<Component />} />;
		})
	);
};

const App = () => {
	const { mainRoutes, innerRoutes, outerRoutes } = routeConfig;

	return (
		<Provider store={store}>
			<HashRouter>
				<Routes>
					<Route
						element={
							<WithAccount>
								<Layout modules={mainRoutes} />
							</WithAccount>
						}
					>
						{getRoutes(mainRoutes)}
						{getRoutes(innerRoutes)}
					</Route>
					<Route element={<OuterLayout />}>{getRoutes(outerRoutes)}</Route>
				</Routes>
				<ToastContainer
					position="top-center"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</HashRouter>
		</Provider>
	);
};
export default App;
