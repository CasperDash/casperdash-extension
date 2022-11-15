import React from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store, { persistor } from '@cd/store';
import Layout from '@cd/web-extension/Common/Layout';
import OuterLayout from '@cd/web-extension/Common/Layout/OuterLayout';
import WithAccount from '@cd/common/Auth/WithAccount';
import WithConfigurations from '@cd/common/Configurations';
import { LoginModal } from '@cd/components/web-extension/Common/LoginModal/index';
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
			<PersistGate loading={null} persistor={persistor}>
				<WithConfigurations>
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
							<Route
								element={
									<WithAccount>
										<OuterLayout />
									</WithAccount>
								}
							>
								{getRoutes(outerRoutes)}
							</Route>
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
						<LoginModal />
					</HashRouter>
				</WithConfigurations>
			</PersistGate>
		</Provider>
	);
};
export default App;
