import {
    Entypo,
    FontAwesome,
    FontAwesome6,
    MaterialIcons,
    SimpleLineIcons,
} from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Image,
    Modal,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Modal as PaperModal, Portal } from "react-native-paper";
import Toast from "react-native-toast-message";
import { vh, vw } from "../../../styles/dimensions/dimensions";
import getData from "../../../utils/AsyncStorage/getData";
import getGifsByList from "../../../utils/api/get/getGifsByList";
import getUserData from "../../../utils/api/get/getUserData";
import getUserEvent from "../../../utils/api/get/getUserEvent";
import setStats from "../../../utils/api/post/setStats";
import completeUserEvent from "../../../utils/api/put/completeUserEvent";
import { namesDefinitions } from "../../../utils/constants/names";
import { rythmsDefinitions } from "../../../utils/constants/rythms";
import toSeeMeasure from "../../../utils/functions/toSeeMeasure";
import toSeeSecondMeasure from "../../../utils/functions/toSeeSecondMeasure";
import useCustomFonts from "../../../hooks/useCustomFonts";
import AppLoading from "../../../components/AppLoading";
import toStringWithSpecialChars from "../../../utils/functions/toStringWithSpecialChars";
import loader_image from "../../../assets/loader_image.gif";
import { ResizeMode, Video } from "expo-av";

