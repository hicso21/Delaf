import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import profilePicture from "../../assets/DELAF.png";
import { vw } from "../../styles/dimensions/dimensions";
import getData from "../../utils/AsyncStorage/getData";
import mergeData from "../../utils/AsyncStorage/mergeItem";
import getCodeByEmail from "../../utils/api/get/getByEmail";
import getPaid from "../../utils/api/get/getPaid";
import getUserData from "../../utils/api/get/getUserData";
import getAge from "../../utils/functions/getAge";
import useCustomFonts from "../../hooks/useCustomFonts";
import AppLoading from "../../components/AppLoading";
import toStringWithSpecialChars from "../../utils/functions/toStringWithSpecialChars";

export default function Home() {
    const [userData, setUserData] = useState({});
    const [loaded, error, font] = useCustomFonts();

    const verifications = async (user) => {
        if (!user?.email || !user?.email.includes("@")) {
            router.push("/login");
            return true;
        }
        const data = await getCodeByEmail(user.email);
        const response = await getPaid(user?._id);
        if (response.error) {
            router.push(`/prices/${data.price_id}`);
            return true;
        }
        return false;
    };

    const fetch = async () => {
        const user = await getData("user");
        const stop = await verifications(user);
        if (stop) return;
        if (user?.error)
            return Toast.show({
                type: "error",
                text1: "Ocurrió un error cargando tus datos.",
                text2: "Por favor cierra sesión y vuelve a iniciar.",
            });
        const { error, data } = await getUserData(user._id);
        if (!error) {
            mergeData("user", data?.data);
            setUserData(data?.data);
        } else {
            setUserData(user);
        }
    };

    useEffect(() => {
        fetch();
    }, []);

    if (!loaded || error) return <AppLoading />;

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <View
                style={{
                    width: 80 * vw,
                    paddingVertical: 40,
                    marginBottom: 5,
                    borderRadius: 5,
                    backgroundColor: "#000",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    style={{
                        width: 250,
                        height: 200,
                        borderRadius: 100,
                    }}
                    source={profilePicture}
                    alt="Profile picture"
                />
                <Text
                    adjustsFontSizeToFit={true}
                    style={{
                        color: "#f6f6f6",
                        fontSize: 14,
                        opacity: 0.75,
                        marginVertical: 5,
                        fontFamily: font,
                    }}
                >
                    Bienvenido
                </Text>
                <Text
                    adjustsFontSizeToFit={true}
                    style={{
                        color: "#f6f6f6",
                        fontSize: 24,
                        fontFamily: font,
                    }}
                >
                    {toStringWithSpecialChars(userData?.name)}
                </Text>
                <Text
                    adjustsFontSizeToFit={true}
                    style={{
                        color: "#f6f6f6",
                        fontSize: 18,
                        fontFamily: font,
                    }}
                >{`${userData?.city}, ${userData?.country}`}</Text>
            </View>
            <View
                style={{
                    width: 80 * vw,
                    flexDirection: "row",
                    justifyContent: "space-around",
                    marginTop: 10,
                }}
            >
                <View style={{ alignItems: "center" }}>
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{ fontFamily: font }}
                    >
                        EDAD
                    </Text>
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{ fontFamily: font }}
                    >{`${getAge(
                        new Date(userData?.birthday).getTime()
                    )} años`}</Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{ fontFamily: font }}
                    >
                        ALTURA
                    </Text>
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{ fontFamily: font }}
                    >
                        {`${userData?.height} cm`}
                    </Text>
                </View>
                <View style={{ alignItems: "center" }}>
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{ fontFamily: font }}
                    >
                        PESO
                    </Text>
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{ fontFamily: font }}
                    >
                        {`${userData?.weight} kg`}
                    </Text>
                </View>
            </View>
        </View>
    );
}
