import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store';
import Layout from '../../components/web-extension/Common/Layout';
import routeConfig from './routeConfig';

// import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
// import '../../assets/css/extension/style.scss';

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
	const { mainRoutes, innerRoutes } = routeConfig;

	return (
		<Provider store={store}>
			<MemoryRouter>
				<Layout modules={mainRoutes.map((route) => route.route)}>
					<Routes>
						{getRoutes(mainRoutes)}
						{getRoutes(innerRoutes)}
					</Routes>
				</Layout>
			</MemoryRouter>
		</Provider>
	);
};
export default App;
