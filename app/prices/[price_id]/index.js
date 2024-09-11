import { useStripe } from "@stripe/stripe-react-native";
import { useFocusEffect, useGlobalSearchParams, router } from "expo-router";
import { useCallback, useState } from "react";
import {
    Alert,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Button,
    TextInput,
} from "react-native";
import Toast from "react-native-toast-message";
import getData from "../../../utils/AsyncStorage/getData";
import getPrices from "../../../utils/api/get/getPrices";
import paymentSheet from "../../../utils/api/post/paymentSheet";
import setPaid from "../../../utils/api/post/setPaid";
import getPaid from "../../../utils/api/get/getPaid";
import useCustomFonts from "../../../hooks/useCustomFonts";
import AppLoading from "../../../components/AppLoading";
import parseSpecialChars from "../../../utils/functions/parseSpecialChars";

export default function Payment() {
    const [loading, setLoading] = useState(false);
    const [priceData, setPriceData] = useState({});
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { price_id } = useGlobalSearchParams();
    const [userData, setUserData] = useState({});
    const [loaded, error, font] = useCustomFonts();

    const fetch = async () => {
        const prices = await getPrices();
        const price_data = prices.find((item) => item.id === price_id);
        setPriceData(price_data);

        const user = await getData("user");
        const paid = await getPaid(user?._id);
        if (paid.data !== null) return router.push("/login");
        setUserData(user);
        const response = await paymentSheet(
            price_data?.unit_amount,
            price_data?.currency,
            user?.email,
            parseSpecialChars(user?.name)
        );

        if (!response?.paymentIntent)
            return Toast.show({
                type: "error",
                text1: "Ocurrió un error en el error.",
                text2: "Por favor pulsa el botón refrescar",
            });

        initializePaymentSheet(response?.customer, response?.paymentIntent);
    };

    const initializePaymentSheet = async (customer, paymentIntent) => {
        const { error } = await initPaymentSheet({
            merchantDisplayName: "DELAF",
            customerId: customer,
            // customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            allowsDelayedPaymentMethods: true,
        });

        if (error) {
            Alert.alert(`Error code: ${error.code}`, error.message);
        } else {
            setLoading(true);
        }
    };

    const openPaymentSheet = async () => {
        const { error: presentError } = await presentPaymentSheet();

        if (presentError)
            return Alert.alert(
                `Error code: ${presentError.code}`,
                presentError.message
            );

        setPaid(userData._id);
        router.push("/home");
    };

    useFocusEffect(
        useCallback(() => {
            fetch();
        }, [])
    );

    if (!loaded || error) return <AppLoading />;

    return (
        <View style={styles.view}>
            <Text adjustsFontSizeToFit={true} style={styles.textContainer}>
                El valor es de{" "}
                {parseFloat(priceData.unit_amount / 100).toFixed(2)}{" "}
                {priceData.currency}
            </Text>
            <TouchableOpacity style={styles.btn} onPress={openPaymentSheet}>
                <Text adjustsFontSizeToFit={true} style={styles.text}>
                    Completar pago
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
        gap: 10,
    },
    textContainer: {
        marginBottom: 15,
        color: "#f6f6f6",
        fontSize: 28,
        fontFamily: 'IBMPlexSansJP'
    },
    btn: {
        padding: 5,
        borderColor: "#f6f6f6",
        borderWidth: 1,
        borderRadius: 5,
    },
    text: {
        color: "#f6f6f6",
        fontSize: 24,
        fontFamily: 'IBMPlexSansJP'
    },
});
