import React from 'react';
import { BrowserRouter, Route, Switch, withRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import { mainModules, wrapperModules, publicModules } from './components';
import Page404 from './components/Common/Page404';
import Layout from './components/Common/Layout';
import { WrapperLayout } from './components/Common/Layout/WrapperLayout';
import { WithLoggedIn } from './components/Common/Layout/WithLogin';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

const createRoute = (modules) => {
	return Object.keys(modules).map((item) => (
		<Route key={`route_${item}`} exact path={item} component={withRouter(modules[item])} />
	));
};

const App = () => {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<Layout>
					<Switch>
						<Route path={Object.keys(mainModules).concat(Object.keys(publicModules))} exact>
							<WithLoggedIn>
								<Switch>
									{createRoute(mainModules)}
									{createRoute(publicModules)}
								</Switch>
							</WithLoggedIn>
						</Route>
						<Route path={Object.keys(wrapperModules)} exact>
							<WrapperLayout>
								<Switch>{createRoute(wrapperModules)}</Switch>
							</WrapperLayout>
						</Route>
						<Route component={Page404} />
					</Switch>
				</Layout>
			</BrowserRouter>
		</Provider>
	);
};
export default App;
