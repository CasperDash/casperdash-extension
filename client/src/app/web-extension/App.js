import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store';
import Layout from '../../components/web-extension/Common/Layout';
import OuterLayout from '../../components/web-extension/Common/Layout/OuterLayout';
import WithAccount from '../../components/Common/Auth/WithAccount';
import routeConfig from './routeConfig';

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
			<MemoryRouter>
				<Routes>
					<Route
						element={
							<WithAccount>
								<Layout modules={mainRoutes.map((route) => route.route)} />
							</WithAccount>
						}
					>
						{getRoutes(mainRoutes)}
						{getRoutes(innerRoutes)}
					</Route>
					<Route element={<OuterLayout />}>{getRoutes(outerRoutes)}</Route>
				</Routes>
			</MemoryRouter>
		</Provider>
	);
};
export default App;
