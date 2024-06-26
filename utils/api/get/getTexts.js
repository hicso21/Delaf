import fetchApi from '../../constants/fetchApi';

export default async function getTexts() {
	const { data } = await fetchApi.get('/upload/multimedia/getTexts');
	return data ?? false;
}
