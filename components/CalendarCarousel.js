import { Text, TouchableOpacity, View } from "react-native";
import { Card } from "react-native-paper";
import Carousel from "react-native-reanimated-carousel";
import { vw } from "../styles/dimensions/dimensions";
import useCustomFonts from "../hooks/useCustomFonts";
import AppLoading from "./AppLoading";

export default function CalendarCarousel({ itemsOfTheDay }) {
    const [loaded, error, font] = useCustomFonts();

    if (!loaded || error) return <AppLoading />;
    const RenderItem = ({ item }) => {
        const handlePress = () => {};

        const index = itemsOfTheDay.findIndex((el) => el._id == item._id);

        let color = "";

        if (item.type == "routine") color = "#83544a";
        if (item.type == "nutrition") color = "#2b9348";
        if (item.type == "race") color = "#7b2cbf";

        return (
            <TouchableOpacity
                onPress={handlePress}
                style={{
                    marginRight: 10,
                    marginTop: 17,
                }}
            >
                <Card style={{ backgroundColor: "#0c0c0c" }}>
                    <Card.Content>
                        <View
                            style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{
                                    fontSize: 18,
                                    color: "#f6f6f6",
                                    fontFamily: font,
                                }}
                            >
                                {item?.title}
                            </Text>
                            <View
                                style={{
                                    backgroundColor: color,
                                    borderColor: "#f6f6f6",
                                    borderWidth: 1,
                                    height: 50,
                                    width: 50,
                                    borderRadius: 50,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        color: "white",
                                        fontSize: 32,
                                        fontFamily: font,
                                    }}
                                >
                                    {index + 1}
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <Carousel
            id="Carousel"
            pagingEnabled={true}
            mode="parallax"
            width={100 * vw - 16 * vw}
            height={90}
            data={itemsOfTheDay}
            renderItem={RenderItem}
        />
    );
}
