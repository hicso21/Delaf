import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Button, StyleSheet, View } from "react-native";
import StatusBar from "../../components/StatusBar";
import { vw } from "../../styles/dimensions/dimensions";
import getPrices from "../../utils/api/get/getPrices";
import useCustomFonts from "../../hooks/useCustomFonts";
import AppLoading from "../../components/AppLoading";

export default function Payment() {
    const [prices, setPrices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loaded, error, font] = useCustomFonts();

    const fetch = async () => {
        const listOfPrices = await getPrices();
        setPrices(listOfPrices);
        setIsLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetch();
        }, [])
    );

    if (!loaded || error) return <AppLoading />;

    return (
        <>
            <StatusBar />
            <View style={styles.entireView}>
                {isLoading ? (
                    <View>
                        <ActivityIndicator
                            style={styles.spinner}
                            size={"large"}
                            color={"#f6f6f6"}
                        />
                    </View>
                ) : (
                    <>
                        {/* <Text adjustsFontSizeToFit={true} style={styles.title}>Escoge una membresía</Text>
						<ScrollView style={styles.content}>
							{prices.map((item) => {
								return (
									<View style={styles.li} key={item.id}>
										<View style={styles.li_imgContainer}>
											<Image
												style={styles.li_img}
												source={src}
											/>
										</View>
										<Text adjustsFontSizeToFit={true} style={styles.li_text}>
											{item.nickname}
										</Text>
										<TouchableOpacity style={styles.li_btn}>
											<Text adjustsFontSizeToFit={true} style={styles.li_btnText}>
												Suscribirme
											</Text>
										</TouchableOpacity>
									</View>
								);
							})}
						</ScrollView> */}

                        <Button
                            onPress={() => router.push("/login")}
                            title="<-"
                        />
                    </>
                )}
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    entireView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    spinner: {
        transform: "scale(2)",
    },
    title: {
        fontSize: 30,
        color: "#f6f6f6",
        marginVertical: 20,
        fontFamily: "IBMPlexSansJP",
    },
    content: {
        flex: 100,
    },
    li: {
        width: 60 * vw,
        gap: 10,
        marginVertical: 10,
        padding: 10,
        borderColor: "#f6f6f6",
        borderWidth: 1,
        borderRadius: 10,
        alignItems: "center",
    },
    li_imgContainer: {
        aspectRatio: 1,
        width: 50 * vw,
    },
    li_img: {
        objectFit: "contain",
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    li_text: {
        color: "#f6f6f6",
        fontSize: 24,
        textAlign: "center",
        fontFamily: "IBMPlexSansJP",
    },
    li_btn: {
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#f6f6f6",
        padding: 5,
        borderRadius: 5,
    },
    li_btnText: {
        color: "#f6f6f6",
        fontFamily: "IBMPlexSansJP",
    },
});
