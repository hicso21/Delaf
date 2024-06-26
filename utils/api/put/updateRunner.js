import fetchApi from '../../constants/fetchApi';

export default async function updateRunner(id, body) {
    const { data } = await fetchApi.put(`/runners/updateRunner/${id}`);
    return data;
}
