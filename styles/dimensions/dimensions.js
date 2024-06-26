import { Dimensions } from 'react-native';
const vw = Dimensions.get('window').width / 100;
const vh = Dimensions.get('window').height / 100;
const vp = vh / vw;

export { vw, vh };
export default vp;
