import { Text, View } from "react-native";
import useCustomFonts from "../../hooks/useCustomFonts";
import AppLoading from "../../components/AppLoading";

export default function User() {
  const [loaded, error, font] = useCustomFonts();

  if (!loaded || error) return <AppLoading />;
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text adjustsFontSizeToFit={true}>user</Text>
    </View>
  );
}