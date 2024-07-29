import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import useCustomFonts from "../../hooks/useCustomFonts";
import AppLoading from "../../components/AppLoading";

export default function Chat() {
    const [loaded, error, font] = useCustomFonts();

    const toJuanChat = () => router.push("/chat/juan");
    const toGlobalChat = () => router.push("/chat/global");

    if (!loaded || error) return <AppLoading />;

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#000",
            }}
        >
            <View style={{ height: "50%", justifyContent: "space-evenly" }}>
                <TouchableOpacity onPress={toJuanChat}>
                    <View
                        style={{
                            borderRadius: 5,
                            padding: 10,
                            backgroundColor: "#f6f6f6",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{
                                color: "#000",
                                fontSize: 20,
                                fontFamily: font,
                            }}
                        >
                            Chat con Juan
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={toGlobalChat}>
                    <View
                        style={{
                            borderRadius: 5,
                            padding: 10,
                            backgroundColor: "#f6f6f6",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{
                                color: "#000",
                                fontSize: 20,
                                fontFamily: font,
                            }}
                        >
                            Chat Global
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
}
