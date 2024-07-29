import { Text } from "react-native";
import AppLoading from "../../components/AppLoading";
import useCustomFonts from "../../hooks/useCustomFonts";

export default function Nutrition() {
  const [loaded, error, font] = useCustomFonts();

  if (!loaded || error) return <AppLoading />;
    return (
      <Text>nutrition</Text>
    )
  }
  