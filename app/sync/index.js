import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Toast from "react-native-toast-message";
import getData from "../../utils/AsyncStorage/getData";
import { MaterialIcons } from "@expo/vector-icons";
import { Modal, Portal } from "react-native-paper";
import { vh, vw } from "../../styles/dimensions/dimensions";
import updateRunner from "../../utils/api/put/updateRunner";
import mergeData from "../../utils/AsyncStorage/mergeItem";
import getUserData from "../../utils/api/get/getUserData";
import useCustomFonts from "../../hooks/useCustomFonts";
import AppLoading from "../../components/AppLoading";

const API_MAIN_URL = "https://delaf.click/api/v1";

export default function Sync() {
    const [userData, setUserData] = useState({});
    const [url, setUrl] = useState("");
    const [onSync, setOnSync] = useState(false);
    const [modal, setModal] = useState(false);
    const [loaded, error, font] = useCustomFonts();

    const onOpen = () => setModal(true);
    const onClose = () => setModal(false);

    const handleUnsync = async () => {
        const unsyncedBody = {
            access_token: "",
            brand_id: "",
            refresh_token: "",
        };
        const updatedRunner = await updateRunner(userData._id, unsyncedBody);
        if (!updatedRunner.error) {
            Toast.show({ type: "success", text1: "Conexión eliminada." });
            onClose();
            mergeData("user", updatedRunner.data);
            setUserData(updatedRunner.data);
        } else Toast.show({ type: "error", text1: "Ocurrió un error." });
    };

    const handleRefreshUserData = async () => {
        const { error, data } = await getUserData(userData._id);
        if (!error) {
            mergeData("user", data.data);
            setUserData(data.data);
            Toast.show({
                type: "success",
                text1: "Datos actualizados.",
            });
            setOnSync(false);
        } else Toast.show({ type: "error", text1: "Ocurrió un error" });
    };

    const handleSync = async () => {
        const res = await Linking.canOpenURL(url);
        if (res == true) {
            Linking.openURL(url);
            setTimeout(() => {
                setOnSync(true);
            }, 3000);
        } else
            Toast.show({
                type: "error",
                text1: "Ocurrió un error en la url, por favor ponte en contacto con nosotros",
            });
    };

    const fetch = async () => {
        const user = await getData("user");
        setUrl(`${API_MAIN_URL}/${user.brand}/authorize/${user._id}`);
        setUserData(user);
    };

    useFocusEffect(
        useCallback(() => {
            fetch();
        }, [])
    );

    if (!loaded || error) return <AppLoading />;

    return (
        <>
            <Portal>
                <Modal
                    visible={modal}
                    onDismiss={onClose}
                    contentContainerStyle={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View style={styles.modal}>
                        <Text style={styles.modalText}>
                            Está seguro que desea eliminar la sincronización?
                        </Text>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "flex-end",
                            }}
                        >
                            <TouchableOpacity onPress={onClose}>
                                <View
                                    style={{
                                        borderColor: "#000",
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                        marginRight: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#000",
                                            fontSize: 16,
                                            fontFamily: font,
                                        }}
                                    >
                                        Cancelar
                                    </Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleUnsync}>
                                <View
                                    style={{
                                        borderColor: "#f6f6f6",
                                        backgroundColor: "#000",
                                        borderWidth: 1,
                                        borderRadius: 5,
                                        paddingVertical: 8,
                                        paddingHorizontal: 12,
                                    }}
                                >
                                    <Text
                                        style={{
                                            color: "#f6f6f6",
                                            fontSize: 16,
                                            fontFamily: font,
                                        }}
                                    >
                                        Confirmar
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </Portal>
            <View style={styles.view}>
                {url == "" ? (
                    <View style={{ alignItems: "center", gap: 20 }}>
                        <ActivityIndicator
                            size={"large"}
                            color={"#f6f6f6"}
                            style={{ transform: "scale(2)" }}
                        />
                        <Text
                            style={{
                                color: "#f6f6f6",
                                fontSize: 16,
                                fontFamily: font,
                            }}
                        >
                            Cargando
                        </Text>
                    </View>
                ) : onSync ? (
                    <View style={{ gap: 20, alignItems: "center" }}>
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{
                                color: "#f6f6f6",
                                fontSize: 16,
                                fontFamily: font,
                            }}
                        >
                            Ultimo paso para sincronizar!
                        </Text>
                        <TouchableOpacity onPress={handleRefreshUserData}>
                            <View
                                style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 12,
                                    borderRadius: 8,
                                    borderWidth: 1,
                                    borderColor: "#f6f6f6",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "#f6f6f6",
                                        fontSize: 16,
                                        fontFamily: font,
                                    }}
                                >
                                    Terminar sincronización
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        {!userData?.brand_id && (
                            <View style={{ gap: 50, alignItems: "center" }}>
                                <View />
                                <View style={{ flexDirection: "row", gap: 5 }}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={styles.text}
                                    >
                                        Debes sincronizar tu cuenta con tu reloj
                                    </Text>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={handleSync}>
                                        <View
                                            style={{
                                                ...styles.buttonContainer,
                                                flexDirection: "row",
                                                gap: 5,
                                            }}
                                        >
                                            <MaterialIcons
                                                name="sync"
                                                size={24}
                                                color="#f6f6f6"
                                            />
                                            <Text
                                                adjustsFontSizeToFit={true}
                                                style={styles.text}
                                            >
                                                Sincronizar
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        {userData?.brand_id && (
                            <View style={{ gap: 50, alignItems: "center" }}>
                                <View />
                                <View
                                    style={{
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 5,
                                    }}
                                >
                                    <View
                                        style={{ flexDirection: "row", gap: 5 }}
                                    >
                                        <MaterialIcons
                                            name="verified"
                                            size={24}
                                            color="#f6f6f6"
                                        />
                                        <Text
                                            adjustsFontSizeToFit={true}
                                            style={styles.text}
                                        >
                                            Sincronización completada
                                        </Text>
                                    </View>
                                    <View>
                                        <Text
                                            adjustsFontSizeToFit={true}
                                            style={styles.subtext}
                                        >
                                            {`Conexión con ${userData.brand} exitosa`}
                                        </Text>
                                    </View>
                                </View>
                                <View>
                                    <TouchableOpacity onPress={onOpen}>
                                        <View style={styles.buttonContainer}>
                                            <Text
                                                adjustsFontSizeToFit={true}
                                                style={styles.text}
                                            >
                                                Eliminar sincronización
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    buttonContainer: {
        borderColor: "#f6f6f6",
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    text: {
        color: "#f6f6f6",
        fontSize: 16,
        fontFamily: "IBMPlexSansJP",
    },
    subtext: {
        color: "#f6f6f6",
        fontSize: 14,
        fontFamily: "IBMPlexSansJP",
    },
    modal: {
        backgroundColor: "#f6f6f6",
        width: 80 * vw,
        borderRadius: 15,
        padding: 20,
        gap: 40,
    },
    modalText: {
        fontSize: 18,
        textAlign: "center",
        fontFamily: "IBMPlexSansJP",
    },
});
