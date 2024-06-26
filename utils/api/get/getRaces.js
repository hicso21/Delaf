import fetchApi from '../../constants/fetchApi';

export default async function getRaces(events) {
    const { data } = await fetchApi.post('/calendar/getRaces', {
        events,
    });
    return data;
}