export default function Activity() {
    const { _id } = useLocalSearchParams();
    const [routine, setRoutine] = useState({});
    const [exercises, setExercises] = useState([]);
    const [gifs, setGifs] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [gifSelected, setGifSelected] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [pdf, setPdf] = useState("");
    const [loaded, error, font] = useCustomFonts();

    const onClose = () => setIsOpen(false);

    const fetch = async () => {
        const user = await getData("user");
        const { data: userDataAPI, error: userDataError } = await getUserData(
            user._id
        );
        const { data: userEvent, error } = await getUserEvent(_id);
        console.log(userEvent, error);
        const gifs_id = userEvent?.exercises
            .map((item) => item.gif_id)
            .filter((item) => item);
        const { data } = await getGifsByList(gifs_id);
        setGifs(data);
        setRoutine(userEvent);
        if (userEvent?.pdf) setPdf(userEvent?.pdf);
        setExercises(userEvent?.exercises);
        setUserData(userDataAPI.data);
        setIsLoading(false);
    };

    const itemToRender = ({ item, index }) => {
        const isFirstRepeat = exercises[index - 1]
            ? exercises[index - 1]?.repeat == 1 && item?.repeat > 1
            : item?.repeat > 1;
        const isLastRepeat =
            (exercises[index + 1]?.repeat == 1 || !exercises[index + 1]) &&
            item?.repeat > 1;
        // const isMidRepeat =
        // 	exercises[index + 1]?.repeat > 1 &&
        // 	exercises[index - 1]?.repeat > 1 &&
        // 	item?.repeat > 1;

        const handleSeeGif = () => {
            console.log("gif: ", item.gif_id);
            console.log(gifs.find((el) => el._id == item.gif_id));
            if (!item.gif_id)
                return Toast.show({
                    type: "info",
                    text1: "Este item no contiene un gif para ver.",
                });
            setGifSelected(item.gif_id);
            setIsOpen(true);
        };

        return item?.repeat > 1 ? (
            <View
                style={{
                    minHeight: 80,
                    marginTop: isFirstRepeat ? 10 : 0,
                    flexDirection: isFirstRepeat ? "column" : "row",
                    backgroundColor: "#ccc",
                    borderTopLeftRadius: isFirstRepeat ? 5 : 0,
                    borderTopRightRadius: isFirstRepeat ? 5 : 0,
                    borderBottomLeftRadius: isLastRepeat ? 5 : 0,
                    borderBottomRightRadius: isLastRepeat ? 5 : 0,
                    paddingHorizontal: 10,
                    paddingBottom: 10,
                    paddingVertical: 5,
                }}
            >
                {isFirstRepeat && (
                    <View
                        style={{
                            paddingHorizontal: 10,
                            height: 30,
                            justifyContent: "start",
                        }}
                    >
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{ fontSize: 16, fontFamily: font }}
                        >{`Repetir secuencia ${item?.repeat} veces`}</Text>
                    </View>
                )}
                <TouchableOpacity
                    onPress={handleSeeGif}
                    style={{
                        borderRadius: 5,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        paddingHorizontal: 10,
                        width: "100%",
                        height: "calc(100% - 20)",
                        backgroundColor: "#f6f6f6",
                    }}
                >
                    <View
                        style={{
                            borderRadius: 5,
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            width: "100%",
                            backgroundColor: "#f6f6f6",
                        }}
                    >
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{
                                fontSize: 18,
                                textAlign: "center",
                                fontFamily: font,
                            }}
                        >
                            {item?.name == "race"
                                ? namesDefinitions[item?.type]
                                : item?.type == "functional"
                                ? item?.name
                                : namesDefinitions[item?.name]}
                        </Text>
                        <View
                            style={{
                                width: "100%",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                paddingHorizontal: 10,
                            }}
                        >
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{ fontFamily: font }}
                            >
                                {toSeeMeasure(item)}
                            </Text>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{ fontSize: 18, fontFamily: font }}
                            >
                                {item?.category &&
                                    rythmsDefinitions[item?.category]}
                            </Text>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{ fontSize: 18, fontFamily: font }}
                            >
                                {item?.second_measure &&
                                    toSeeSecondMeasure(item)}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        ) : (
            <TouchableOpacity onPress={handleSeeGif}>
                <View
                    style={{
                        height: 50,
                        marginTop: 10,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <View
                        style={{
                            borderRadius: 5,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            paddingHorizontal: 10,
                            width: "100%",
                            height: "100%",
                            borderBottomColor: "#000",
                            borderBottomWidth: 1,
                        }}
                    >
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{ fontSize: 18, fontFamily: font }}
                        >
                            {`${
                                item?.name == "race"
                                    ? namesDefinitions[item?.type]
                                    : item?.type == "functional"
                                    ? item?.name
                                    : namesDefinitions[item?.name]
                            } - `}
                            {toSeeMeasure(item)}
                        </Text>
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{ fontSize: 18, fontFamily: font }}
                        >
                            {item?.category &&
                                rythmsDefinitions[item?.category]}
                        </Text>
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{ fontSize: 18, fontFamily: font }}
                        >
                            {item?.second_measure && toSeeSecondMeasure(item)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    useFocusEffect(
        useCallback(() => {
            fetch();
        }, [])
    );

    if (!loaded || error) return <AppLoading />;

    return (
        <>
            {/* GIF */}
            <Modal
                animationType="slide"
                visible={isOpen}
                onRequestClose={onClose}
            >
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#000",
                    }}
                >
                    <View
                        style={{
                            width: "90%",
                            height: "70%",
                            backgroundColor: "#f6f6f6",
                            borderRadius: 5,
                            padding: 10,
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <View
                            style={{
                                width: "100%",
                                alignItems: "flex-end",
                            }}
                        >
                            <TouchableOpacity onPress={onClose}>
                                <MaterialIcons
                                    name="close"
                                    color="#000"
                                    size={30}
                                />
                            </TouchableOpacity>
                        </View>
                        <View />
                        <View
                            style={{
                                width: 80 * vw,
                                height: 80 * vw,
                            }}
                        >
                            {!gifs
                                .find((item) => item._id == gifSelected)
                                ?.gif?.includes(".jpg") ||
                            !gifs
                                .find((item) => item._id == gifSelected)
                                ?.gif?.includes(".gif") ? (
                                <Video
                                    source={{
                                        uri: gifs.find(
                                            (item) => item._id == gifSelected
                                        )?.gif,
                                    }}
                                    isLooping
                                    resizeMode={ResizeMode.CONTAIN}
                                />
                            ) : (
                                <Image
                                    source={{
                                        uri: gifs.find(
                                            (item) => item._id == gifSelected
                                        )?.gif,
                                    }}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                    }}
                                    resizeMode={ResizeMode.CONTAIN}
                                />
                            )}
                        </View>
                        <Text
                            adjustsFontSizeToFit={true}
                            style={{ fontSize: 24, fontFamily: font }}
                        >
                            {toStringWithSpecialChars(
                                gifs.find((item) => item._id == gifSelected)
                                    ?.name
                            )}
                        </Text>
                        <View />
                    </View>
                </View>
            </Modal>
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    height: 93.8 * vh,
                    width: 100 * vw,
                }}
            >
                {isLoading ? (
                    <View
                        style={{
                            justifyContent: "center",
                        }}
                    >
                        <ActivityIndicator
                            style={{ transform: "scale(2)" }}
                            size={"large"}
                            color={"#000"}
                        />
                    </View>
                ) : (
                    <>
                        <View
                            style={{ height: 5 * vh, justifyContent: "center" }}
                        >
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{ fontSize: 28, fontFamily: font }}
                            >
                                {routine?.title}
                            </Text>
                        </View>
                        <View
                            style={{
                                height: 65 * vh,
                                width: 95 * vw,
                            }}
                        >
                            <FlashList
                                renderItem={itemToRender}
                                data={exercises}
                                estimatedItemSize={50}
                            />
                        </View>

                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 4,
                            }}
                        >
                            {routine?.completed ? (
                                <FontAwesome
                                    name="check"
                                    size={18}
                                    color="black"
                                />
                            ) : (
                                <Entypo
                                    name="dot-single"
                                    size={18}
                                    color="black"
                                />
                            )}
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{ fontFamily: font }}
                            >
                                {`Rutina ${
                                    routine?.completed
                                        ? "completa"
                                        : "incompleta"
                                }`}
                            </Text>
                        </View>
                    </>
                )}
            </View>
        </>
    );
}
