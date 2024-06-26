import { Alert } from 'react-native';
import fetchApi from '../../constants/fetchApi';

const errorRes = (err) => {
	return { error: true, data: err };
};

export default async function register(runner) {
	console.log(runner)
	return await fetchApi
		.post('/runners/register', runner)
		.then((res) => res.data)
		.catch((err) => errorRes(err));
}
