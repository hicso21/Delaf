import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Toast from 'react-native-toast-message';
import getData from '../../utils/AsyncStorage/getData';

const mainUrl = 'https://delaf.click/api/v1';

export default function Sync() {
    const [userData, setUserData] = useState({});
    const [url, setUrl] = useState('');

    const handleSync = async () => {
        console.log(userData);
        const res = await Linking.canOpenURL(url);
        if (res == true) Linking.openURL(url);
        else
            Toast.show({
                type: 'error',
                text1: 'Ocurrió un error en la url, por favor ponte en contacto con nosotros',
            });
    };

    const fetch = async () => {
        const user = await getData('user');
        setUrl(`${mainUrl}/${user.brand}/authorize/${user._id}`);
        setUserData(user);
    };

    useFocusEffect(
        useCallback(() => {
            fetch();
        }, [])
    );

    return (
        <View style={styles.view}>
            {/* <TouchableOpacity onPress={handleSync}>
				<Text adjustsFontSizeToFit={true} style={styles.text}>
					Toca aquí para sincronizarte con tu reloj
				</Text>
			</TouchableOpacity> */}
            {url == '' ? (
                <Text adjustsFontSizeToFit={true}>Cargando...</Text>
            ) : (
                <TouchableOpacity onPress={handleSync}>
                    <Text adjustsFontSizeToFit={true} style={styles.text}>
                        Toca aquí para sincronizar tu reloj
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    btn: {
        borderColor: '#f6f6f6',
        borderWidth: 1,
    },
    text: {
        color: '#f6f6f6',
    },
});
