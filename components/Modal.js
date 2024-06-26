import { StyleSheet, View } from 'react-native';
import { vh, vw } from '../styles/dimensions/dimensions';
import { useState } from 'react';

export default function Modal({ content, open }) {
	return (
		<View style={{ ...styles.container, display: open ? 'flex' : 'none' }}>
			<View style={styles.modal}>{content}</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		width: 100 * vw,
		height: 100 * vh,
		backgroundColor: 'rgba(0,0,0, 0.5)',
        zIndex: 10,
        justifyContent: 'center',
        alignItems: 'center'
	},
	modal: {
		maxWidth: 90 * vw,
		maxHeight: 70 * vh,
		backgroundColor: '#f6f6f6',
		minHeight: 5 * vh,
		minWidth: 60 * vw,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center'
	},
});
