import fetchApi from '../../constants/fetchApi';

export default async function getTips() {
	const { data } = await fetchApi.get('/upload/multimedia/getTips');
	return data ?? false;
}
