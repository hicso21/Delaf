import fetchApi from '../../constants/fetchApi';

export default function getNutritions() {
    const { data } = fetchApi.get('/calendar/getNutrition');
    return data;
}
