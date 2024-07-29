import { useFocusEffect, router } from "expo-router";
import { Image, Text, View } from "react-native";
import logo from "../assets/DELAF.png";
import useCustomFonts from "../hooks/useCustomFonts";
import AppLoading from "../components/AppLoading";

export default function Page() {
    const [loaded, error, font] = useCustomFonts();

    const fetch = () => {
        router.push("/redirect");
    };

    useFocusEffect(() => {
        fetch();
    });

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
            <View style={{ aspectRatio: 1, width: 250 }}>
                <Image
                    source={logo}
                    style={{ width: "100%", height: "100%", borderRadius: 10 }}
                />
            </View>
            <Text
                adjustsFontSizeToFit={true}
                style={{ color: "#f6f6f6", fontSize: 18, fontFamily: font }}
            >
                Cargando...
            </Text>
        </View>
    );
}
