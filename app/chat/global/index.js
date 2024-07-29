import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
    Text,
    ScrollView,
} from "react-native";
import io from "socket.io-client";
import GlobalMessageBubble from "../../../components/GlobalMessageBubble";
import { vh, vw } from "../../../styles/dimensions/dimensions";
import getData from "../../../utils/AsyncStorage/getData";
import useCustomFonts from "../../../hooks/useCustomFonts";
import AppLoading from "../../../components/AppLoading";

let socket;

export default function GlobalChat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [userData, setUserData] = useState({});
    const [messagesSelected, setMessagesSelected] = useState([]);
    const flashlist = useRef(null);
    const [loaded, error, font] = useCustomFonts();

    if (!loaded || error) return <AppLoading />;

    const receiveMessage = useCallback((message) => {
        setMessages((state) => [...state, message]);
        socket.auth.serverOffset = message.createdAt;
    }, []);

    const handleSubmit = (event) => {
        if (message == "") return;
        const newMessage = {
            message: message.trim(),
            from: userData.name,
            user_id: userData._id,
            on_response: {},
        };
        setMessage("");
        socket.emit("global chat", newMessage);
    };

    const fetch = async () => {
        const user = await getData("user");
        socket = io("https://delaf.click", {
            auth: {
                username: user.name,
                serverOffset: 0,
            },
        });
        setUserData(user);
    };

    useEffect(() => {
        fetch().then(() => socket.on("global chat", receiveMessage));

        return () => {
            socket.off("global chat", receiveMessage);
        };
    }, []);

    useEffect(() => {
        if (messages.length == 0) return;
        flashlist.current.scrollToEnd();
    }, [messages]);

    return (
        <>
            <TouchableOpacity
                style={{
                    position: "absolute",
                    top: -40,
                    right: 15,
                    zIndex: 100,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
                onPress={() => router.push("/races")}
            >
                <FontAwesome color={"white"} size={30} name="flag-checkered" />
            </TouchableOpacity>
            <SafeAreaView style={{ flex: 1 }}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    keyboardVerticalOffset={60}
                >
                    <View style={styles.entireView}>
                        <View style={styles.flatlist}>
                            <FlashList
                                ref={flashlist}
                                estimatedItemSize={200}
                                data={messages}
                                keyExtractor={(_, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <GlobalMessageBubble
                                        item={item}
                                        userData={userData}
                                        messagesSelected={messagesSelected}
                                        setMessagesSelected={
                                            setMessagesSelected
                                        }
                                    />
                                )}
                                contentContainerStyle={{
                                    paddingHorizontal: 10,
                                    paddingVertical: 10,
                                }}
                                automaticallyAdjustKeyboardInsets
                            />
                        </View>
                        <View style={styles.bottomContainer}>
                            {/* <TouchableOpacity style={styles.buttonContainer}>
								<Entypo name='user' size={40} color='white' />
							</TouchableOpacity> */}
                            <TextInput
                                placeholder="Mensaje"
                                value={message}
                                onChangeText={setMessage}
                                style={styles.input}
                            />
                            {/* <TouchableOpacity
                            onPress={() => {
                                router.push('/races');
                            }}
                            style={styles.buttonContainer}
                        >
                            <Ionicons
                                name="calendar-sharp"
                                size={40}
                                color="white"
                            />
                        </TouchableOpacity> */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={styles.buttonContainer}
                            >
                                <Ionicons name="send" size={30} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push("/chat/juan");
                                }}
                                style={styles.buttonContainer}
                            >
                                <View
                                    style={{
                                        backgroundColor: "#007AFF",
                                        width: 40,
                                        height: 40,
                                        borderTopLeftRadius: 15,
                                        borderTopRightRadius: 15,
                                        borderBottomLeftRadius: 15,
                                        borderBottomRightRadius: 5,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={{
                                            fontSize: 24,
                                            color: "white",
                                            fontFamily: font,
                                        }}
                                    >
                                        J
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
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
    flatlist: {
        overflow: "auto",
        height: 100 * vh - 7 * vh - 40 - 61,
        width: "100%",
        marginBottom: 5,
        backgroundColor: "#f6f6f6",
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: 100 * vw,
    },
    buttonContainer: {
        width: 30,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        height: 40,
        borderRadius: 15,
        backgroundColor: "#f6f6f6",
        width: 100 * vw - 170 + 60,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
});
