import fetchApi from '../../constants/fetchApi';

export default async function createUserEvents(events) {
    const { data } = await fetchApi.post('/calendar/createUserEvents', {
        events,
    });
    return data;
}
