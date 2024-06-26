import fetchApi from '../../constants/fetchApi';

export default async function getCodeByEmail(email) {
    const response = await fetchApi.get(`/codes/getByEmail/${email}`);
    return response?.data;
}
