import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function setData(key, value) {
	try {
		const stringifiedValue = JSON.stringify(value);
		const response = await AsyncStorage.setItem(key, stringifiedValue);
		return response != null ? response : null;
	} catch (error) {
		return {
			error: true,
			data: 'An error was ocurred.',
		};
	}
}
