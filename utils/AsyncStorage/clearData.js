import AsyncStorage from '@react-native-async-storage/async-storage';

export default async function clearData() {
	try {
		await AsyncStorage.clear();
		return true;
	} catch (error) {
		return {
			error: true,
			data: 'An error was ocurred.',
		};
	}
}
