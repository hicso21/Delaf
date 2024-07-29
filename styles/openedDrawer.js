import { StyleSheet } from "react-native";
import vp, { vh, vw } from "./dimensions/dimensions";
import Constants from "expo-constants";

const ARROW_SIZE = 7 * vp;

const style = StyleSheet.create({
    drawer: {
        height: "100%",
    },
    dataContainer: {
        backgroundColor: "#000",
        height: "100%",
        display: "flex",
        flexDirection: "column",
    },
    profile: {
        height: "auto",
        display: "flex",
        flexDirection: "row",
        gap: 5 * vp,
        paddingLeft: 3 * vp,
    },
    imgContainer: {
        width: "25%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    img: {
        width: 35 * vp,
        height: 35 * vp,
        resizeMode: "cover",
        borderRadius: 500,
    },
    profileInfo: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-evenly",
        overflow: "hidden",
    },
    name: {
        color: "#f6f6f6",
        fontSize: 10 * vp,
    },
    location: {
        color: "#f6f6f6",
        fontSize: 7 * vp,
        fontFamily: "IBMPlexSansJP",
    },
    separatorContainer: {
        width: "100%",
        height: 4 * vp,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 5 * vp,
    },
    separator: {
        height: 1,
        backgroundColor: "#f6f6f6",
        width: "75%",
        marginTop: 8,
    },
    ul: {
        height: "auto",
        backgroundColor: "#000",
        display: "flex",
        flexDirection: "column",
        padding: 4 * vp,
        gap: 6 * vp,
    },
    li: {
        backgroundColor: "#000",
        borderRadius: 1.8 * vp,
        height: 20 * vp,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 5 * vw,
        borderStyle: "solid",
        borderWidth: 0.2 * vp,
        borderColor: "#f6f6f6",
    },
    liContent: {
        color: "#f6f6f6",
        fontFamily: "IBMPlexSansJP",
    },
    contact: {
        marginTop: "auto",
    },
    contactText: {
        color: "#f6f6f6",
        fontFamily: "IBMPlexSansJP",
    },
});

export { style, ARROW_SIZE };
