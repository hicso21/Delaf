import { useEffect, useRef, useState } from 'react';
import {
	Alert,
	Animated,
	PanResponder,
	Pressable,
	StyleSheet,
	Text,
	View,
} from 'react-native';

export default function GlobalMessageBubble({
	item,
	userData,
	messagesSelected,
	setMessagesSelected,
}) {
	const [isSelected, setIsSelected] = useState(false);
	// const pan = useRef(new Animated.ValueXY()).current;

	// const panResponder = useRef(
	// 	PanResponder.create({
	// 		onMoveShouldSetPanResponder: () => true,
	// 		onPanResponderMove: Animated.event([null, { dx: pan.x, dy: 0 }], {
	// 			useNativeDriver: false,
	// 		}),
	// 		onPanResponderRelease: () => {
	// 			pan.extractOffset([null, {dx: 0, dy: 0}]);
	// 		},
	// 	})
	// ).current;

	// const handleMark = () => {
	// 	// const userIdsOfMessages = [
	// 	// 	...new Set(messagesSelected.map((objeto) => objeto.user_id)),
	// 	// ];
	// 	// if (userIdsOfMessages.length != 1){

	// 	// }
	// 	setIsSelected((curr) => !curr);
	// };

	return (
		<Pressable
			// onLongPress={handleMark}
			style={{
				...styles.view,
				backgroundColor: isSelected ? '#ccc' : '#f6f6f6',
			}}
		>
			<View
				style={{
					...styles.bubble,
					alignSelf:
						userData._id != item.user_id
							? 'flex-start'
							: 'flex-end',
					backgroundColor:
						userData._id != item.user_id ? '#121212' : '#007AFF',
				}}
				key={item._id}
			>
				{userData._id != item.user_id && (
					<Text adjustsFontSizeToFit={true} style={{ ...styles.from, color:  '#f6f6f6' }}>
						{item.from}
					</Text>
				)}
				<Text adjustsFontSizeToFit={true}
					style={{
						...styles.message,
						color: '#f6f6f6',
					}}
				>
					{item.message}
				</Text>
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
		margin: 0,
		padding: 0,
		fontSize: 12,
	},
	message: {
		margin: 0,
		padding: 0,
		fontSize: 18,
	},
});
