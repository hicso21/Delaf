import { View, Text, TextInput } from "react-native";
import style from "../styles/modalMessageSender";
import Modal from 'react-native-modal'

export default function ModalMessageSender({modalVisible, setModalVisible}) {
  return (
    <Modal
      style={style.modal}
      isVisible={modalVisible}
      animationIn='slideInUp'
      animationOut='slideOutUp'
      onBackButtonPress={() => {setModalVisible(!modalVisible)}}
    >
      <View style={style.container}>
        <Text adjustsFontSizeToFit={true}>Modal</Text>
        <TextInput></TextInput>
      </View>
    </Modal>
  )
}
