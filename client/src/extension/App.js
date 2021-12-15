import React from 'react';
import { MemoryRouter, Route, Switch, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from '../store';
import modules from '../components';
import Page404 from '../components/Common/Page404';
import Layout from '../components/Common/ExtensionLayout';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
	const routes = Object.keys(modules).map((item) => (
		<Route key={`route_${item}`} exact path={item} component={withRouter(modules[item])} />
	));

	return (
		<Provider store={store}>
			<MemoryRouter>
				<Layout modules={Object.keys(modules)}>
					<Switch>
						{routes}
						<Route component={Page404} />
					</Switch>
				</Layout>
			</MemoryRouter>
		</Provider>
	);
};
export default App;
