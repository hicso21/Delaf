import fetchApi from '../../constants/fetchApi';

export default async function getPaid(user_id) {
    const { data } = await fetchApi.get(`/paid/getByUserId/${user_id}`);
    return data;
}
