import fetchApi from '../../constants/fetchApi';

export default async function setPaid(user_id) {
    const { data } = await fetchApi.post('/paid', { user_id });
    return data;
}
