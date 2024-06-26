import fetchApi from '../../constants/fetchApi';

export default async function getVideos() {
	const { data } = await fetchApi.get('/upload/multimedia/getVideos');
	return data ?? false;
}
