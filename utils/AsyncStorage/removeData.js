import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function removeData(key) {
	try {
		await AsyncStorage.removeItem(key);
		return true;
	} catch (error) {
		return {
			error: true,
			data: 'An error was ocurred.',
		};
	}
}
