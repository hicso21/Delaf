import fetchApi from '../../constants/fetchApi';

export default async function getPbKeyStripe() {
    const { data } = await fetchApi.get('/payment/getTestPublishableKey');
    return data;
}
