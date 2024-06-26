import fetchApi from '../../constants/fetchApi';

export default async function login(email, password) {
	return await fetchApi
		.post('/runners/login', { email, password })
		.then((res) => res.data)
		.catch((err) => {
			return { error: true, data: err };
		});
}
