import fetchApi from '../../constants/fetchApi';

export default async function createPaymentIntent(body) {
	// const { amount, currency, email, name, payment_method } = body;
	try {
		const res = await fetchApi.post('/stripe/create-payment', body);
		return res.data;
	} catch (error) {
		return {
			error: true,
			data: error,
		};
	}
}
