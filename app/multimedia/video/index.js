import { ResizeMode, Video } from "expo-av";
import { useFocusEffect, useNavigation } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import Toast from "react-native-toast-message";
import toco_y_me_voy from "../../../assets/toco_y_me_voy-Nahuel_Pennisi.mp4";
import { vh, vw } from "../../../styles/dimensions/dimensions";
import getVideos from "../../../utils/api/get/getVideos";
import useCustomFonts from "../../../hooks/useCustomFonts";
import AppLoading from "../../../components/AppLoading";
import toStringWithSpecialChars from "../../../utils/functions/toStringWithSpecialChars";

/* 
		name: String,
		description: String,
		src: String,
*/

const videosArray = [
    {
        data: {
            name: "Toco y me voy - Nahuel Pennisi",
            src: toco_y_me_voy,
            description: `Lorem ipsum dolor sit amet consectetur adipisicing elit.
			Reprehenderit ducimus rerum officia nemo recusandae ex quia quas minima molestiae nulla, mollitia necessitatibus, aspernatur, et doloribus hic illo magnam nam aperiam ea consequatur.
			Magnam fugiat nihil expedita repellendus soluta odit aut adipisci repellat modi suscipit doloremque unde dolorum amet, voluptatibus consequuntur.`,
        },
    },
];

const ModalContent = ({ open }) => {
    return (
        <View
            style={{
                width: 100 * vw,
                aspectRatio: 16 / 9,
                backgroundColor: "#000",
                position: "absolute",
                justifyContent: "center",
                alignItems: "center",
                top: 0,
                left: 0,
                zIndex: 999,
                display: open ? "flex" : "none",
            }}
        >
            <ActivityIndicator size={"large"} color={"#f6f6f6"} />
        </View>
    );
};

const RenderItem = ({ item }) => {
    const [status, setStatus] = useState({});
    const [source, setSource] = useState(item?.data?.src);
    const video = useRef(null);
    const [open, setOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const navigation = useNavigation();

    useFocusEffect(
        useCallback(() => {
            if (Object.keys(status).length == 0) return;
            // status.durationMillis => duración total del video en ms
            // status.positionMillis => cantidad de ms que va reproduciendo el video
            const unsubscribe = navigation.addListener("blur", () => {
                // Detener la reproducción del video
                video?.current?.stopAsync();
            });

            return unsubscribe;
        }, [status])
    );

    return (
        <>
            <ModalContent open={open} />
            {item?.data?.name ? (
                <View style={styles.itemContainer}>
                    <Video
                        onLoadStart={() => {
                            // start loading
                            setOpen(true);
                        }}
                        onLoad={() => {
                            // finish load
                            setOpen(false);
                        }}
                        style={styles.video}
                        ref={video}
                        source={source ?? null}
                        useNativeControls
                        resizeMode={ResizeMode.CONTAIN}
                        onPlaybackStatusUpdate={(status) =>
                            setStatus(() => status)
                        }
                    />
                    <Text adjustsFontSizeToFit={true} style={styles.itemText}>
                        {toStringWithSpecialChars(item?.data?.name)}
                    </Text>
                    <View
                        style={{ maxHeight: `calc(100% - 41 - ${100 * vw})` }}
                    >
                        <ScrollView style={{ width: "100%", height: "100%" }}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.itemDescription}
                            >
                                {toStringWithSpecialChars(
                                    item?.data?.description
                                )}
                            </Text>
                        </ScrollView>
                    </View>
                </View>
            ) : (
                <View style={styles.itemContainer}>
                    <View style={styles.video} />
                    <Text adjustsFontSizeToFit={true} style={styles.itemText}>
                        {toStringWithSpecialChars(item?.data?.name)}
                    </Text>
                    <ScrollView>
                        <Text
                            adjustsFontSizeToFit={true}
                            style={styles.itemDescription}
                        >
                            {toStringWithSpecialChars(item?.data?.description)}
                        </Text>
                    </ScrollView>
                </View>
            )}
        </>
    );
};

export default function () {
    const [videos, setVideos] = useState([]);
    const [currentItem, setCurrentItem] = useState(0);
    const [loaded, error, font] = useCustomFonts();

    const fetch = async () => {
        const { data, error } = await getVideos();
        if (error)
            return Toast.show({
                type: "error",
                text1: "Ocurrió un error, por favor contáctanos.",
            });
        if (data.length) setVideos(data);
        else Toast.show({ type: "info", text1: "Aún no hay videos" });
    };

    useFocusEffect(
        useCallback(() => {
            fetch();
        }, [])
    );

    if (!loaded || error) return <AppLoading />;

    return (
        <View style={styles.view}>
            {videos.length > 0 ? (
                <Carousel
                    width={100 * vw}
                    height={`calc(${100 * vh} - ${6.2 * vh})`}
                    data={videos}
                    pagingEnabled={true}
                    onSnapToItem={(index) => setCurrentItem(index)}
                    renderItem={({ item, index }) =>
                        currentItem == index ? (
                            <RenderItem item={item} />
                        ) : (
                            <RenderItem />
                        )
                    }
                />
            ) : (
                <Text
                    adjustsFontSizeToFit={true}
                    style={{
                        fontSize: 22,
                        color: "#f6f6f6",
                        fontFamily: font,
                    }}
                >
                    Aún no hay videos
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    itemContainer: {
        flex: 1,
        justifyContent: "flex-start",
        backgroundColor: "#000",
    },
    itemText: {
        textAlign: "left",
        fontSize: 22,
        color: "#f6f6f6",
        paddingLeft: 5,
        borderTopWidth: 1,
        borderTopColor: "#f6f6f6",
        paddingTop: 5,
        fontFamily: "IBMPlexSansJP",
    },
    itemDescription: {
        textAlign: "left",
        fontSize: 18,
        color: "#f6f6f6",
        paddingLeft: 5,
        marginTop: 20,
        fontFamily: "IBMPlexSansJP",
    },
    video: {
        width: "100%",
        height: "auto",
        aspectRatio: 16 / 9,
        backgroundColor: "#000",
    },
});
