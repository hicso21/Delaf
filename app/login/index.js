import { router } from "expo-router";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import StatusBar from "../../components/StatusBar";
import { vh, vw } from "../../styles/dimensions/dimensions";
import setData from "../../utils/AsyncStorage/setData";
import login from "../../utils/api/post/login";
import { AntDesign } from "@expo/vector-icons";
import CountryFlag from "react-native-country-flag";
import useCustomFonts from "../../hooks/useCustomFonts";
import AppLoading from "../../components/AppLoading";

const languages = ["es", "us", "de", "it"];

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [language, setLanguage] = useState("us");
    const [languageModal, setLanguageModal] = useState(false);
    const [loaded, error, font] = useCustomFonts();

    const handleChangeLanguage = (lang) => {
        setLanguage(lang);
        setLanguageModal(false);
        setData("language", language);
    };

    const handleRecovery = () => router.push("/recovery");

    const handleLogin = async () => {
        if (!email || !password)
            return Toast.show({
                type: "info",
                text1: "Recuerda!",
                text2: "Debes ingresar tus datos para poder iniciar sesión",
            });
        const response = await login(email, password);
        if (response.data == "There is no runner with that email address.")
            return Toast.show({
                type: "error",
                text1: "Error",
                text2: "No se encontró ningún usuario con ese correo electrónico.",
            });
        if (response.data == "Incorrect Password.")
            return Toast.show({
                type: "error",
                text1: "Error",
                text2: "La contraseña es errónea.",
            });
        if (response.error)
            return Toast.show({
                type: "error",
                text1: "Ocurrió un error en el servidor.",
                text2: "Por favor contacta nuestro equipo",
            });
        Toast.show({
            type: "success",
            text1: "Genial!",
            text2: "Tu inicio de sesión fue correcto.",
        });
        setData("user", response.data);
        setTimeout(() => {
            router.push("/home");
        }, 1000);
    };

    const handleRegister = async () => {
        router.push("/register");
    };

    if (!loaded || error) return <AppLoading />;

    return (
        <View style={styles.view}>
            <StatusBar />
            <View style={styles.content}>
                {/* <View style={styles.languageContainer}>
					<View
						style={styles.languageContent}
						onTouchEnd={() => setLanguageModal(!languageModal)}
					>
						<AntDesign name='down' size={12} color='#f6f6f6' />
						<CountryFlag
							style={styles.flag}
							isoCode={language}
							size={25}
						/>
					</View>
					{languageModal && (
						<View style={styles.ul}>
							{languages
								.filter((item) => item != language)
								.map((item) => (
									<View
										style={styles.li}
										key={item}
										onTouchEnd={() =>
											handleChangeLanguage(item)
										}
									>
										<AntDesign
											name='right'
											size={12}
											color='#f6f6f6'
										/>
										<CountryFlag
											style={styles.flag}
											isoCode={item}
											size={25}
										/>
									</View>
								))}
						</View>
					)}
				</View> */}
                <View>
                    <View style={styles.container}>
                        <Text adjustsFontSizeToFit={true} style={styles.text}>
                            Email
                        </Text>
                        <TextInput
                            keyboardType="email-address"
                            placeholder="Email"
                            textContentType="emailAddress"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                        />
                    </View>
                    <View style={styles.separator} />
                    <View style={styles.container}>
                        <Text adjustsFontSizeToFit={true} style={styles.text}>
                            Contraseña
                        </Text>
                        <TextInput
                            placeholder="Contraseña"
                            textContentType="password"
                            secureTextEntry={true}
                            value={password}
                            onChangeText={setPassword}
                            style={styles.input}
                        />
                    </View>
                    <View>
                        <TouchableOpacity onPress={handleRecovery}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{ color: "#f6f6f6", fontFamily: font }}
                            >
                                Olvidé mi contraseña
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ alignItems: "center" }}>
                    <TouchableOpacity
                        style={styles.loginContainer}
                        onPress={handleLogin}
                    >
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{
                                color: "#f6f6f6",
                                fontFamily: font,
                                width: "auto",
                            }}
                        >
                            {`INICIAR SESIÓN`}
                        </Text>
                    </TouchableOpacity>
                    <View style={styles.registerContainer}>
                        <Text
                            adjustsFontSizeToFit={true}
                            style={styles.registerText}
                        >
                            Eres nuevo?
                        </Text>
                        <TouchableOpacity onPress={handleRegister}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{
                                    color: "#f6f6f6",
                                    fontFamily: font,
                                    width: "auto",
                                }}
                            >
                                {`REGISTRARSE`}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    languageContainer: {
        position: "absolute",
        top: 10,
        right: 15,
    },
    languageContent: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },
    flag: {
        borderRadius: 5,
    },
    ul: {
        top: 15,
    },
    li: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
    },
    view: {
        height: 100 * vh,
        flex: 1,
    },
    content: {
        flex: 95,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    container: {
        width: 80 * vw,
    },
    input: {
        backgroundColor: "#f6f6f6",
        height: 40,
        borderRadius: 5,
        fontSize: 18,
        paddingHorizontal: 8,
    },
    separator: {
        flex: 0.15,
    },
    text: {
        fontSize: 14,
        color: "#f6f6f6",
        marginBottom: 5,
		fontFamily: 'IBMPlexSansJP'
    },
    loginContainer: {
        width: 100 * vw,
        justifyContent: "center",
        flexDirection: "row",
    },
    registerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 25,
        gap: 5,
        width: 100 * vw,
        justifyContent: "center",
    },
    registerText: {
        color: "#f6f6f6",
        width: "auto",
		fontFamily: 'IBMPlexSansJP'
    },
});
