import { ActivityIndicator, StyleSheet } from 'react-native';

export default async function LoadingSpinner() {
	return (
		<>
			<ActivityIndicator
				style={styles.spinner}
				size={'large'}
				color={'#f6f6f6'}
			/>
		</>
	);
}

const styles = StyleSheet.create({
	spinner: {
		transform: 'scale(2)',
	},
});
