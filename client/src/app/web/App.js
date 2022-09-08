import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import store from '../../store';
import modules from '../../components/web';
import Page404 from '../../components/Common/Page404';
import Layout from '../../components/Common/Layout';
import WithConfigurations from '../../components/Common/Configurations';

import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/css/style.scss';
import '../../assets/css/light-theme.scss';

const App = () => {
	const routes = Object.keys(modules).map((item) => {
		const Component = modules[item];
		return <Route key={`route_${item}`} exact path={item} element={<Component />} />;
	});

	return (
		<Provider store={store}>
			<WithConfigurations>
				<BrowserRouter>
					<Layout modules={Object.keys(modules)}>
						<Routes>
							{routes}
							<Route component={Page404} />
						</Routes>
					</Layout>
				</BrowserRouter>
				<ToastContainer
					position="bottom-right"
					autoClose={5000}
					hideProgressBar={false}
					newestOnTop={false}
					closeOnClick
					rtl={false}
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</WithConfigurations>
		</Provider>
	);
};

export default App;
