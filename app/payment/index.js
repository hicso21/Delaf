import { CardField, useStripe } from "@stripe/stripe-react-native";
import { View } from "react-native";
import useCustomFonts from "../../hooks/useCustomFonts";
import AppLoading from "../../components/AppLoading";

export default function PaymentScreen() {
    const { confirmPayment } = useStripe();
    const [loaded, error, font] = useCustomFonts();

    if (!loaded || error) return <AppLoading />;

    return (
        <View style={{ flex: 1, alignItems: "center" }}>
            <CardField
                postalCodeEnabled={true}
                placeholders={{
                    number: "4242 4242 4242 4242",
                }}
                cardStyle={{
                    backgroundColor: "#FFFFFF",
                    textColor: "#000000",
                }}
                style={{
                    width: "100%",
                    height: 50,
                    marginVertical: 30,
                }}
                onCardChange={(cardDetails) => {
                    console.log("cardDetails", cardDetails);
                }}
                onFocus={(focusedField) => {
                    console.log("focusField", focusedField);
                }}
            />
        </View>
    );
}
