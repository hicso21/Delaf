import { View, Text, TextInput } from "react-native";
import style from "../styles/modalMessageSender";
import Modal from "react-native-modal";
import useCustomFonts from "../hooks/useCustomFonts";
import AppLoading from "./AppLoading";

export default function ModalMessageSender({ modalVisible, setModalVisible }) {
    const [loaded, error, font] = useCustomFonts();

    if (!loaded || error) return <AppLoading />;

    return (
        <Modal
            style={style.modal}
            isVisible={modalVisible}
            animationIn="slideInUp"
            animationOut="slideOutUp"
            onBackButtonPress={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={style.container}>
                <Text adjustsFontSizeToFit={true} style={{ fontFamily: font }}>
                    Modal
                </Text>
                <TextInput></TextInput>
            </View>
        </Modal>
    );
}
