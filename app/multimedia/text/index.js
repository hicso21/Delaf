import { useCallback, useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import getTexts from "../../../utils/api/get/getTexts";
import { vh, vw } from "../../../styles/dimensions/dimensions";
import Carousel from "react-native-reanimated-carousel";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import useCustomFonts from "../../../hooks/useCustomFonts";
import AppLoading from "../../../components/AppLoading";

/* 
		name: String,
		description: String,
*/

export default function () {
    const [texts, setTexts] = useState([]);
    const [page, setPage] = useState(0);
    const [loaded, error, font] = useCustomFonts();

    const nextPage = () => {
        if (page + 1 == texts.length) setPage(0);
        else setPage((curr) => curr + 1);
    };

    const prevPage = () => {
        if (page == 0) setPage(texts.length - 1);
        else setPage((curr) => curr - 1);
    };

    const fetch = async () => {
        const { data, error } = await getTexts();
        if (error)
            return Toast.show({
                type: "error",
                text1: "Ocurrió un error, por favor contáctanos.",
            });
        if (data.length) setTexts(data);
        else Toast.show({ type: "info", text1: "Aún no hay videos" });
    };

    useEffect(
        useCallback(() => {
            fetch();
        }, [])
    );

    if (!loaded || error) return <AppLoading />;

    return (
        <View style={styles.view}>
            <View
                style={{
                    flex: 1,
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#000",
                }}
            >
                <View
                    style={{
                        paddingVertical: 10,
                        borderBottomColor: "#f6f6f6",
                        borderBottomWidth: 1,
                        marginBottom: 3,
                        width: 100 * vw,
                        alignItems: "center",
                    }}
                >
                    <Text adjustsFontSizeToFit={true} style={styles.itemText}>
                        {texts[page]?.data?.name}
                    </Text>
                </View>
                <ScrollView>
                    <Text
                        adjustsFontSizeToFit={true}
                        style={styles.itemDescription}
                    >
                        {texts[page]?.data?.description}
                    </Text>
                </ScrollView>
                <View
                    style={{
                        flexDirection: "row",
                        width: 100 * vw,
                        height: "auto",
                        justifyContent: "space-around",
                        alignItems: "center",
                        paddingVertical: 5,
                    }}
                >
                    <TouchableOpacity onPress={prevPage}>
                        <Feather name="arrow-left" size={30} color="#f6f6f6" />
                    </TouchableOpacity>
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{
                            color: "#f6f6f6",
                            fontSize: 18,
                            fontFamily: font,
                        }}
                    >
                        {`${page + 1}/${texts.length}`}
                    </Text>
                    <TouchableOpacity onPress={nextPage}>
                        <Feather name="arrow-right" size={30} color="#f6f6f6" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 93.8 * vh,
    },
    itemText: {
        textAlign: "center",
        fontSize: 22,
        color: "#f6f6f6",
        paddingLeft: 5,
        fontFamily: "IBMPlexSansJP",
    },
    itemDescription: {
        textAlign: "center",
        fontSize: 18,
        color: "#f6f6f6",
        paddingLeft: 5,
        fontFamily: "IBMPlexSansJP",
    },
});
