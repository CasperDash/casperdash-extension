export const isLoadingRequest = ({ request }) => {
	return request.isLoading && request.isLoading.length;
};
