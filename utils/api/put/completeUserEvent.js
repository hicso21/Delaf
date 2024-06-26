import fetchApi from '../../constants/fetchApi';

export default async function routineCompleted(id) {
    try {
        const { data } = await fetchApi.put('/calendar/completeUserEvent', {
            id,
        });
        return {
            error: false,
            data,
        };
    } catch (error) {
        return {
            error: true,
            data: error,
        };
    }
}
