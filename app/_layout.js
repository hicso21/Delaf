import { StripeProvider, useStripe } from "@stripe/stripe-react-native";
import { Slot, usePathname } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    BackHandler,
    Linking,
    LogBox,
    SafeAreaView,
    Text,
    View,
    StatusBar,
} from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { Drawer } from "../components/Drawer.js";
import FooterNavigator from "../components/FooterNavigator";
import OpenedDrawer from "../components/OpenedDrawer.js";
import { store } from "../store/index.js";
import styles from "../styles/Views/Layout.js";
import routes from "../utils/constants/routes.js";
import { usePreventScreenCapture } from "expo-screen-capture";
import { SafeAreaProvider } from "react-native-safe-area-context";
import getPbKeyStripe from "../utils/api/get/getPbKeyStripe.js";
import * as SplashScreen from "expo-splash-screen";
import Constants from "expo-constants";
import { vh } from "../styles/dimensions/dimensions.js";
import Font from "expo-font";

const pathToExclude = [
    "/login",
    "/register",
    "/prices",
    "/marchView",
    "/redirect",
    "/recovery",
];

LogBox.ignoreLogs(["new NativeEventEmitter"]);
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    // const [publishableKey, setPublishableKey] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const path = usePathname();
    usePreventScreenCapture();

    const fetch = async () => {
        Font.loadAsync({
            IBMPlexSansJP: require("../assets/fonts/IBMPlexSansJP_400Regular.ttf"),
        })
            .then(() => {
                console.log("Carga terminada");
                setIsLoading(false);
            })
            .catch(() => {
                console.log("Ocurrió un problema");
            });
    };

    /* Stripe */
    const { handleURLCallback } = useStripe();
    const handleDeepLink = useCallback(
        async (url) => {
            if (url) {
                const stripeHandled = await handleURLCallback(url);
                if (stripeHandled) {
                    // This was a Stripe URL - you can return or add extra handling here as you see fit
                } else {
                    // This was NOT a Stripe URL – handle as you normally would
                }
            }
        },
        [handleURLCallback]
    );
    const getUrlAsync = async () => {
        const initialUrl = await Linking.getInitialURL();
        handleDeepLink(initialUrl);
    };
    useEffect(() => {
        getUrlAsync();
        const deepLinkListener = Linking.addEventListener("url", (event) => {
            handleDeepLink(event.url);
        });
        return () => deepLinkListener.remove();
    }, [handleDeepLink]);

    useEffect(() => {
        if (!isLoading) {
            SplashScreen.hideAsync();
        }
    }, [isLoading]);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", () => true);
        fetch();
        // getPbKeyStripe().then(
        //     (res) => !res.error && setPublishableKey(res.data)
        // );
    }, []);

    if (isLoading) return null;

    return (
        <>
            <PaperProvider>
                <SafeAreaProvider>
                    <Provider store={store}>
                        {/* <StripeProvider
                            publishableKey={publishableKey}
                            merchantIdentifier="merchant.com.delaf"
                        > */}
                        <StatusBar
                            barStyle={"light-content"}
                            backgroundColor={"#000"}
                        />
                        <Drawer
                            drawerContent={OpenedDrawer}
                            backBehavior="none"
                            defaultStatus="closed"
                            screenOptions={{
                                headerTintColor: "#f6f6f6",
                                headerStyle: {
                                    height: 11 * vh,
                                    borderBottomWidth:
                                        11 * vh - Constants.statusBarHeight,
                                    borderBottomColor: "#000",
                                },
                                headerTitle: routes(path)
                                    ? routes(path)
                                    : "TU RUTINA DEL DÍA",
                                headerShown: pathToExclude.some((item) =>
                                    path.includes(item)
                                )
                                    ? false
                                    : true,
                                swipeEnabled: pathToExclude.some((item) =>
                                    path.includes(item)
                                )
                                    ? false
                                    : true,
                            }}
                        />
                        {!pathToExclude.some((item) => path.includes(item)) && (
                            <FooterNavigator />
                        )}
                        {/* </StripeProvider> */}
                    </Provider>
                </SafeAreaProvider>
            </PaperProvider>
            <Toast />
        </>
    );
}
