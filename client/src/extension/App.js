import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store';
import modules from '../components';
import Page404 from '../components/Common/Page404';
import Layout from '../components/Common/ExtensionLayout';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import '../assets/css/extension/style.scss';

const App = () => {
	const routes = Object.keys(modules).map((item) => {
		const Component = modules[item];
		return <Route key={`route_${item}`} exact path={item} element={<Component />} />;
	});

	return (
		<Provider store={store}>
			<MemoryRouter>
				<Layout modules={Object.keys(modules)}>
					<Routes>
						{routes}
						<Route component={Page404} />
					</Routes>
				</Layout>
			</MemoryRouter>
		</Provider>
	);
};
export default App;
