import React from 'react';
import { MemoryRouter, Outlet, Route, Routes } from 'react-router-dom';

export const RenderRouteWithOutletContext = ({
	 context,
	 children,
 }) => {
	return (
		<MemoryRouter>
			<Routes>
				<Route path="/" element={<Outlet context={context} />}>
					<Route index element={children} />
				</Route>
			</Routes>
		</MemoryRouter>
	);
};