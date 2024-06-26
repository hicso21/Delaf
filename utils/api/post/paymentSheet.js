import fetchApi from '../../constants/fetchApi';

export default async function paymentSheet(amount, currency, email, name) {
	return await fetchApi
		.post('/stripe/payment-sheet', {
			amount,
			currency,
			email,
			name,
		})
		.then((res) => res.data)
		.catch((err) => err);
}
