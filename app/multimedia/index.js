import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { vh, vw } from '../../styles/dimensions/dimensions';
import { useState } from 'react';
import { router } from 'expo-router';

export default function Multimedia() {
	const [tabs, setTabs] = useState([
		{ name: 'VIDEOS', to: '/multimedia/video' },
		{ name: 'TEXTOS', to: '/multimedia/text' },
		{ name: 'AUDIOS', to: '/multimedia/audio' },
		{ name: 'TIPS', to: '/multimedia/tip' },
	]);

	const handleRedirect = (to) => {
		router.push(to);
	};

	return (
		<View style={styles.view}>
			{tabs.map((item, index) => {
				return (
					<TouchableOpacity key={index} onPress={() => handleRedirect(item.to)}>
						<View style={styles.touchable}>
							<Text adjustsFontSizeToFit={true} style={styles.text}>{item.name}</Text>
						</View>
					</TouchableOpacity>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
		justifyContent: 'space-evenly',
		alignItems: 'center',
		backgroundColor: '#000',
	},

	title: {
		color: '#f6f6f6',
		fontSize: 24,
		fontWeight: 'bold',
	},

	touchable: {
		width: 60 * vw,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#f6f6f6',
	},

	text: {
		color: '#000',
		fontSize: 16,
	},
});
