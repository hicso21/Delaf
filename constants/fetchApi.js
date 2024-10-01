import axios from 'axios';
import api_url from '../utils/constants/APIUrl';

const baseUrl = api_url + '/api/v1';

export default axios.create({
	baseURL: baseUrl,
	headers: {
		'Content-Type': 'application/json',
	},
});
