import fetchApi from '../../constants/fetchApi';

export default async function settingCode(email) {
	return await fetchApi
		.post('/brevo/recoveryPasswordMail', {
			to: email,
		})
		.then((res) => res.data)
		.catch((error) => error);
}
