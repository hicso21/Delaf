import React from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AppLoading() {
    return (
        <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
            <View style={{ gap: 20 }}>
                <ActivityIndicator
                    style={{
                        transform: "scale(2)",
                    }}
                    size={"large"}
                    color={"#000"}
                />
            </View>
        </View>
    );
}
