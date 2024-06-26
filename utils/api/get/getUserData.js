import fetchApi from '../../constants/fetchApi';

export default async function getUserData(id) {
	try {
		const { data } = await fetchApi.get(`/runners/getById/${id}`);
		return { data, error: false };
	} catch (error) {
		return {
			error: true,
			data: error,
		};
	}
}
