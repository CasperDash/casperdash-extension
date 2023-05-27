import request from '../request';

export const getCoinPrice = async ({id}) => {
    return request.get(`coins/${id}`);
}