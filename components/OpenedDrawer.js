import { AntDesign, SimpleLineIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    Alert,
    Image,
    Pressable,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import profilePicture from "../assets/DELAF.png";
import { ARROW_SIZE, style } from "../styles/openedDrawer.js";
import StatusBar from "./StatusBar";
import getData from "../utils/AsyncStorage/getData.js";
import { useEffect, useState } from "react";
import clearData from "../utils/AsyncStorage/clearData.js";
import useCustomFonts from "../hooks/useCustomFonts.js";
import AppLoading from "./AppLoading.js";

export default function OpenedDrawer(props) {
    const [redirectButtons, setRedirectButtons] = useState([
        { id: 0, text: "PERFIL", route: "/profile" },
        // { id: 1, text: 'ACTIVIDADES', route: '/activities' },
        // { id: 2, text: 'FREC. CARDIACA', route: '/frecuency' },
        // { id: 3, text: 'ESTADO DE ENTRENO', route: '/status' },
        // { id: 4, text: 'VO2 MAX', route: '/vo2' },
        { id: 5, text: "SINCRONIZAR", route: "/sync" },
        // { id: 6, text: 'CONFIGURACION', route: '/config' },
        { id: 7, text: "CERRAR SESIÓN", route: "/logout" },
    ]);
    const [userData, setUserData] = useState({});
    const [loaded, error, font] = useCustomFonts();

    if (!loaded || error) return <AppLoading />;

    const logout = async (router) => {
        const isUserDataDeleted = await clearData("user");
        if (isUserDataDeleted) router.push("/login");
        else
            Alert.alert(
                "Error",
                "Ocurrió un error al cerrar sesión. \n Intenta de nuevo"
            );
    };

    const fetch = async () => {
        const user = await getData("user");
        setUserData(user);
    };

    useEffect(() => {
        fetch();
    }, []);

    return (
        <View style={style.drawer}>
            <StatusBar properties={{ backgroundColor: "red" }} />
            <View style={style.dataContainer}>
                <View style={style.profile}>
                    <View style={style.imgContainer}>
                        <Image style={style.img} source={profilePicture} />
                    </View>
                    <View style={style.profileInfo}>
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{ ...style.name, fontFamily: font }}
                        >
                            {userData?.name?.length > 18
                                ? `${userData?.name.substring(0, 17)}...`
                                : userData?.name}
                        </Text>
                        <Text
                            adjustsFontSizeToFit={true}
                            style={style.location}
                        >
                            {`${userData?.city}, ${userData?.country}`}
                        </Text>
                    </View>
                </View>
                <View style={style.separatorContainer}>
                    <View style={style.separator} />
                </View>
                <View style={style.ul}>
                    {redirectButtons.map((data) => {
                        return (
                            <TouchableOpacity
                                key={data.id}
                                style={style.li}
                                onPress={() => {
                                    if (data.route == "/logout")
                                        return logout(router);
                                    router.push(data.route);
                                    props.state.history[1].status = "closed";
                                }}
                            >
                                <Text
                                    adjustsFontSizeToFit={true}
                                    style={style.liContent}
                                >
                                    {data.text}
                                </Text>
                                {data.route == "/logout" ? (
                                    <SimpleLineIcons
                                        name="logout"
                                        size={ARROW_SIZE}
                                        color="#f6f6f6"
                                    />
                                ) : (
                                    <AntDesign
                                        name="right"
                                        size={ARROW_SIZE}
                                        style={style.liContent}
                                    />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
        </View>
    );
}
