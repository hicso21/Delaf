import fetchApi from '../../constants/fetchApi';

export default async function getByCode(code) {
    const response = await fetchApi.get(`/codes/getByCode/${code}`);
    return response?.data ? response.data : null;
}
