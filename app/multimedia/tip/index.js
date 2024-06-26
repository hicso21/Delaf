import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Toast from 'react-native-toast-message';
import { vh, vw } from '../../../styles/dimensions/dimensions';
import getTips from '../../../utils/api/get/getTips';

const RenderItem = ({ item }) => {
	return (
		<View
			style={{
				flex: 1,
				borderWidth: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#000',
				gap: 20,
				padding: 20,
			}}
		>
			<View
				style={{
					backgroundColor: '#f6f6f6',
					padding: 20,
					borderRadius: 10,
				}}
			>
				<Text adjustsFontSizeToFit={true} style={styles.itemDescription}>
					{item.data?.description}
				</Text>
			</View>
		</View>
	);
};

export default function () {
	const [tips, setTips] = useState([]);

	const fetch = async () => {
		const { data, error } = await getTips();
		if (error)
			return Toast.show({
				type: 'error',
				text1: 'Ocurrió un error, por favor contáctanos.',
			});
		if (data.length) setTips(data);
		else Toast.show({ type: 'info', text1: 'Aún no hay videos' });
	};

	useFocusEffect(
		useCallback(() => {
			fetch();
		}, [])
	);

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'center',
				alignItems: 'center',
				backgroundColor: '#000',
			}}
		>
			<Carousel
				loop
				width={100 * vw}
				height={`calc(${100 * vh} - ${6.2 * vh})`}
				data={tips}
				onSnapToItem={(index) => console.log('current index:', index)}
				renderItem={RenderItem}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
	itemText: {
		textAlign: 'left',
		fontSize: 22,
		color: '#f6f6f6',
		paddingLeft: 5,
		borderTopWidth: 1,
		borderTopColor: '#f6f6f6',
		paddingTop: 5,
		textTransform: 'lowercase',
	},
	itemDescription: {
		textAlign: 'center',
		fontSize: 28,
		color: '#000',
	},
});
