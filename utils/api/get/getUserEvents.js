import fetchApi from '../../constants/fetchApi';

export default async function getUserEvents(id) {
	try {
		const { data } = await fetchApi.get(`/calendar/getUserEvents/${id}`);
		return data;
	} catch (error) {
		return {
			error: true,
			data: error,
		};
	}
}
