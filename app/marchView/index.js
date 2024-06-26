import { FontAwesome } from '@expo/vector-icons';
import { Alert, Linking, Text, TouchableOpacity, View } from 'react-native';

export default function MarchView() {
	const handleOpenLink = async () => {
		const url = 'https://wa.me/34633326644';
		const supported = await Linking.canOpenURL(url);
		if (supported) {
			await Linking.openURL(url);
		} else {
			Alert.alert(
				`No se puede abrir el enlace: ${url}`,
				'Por favor, ponte en contacto con este mail: delafenetre@hotmail.com'
			);
		}
	};

	return (
		<View
			style={{
				flex: 1,
				justifyContent: 'space-around',
				alignItems: 'center',
				gap: 20,
				padding: 10,
				backgroundColor: '#000',
			}}
		>
			<Text adjustsFontSizeToFit={true}
				style={{ color: '#f6f6f6', fontSize: 28, textAlign: 'center' }}
			>
				¿Te gustaría comenzar a entrenar?
			</Text>
			<Text adjustsFontSizeToFit={true}
				style={{ color: '#f6f6f6', fontSize: 22, textAlign: 'center' }}
			>
				Escríbeme por WhatsApp y coordinemos una videollamada.
			</Text>
			<TouchableOpacity onPress={handleOpenLink}>
				<View
					style={{
						flexDirection: 'row',
						alignItems: 'center',
						gap: 10,
						borderColor: '#25d366',
						borderWidth: 5,
						paddingHorizontal: 25,
						paddingVertical: 8,
						borderRadius: 50,
					}}
				>
					<FontAwesome
						name='whatsapp'
						size={50}
						style={{ color: '#25d366' }}
					/>
					<Text adjustsFontSizeToFit={true} style={{ color: '#f6f6f6', fontSize: 24 }}>
						Click Aqui!
					</Text>
				</View>
			</TouchableOpacity>
		</View>
	);
}
