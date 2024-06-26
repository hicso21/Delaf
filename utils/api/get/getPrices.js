import fetchApi from '../../constants/fetchApi';

export default async function getPrices() {
	const { data } = await fetchApi.get('/stripe/prices');
	return data ?? false;
}
