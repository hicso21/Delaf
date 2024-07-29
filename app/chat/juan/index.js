import { Entypo, EvilIcons, Ionicons } from "@expo/vector-icons";
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { vh, vw } from "../../../styles/dimensions/dimensions";
import { useEffect, useRef, useState } from "react";
import getData from "../../../utils/AsyncStorage/getData";
import io from "socket.io-client";
import UserMessageBubble from "../../../components/UserMessageBubble";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import useCustomFonts from "../../../hooks/useCustomFonts";
import AppLoading from "../../../components/AppLoading";

let socket;

export default function JuanChat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [userData, setUserData] = useState({});
    const flashlist = useRef(null);
    const [loaded, error, font] = useCustomFonts();

    if (!loaded || error) return <AppLoading />;

    const handleSubmit = (event) => {
        event.preventDefault();
        if (message == "") return;
        const newMessage = {
            message: message.trim(),
            user_id: userData?._id,
            is_user: true,
            name: userData?.name,
        };
        setMessage("");
        socket.emit("user chat", newMessage);
    };

    const receiveMessage = (message, serverOffset) => {
        setMessages((state) => [...state, message]);
        socket.auth.serverOffset = message.createdAt;
    };

    const fetch = async () => {
        const user = await getData("user");
        socket = io("https://delaf.click", {
            auth: {
                user_id: user._id,
                serverOffset: 0,
            },
        });
        setUserData(user);
    };

    useEffect(() => {
        fetch().then(() => socket.on("user chat", receiveMessage));

        return () => {
            socket.off("user chat", receiveMessage);
        };
    }, []);

    useEffect(() => {
        if (messages.length == 0) return;
        flashlist.current.scrollToEnd();
    }, [messages]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={70}
            >
                <View style={styles.entireView}>
                    <View style={styles.flatlist}>
                        <FlashList
                            ref={flashlist}
                            estimatedItemSize={200}
                            data={messages}
                            keyExtractor={(_, index) => index.toString()}
                            renderItem={({ item }) => (
                                <UserMessageBubble
                                    item={item}
                                    userData={userData}
                                />
                            )}
                            contentContainerStyle={{
                                paddingHorizontal: 10,
                                paddingVertical: 10,
                            }}
                            automaticallyAdjustKeyboardInsets
                        />
                    </View>
                    <View>
                        <View style={styles.bottomContainer}>
                            <TextInput
                                placeholder="Mensaje"
                                value={message}
                                onChangeText={setMessage}
                                style={styles.input}
                            />
                            <TouchableOpacity
                                onPress={handleSubmit}
                                style={styles.buttonContainer}
                            >
                                <Ionicons name="send" size={30} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push("/chat/global");
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
                                        style={{ fontSize: 24, color: "white", fontFamily: font }}
                                    >
                                        G
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
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
        height: 100 * vh - 7 * vh - 40 - 40 - 21,
        width: "100%",
        marginBottom: 5,
        backgroundColor: "#f6f6f6",
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        width: 100 * vw,
        paddinBottom: 10,
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
