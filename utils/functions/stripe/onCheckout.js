import { useStripe } from '@stripe/stripe-react-native';
import fetchApi from '../../constants/fetchApi';
import { Alert } from 'react-native';

export default function onCheckout() {
	const { initPaymentSheet, presentPaymentSheet } = useStripe();

	const fetchPaymentSheetParams = async () => {
		const response = await fetchApi.post(
			`/stripe/payment-sheet`,
			{
				/* amount, currency, email, name */
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);
		const { paymentIntent, ephemeralKey, customer } = await response.json();

		return {
			paymentIntent,
			ephemeralKey,
			customer,
		};
	};

	const initializePaymentSheet = async () => {
		const { paymentIntent, ephemeralKey, customer, publishableKey } =
			await fetchPaymentSheetParams();

		const { error } = await initPaymentSheet({
			merchantDisplayName: 'DELAF',
			customerId: customer,
			customerEphemeralKeySecret: ephemeralKey,
			paymentIntentClientSecret: paymentIntent,
			allowsDelayedPaymentMethods: true,
			defaultBillingDetails: {
				name: 'Jane Doe',
                email
			},
		});

		if (!error) {
			setLoading(true);
		}
	};

	const openPaymentSheet = async () => {
		const { error: presentError } = await presentPaymentSheet();

		if (presentError) {
			Alert.alert(`Error code: ${error.code}`, error.message);
		} else {
			Alert.alert('Success', 'Your order is confirmed!');
		}
	};
}
