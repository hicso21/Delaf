import fetchApi from '../../constants/fetchApi';

export default async function getAudios() {
	const { data } = await fetchApi.get('/upload/multimedia/getAudios');
	return data ?? false;
}
