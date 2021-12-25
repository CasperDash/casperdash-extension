import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../../store';
import Layout from '../../components/web-extension/Common/Layout';
import modules from './routeConfig';

import '../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './App.scss';
import '../../assets/css/extension/style.scss';

const App = () => {
	const routes = Object.keys(modules).map((item) => {
		const Component = modules[item];
		return <Route key={`route_${item}`} exact path={item} element={<Component />} />;
	});

	return (
		<Provider store={store}>
			<MemoryRouter>
				<Layout modules={Object.keys(modules)}>
					<Routes>{routes}</Routes>
				</Layout>
			</MemoryRouter>
		</Provider>
	);
};
export default App;
