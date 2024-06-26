import fetchApi from '../../constants/fetchApi';

export default async function passwordRecovery(email, password) {
	return await fetchApi
		.post('/runners/resetPassword', { email, password })
		.then((res) => res.data)
		.catch((err) => errorRes(err));
}
