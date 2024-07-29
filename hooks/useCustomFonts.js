import { useFonts } from "expo-font";

export default useCustomFonts = () => {
    const [loaded, error] = useFonts({
        IBMPlexSansJP: require("../assets/fonts/IBMPlexSansJP_400Regular.ttf"),
    });
    const font = "IBMPlexSansJP";
    return [loaded, error, font];
};
