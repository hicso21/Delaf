import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function getData(key) {
	try {
		const response = await AsyncStorage.getItem(key);
		return response != null ? JSON.parse(response) : null;
	} catch (error) {
		return {
			error: true,
			data: 'An error was ocurred.',
		};
	}
}
