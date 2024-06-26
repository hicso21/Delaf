import fetchApi from '../../constants/fetchApi';

export default async function getRoutines() {
	const { data } = await fetchApi.get(`/`);
	return data;    
}
