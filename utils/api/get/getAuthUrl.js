import fetchApi from '../../constants/fetchApi';

export default async function getAuthUrl(url) {
	const { data } = await fetchApi.get(url);
	return data ?? false;
}
