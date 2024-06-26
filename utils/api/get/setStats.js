import fetchApi from '../../constants/fetchApi';

export default async function setStats(brand, user_id, start_date, end_date) {
	try {
		const { data } = await fetchApi.post(
			`/${brand}/setStats?db_id=${user_id}&start_date=${start_date}&end_date=${end_date}`
		);
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
