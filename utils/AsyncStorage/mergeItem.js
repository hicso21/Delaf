import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function mergeData(key, value) {
	try {
		const stringifiedValue = JSON.stringify(value);
		const response = await AsyncStorage.mergeItem(key, stringifiedValue);
		return response != null ? response : null;
	} catch (error) {
		return {
			error: true,
			data: 'An error was ocurred.',
		};
	}
}
