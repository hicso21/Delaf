import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { Avatar, Card, Modal, Portal } from "react-native-paper";
import Toast from "react-native-toast-message";
import logo from "../../assets/DELAF.png";
import { Agenda } from "react-native-calendars";
import toYYYYMMDD from "../../utils/functions/toYYYYMMDDFormat";
import getData from "../../utils/AsyncStorage/getData";
import getRaces from "../../utils/api/get/getRaces";
import standarizeCalendarData from "../../utils/functions/standarizeCalendarData";
import useCustomFonts from "../../hooks/useCustomFonts";
import AppLoading from "../../components/AppLoading";
import toStringWithSpecialChars from "../../utils/functions/toStringWithSpecialChars";

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split("T")[0];
};

export default function RacesCalendar() {
    const [currentDate] = useState(toYYYYMMDD());
    const [selected, setSelected] = useState({
        dateString: timeToString(Date.now()),
        day: new Date().getDate(),
        month: new Date().getMonth(),
        timestamp: Date.now(),
        year: new Date().getFullYear(),
    });
    const [items, setItems] = useState({});
    const [loaded, error, font] = useCustomFonts();

    const fetch = async () => {
        const user = await getData("user");
        const data = await getRaces();
        console.log(data);
        Alert.alert("", JSON.stringify(data));
        if (data?.error)
            return Toast.show({
                type: "error",
                text1: "Ocurrió un error en el servidor.",
                text2: "Por favor contactese con nostros.",
            });
        const events = standarizeCalendarData(data?.data);
        setItems(events);
    };

    useFocusEffect(
        useCallback(() => {
            fetch();
        }, [])
    );
    if (!loaded || error) return <AppLoading />;

    const emptyDay = () => {
        return (
            <View
                style={{
                    width: "100%",
                    height: "auto",
                    flexDirection: "row",
                    alignItems: "center",
                    paddingRight: 10,
                    paddingLeft: 0,
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        width: "18%",
                    }}
                >
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{
                            fontFamily: "System",
                            color: "#7a92a5",
                            fontSize: 28,
                            fontFamily: font,
                        }}
                    >
                        {selected?.day}
                    </Text>
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{
                            fontFamily: "System",
                            color: "#7a92a5",
                            fontSize: 14,
                            fontFamily: font,
                        }}
                    >
                        {
                            new Date(selected?.dateString)
                                .toGMTString()
                                .split(",")[0]
                        }
                    </Text>
                </View>
                <View
                    style={{
                        height: 96,
                        width: `82%`,
                        marginTop: 20,
                        borderRadius: 5,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{ fontFamily: font }}
                    >
                        No se encontraron carreras este día
                    </Text>
                </View>
            </View>
        );
    };

    const renderItem = (item) => {
        const handlePress = () => {
            console.log("first");
        };

        return (
            <TouchableOpacity
                onPress={handlePress}
                style={{
                    marginRight: 10,
                    marginTop: 17,
                }}
            >
                <Card style={{ backgroundColor: "#ccc" }}>
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
                                style={{ fontSize: 18, fontFamily: font }}
                            >
                                {toStringWithSpecialChars(item?.name)}
                            </Text>
                            <Avatar.Image
                                style={{ backgroundColor: "#000" }}
                                source={logo}
                            />
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <Agenda
                style={{
                    width: "100%",
                    height: "100%",
                }}
                items={items}
                pastScrollRange={0}
                minDate={currentDate}
                renderItem={renderItem}
                renderEmptyData={emptyDay}
                onDayPress={(day) => setSelected(day)}
            />
        </View>
    );
}
