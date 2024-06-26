import ENV from './environment';

const api_url = !ENV ? 'http://localhost:8080' : 'https://delaf.click';

export default api_url;
