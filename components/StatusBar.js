import { View } from "react-native";
import Constants from "expo-constants";

export default function StatusBar () {
  return (
    <View
      style={{
        height: Constants.statusBarHeight,
        backgroundColor: '#000'
      }}
    />
  )
}