import { StyleSheet } from "react-native";
import vp from "./dimensions/dimensions";
import { Dimensions } from "react-native";
const vw = Dimensions.get('window').width / 100
const vh = Dimensions.get('window').height / 100

const ICONS_SIZE = 8*vw

const style = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    height: 7*vh,
    maxHeight: 7*vh,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 5
  },
  iconContainer:{
    width: '20%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icons: {
    color: '#f6f6f6',
  }
})

export { style, ICONS_SIZE }
