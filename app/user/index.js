import { Text, View } from "react-native";

export default function User() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text adjustsFontSizeToFit={true}>user</Text>
    </View>
  );
}