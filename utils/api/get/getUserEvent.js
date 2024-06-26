import fetchApi from '../../constants/fetchApi';

export default async function getUserEvent(id) {
	try {
		const { data } = await fetchApi.get(`/calendar/getUserEvent/${id}`);
		return data;
	} catch (error) {
		return {
			error: true,
			data: error,
		};
	}
}
