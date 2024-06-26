import { useFocusEffect, router } from 'expo-router';
import { useCallback } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import logo from '../../assets/DELAF.png';
import getData from '../../utils/AsyncStorage/getData';

export default function Redirect() {
    const fetch = async () => {
        const user = await getData('user');
        if (user?.email) router.push('/home');
        else router.push('/login');
        // else router.push('/prices/price_1P8jfTAXPkjgDqVOmsyj2Xsr');
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
            <View style={{ aspectRatio: 1, width: 250 }}>
                <Image
                    source={logo}
                    style={{ width: '100%', height: '100%', borderRadius: 10 }}
                />
            </View>
            <Text adjustsFontSizeToFit={true} style={{ color: '#f6f6f6', fontSize: 18 }}>Cargando...</Text>
        </View>
    );
}

// export default function Redirect() {
// 	const router = useRouter();

// 	const fetch = async () => {
// 		const user = await getData('user');
// 		if (user?.email) router.push('/home');
// 		else router.push('/login');
// 	};

// 	const redirectToRegister = () => router.push('/register');
// 	const redirectToMarchView = () => router.push('/marchView');

// 	useFocusEffect(
// 		useCallback(() => {
// 			// fetch();
// 		}, [])
// 	);

// 	return (
// 		<View
// 			style={{
// 				flex: 1,
// 				justifyContent: 'center',
// 				alignItems: 'center',
// 				backgroundColor: '#000',
// 			}}
// 		>
// 			<View style={{ aspectRatio: 1, width: 250 }}>
// 				<Image
// 					source={logo}
// 					style={{ width: '100%', height: '100%', borderRadius: 10 }}
// 				/>
// 			</View>
// 			<View
// 				style={{
// 					flexDirection: 'row',
// 					marginTop: 20,
// 					width: '100%',
// 					justifyContent: 'space-around',
// 				}}
// 			>
// 				<TouchableOpacity onPress={redirectToRegister}>
// 					<View
// 						style={{
// 							paddingVertical: 10,
// 							paddingHorizontal: 15,
// 							borderRadius: 5,
// 							borderWidth: 1,
// 							borderColor: '#f6f6f6',
// 						}}
// 					>
// 						<Text adjustsFontSizeToFit={true} style={{ color: '#f6f6f6', fontSize: 18 }}>
// 							Ingresar código
// 						</Text>
// 					</View>
// 				</TouchableOpacity>
// 				<TouchableOpacity onPress={redirectToMarchView}>
// 					<View
// 						style={{
// 							paddingVertical: 10,
// 							paddingHorizontal: 15,
// 							borderRadius: 5,
// 							borderWidth: 1,
// 							borderColor: '#f6f6f6',
// 						}}
// 					>
// 						<Text adjustsFontSizeToFit={true} style={{ color: '#f6f6f6', fontSize: 18 }}>
// 							No tengo código
// 						</Text>
// 					</View>
// 				</TouchableOpacity>
// 			</View>
// 		</View>
// 	);
// }
