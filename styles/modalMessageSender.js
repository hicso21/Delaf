import { Dimensions, StyleSheet } from "react-native";

const vw = Dimensions.get('window').width / 100
const vh = Dimensions.get('window').height / 100

const style = StyleSheet.create({
  modal: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  container: {
    backgroundColor: '#f6f6f6',
    height: '40%',
    width: '85%',
    borderRadius: 5*vw,
  }
})

export default style