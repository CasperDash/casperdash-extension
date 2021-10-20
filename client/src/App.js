import React from 'react';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { mainModules, wrapperModules } from './components';
import Page404 from './components/Common/Page404';
import Layout from './components/Common/Layout';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const App = () => {
	const routes = Object.keys(mainModules).map((item) => (
		<Route key={`route_${item}`} exact path={item} component={withRouter(mainModules[item])} />
	));
	const wrapperRoutes = Object.keys(wrapperModules).map((item) => (
		<Route key={`route_${item}`} exact path={item} component={withRouter(wrapperModules[item])} />
	));

	return (
		<Provider store={store}>
			<BrowserRouter>
				<Layout>
					<Switch>
						{routes}
						{wrapperRoutes}
						<Route component={Page404} />
					</Switch>
				</Layout>
			</BrowserRouter>
		</Provider>
	);
};
export default App;
