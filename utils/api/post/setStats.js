import fetchApi from '../../constants/fetchApi';

export default async function setStats(brand, id) {
	return await fetchApi
		.post(`/${brand}/setStats`, {
			id,
			start_time: Date.now() - (8*60*60*1000),
			end_time: Date.now(),
		})
		.then((res) => res.data)
		.catch((error) => error);
}
