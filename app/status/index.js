import { Text, View } from "react-native";

export default function Status() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text adjustsFontSizeToFit={true}>Status</Text>
    </View>
  );
}