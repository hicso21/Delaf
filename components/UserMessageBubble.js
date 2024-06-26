import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function UserMessageBubble({ item, userData }) {
	const [isSelected, setIsSelected] = useState(false);

	const showTime = (time) => {
		let result = '';
		const date = new Date(time);
		const hours = date.getHours();
		const minutes = date.getMinutes();
		result += hours < 10 ? `0${hours}` : hours.toString();
		result += ':';
		result += minutes < 10 ? `0${minutes}` : minutes.toString();
		return result;
	};

	return (
		<Pressable
			style={{
				...styles.view,
				backgroundColor: isSelected ? '#ccc' : '#f6f6f6',
			}}
		>
			<View
				style={{
					...styles.bubble,
					alignSelf: !item.is_user ? 'flex-start' : 'flex-end',
					backgroundColor: !item.is_user ? '#121212' : '#007AFF',
				}}
				key={item._id}
			>
				<Text adjustsFontSizeToFit={true} style={styles.message}>{item.message}</Text>
				<Text adjustsFontSizeToFit={true} style={styles.time}>{showTime(item.createdAt)}</Text>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	view: {
		width: '100%',
		borderRadius: 15,
		paddingVertical: 3,
	},
	bubble: {
		maxWidth: '80%',
		borderRadius: 15,
		padding: 10,
		marginHorizontal: 10,
	},
	from: {
		color: '#f6f6f6',
		margin: 0,
		padding: 0,
		fontSize: 12,
	},
	message: {
		margin: 0,
		padding: 0,
		fontSize: 18,
		color: '#f6f6f6',
		flexShrink: 1,
	},
	time: {
		margin: 0,
		padding: 0,
		fontSize: 12,
		color: '#f6f6f6',
		textAlign: 'right',
	},
});
