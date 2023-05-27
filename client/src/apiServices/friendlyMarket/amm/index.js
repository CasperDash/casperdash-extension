import request from '../request';

export const getPair = async ({fromContractHash, toContractHash}) => {
    const { data = {} } = await request.get(`/amm/pair/${fromContractHash}/${toContractHash}`);

    return data;
}