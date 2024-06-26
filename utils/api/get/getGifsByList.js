import fetchApi from '../../constants/fetchApi';

export default async function getGifsByList(list) {
	const { data } = await fetchApi.post('/upload/gif/id_list', list);
	return data ?? false;
}
