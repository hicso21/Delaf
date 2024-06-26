import { View, Text, Alert, ScrollView } from "react-native";
import React, { useCallback, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import getUserEvent from "../../../utils/api/get/getUserEvent";
import { vh } from "../../../styles/dimensions/dimensions";
import { Surface } from "react-native-paper";

export default function Nutrition() {
    const [texts, setTexts] = useState([]);
    const [date, setDate] = useState("");
    const { id: event_id } = useLocalSearchParams();

    const parseText = (text) => {
        const paragraphs = text.split("\n");
        const result = paragraphs.map((paragraph) => {
            const boldDivide = paragraph.trim().split("*");
            return boldDivide.map((word, index) => {
                if (!word) return;
                if (index % 2) {
                    return (
                        <Text
                            key={word}
                            style={{
                                fontWeight: "bold",
                                maxWidth: "100%",
                                marginTop: 5,
                                color: "#fff",
                                textDecorationLine: "underline",
                            }}
                        >
                            {word}
                        </Text>
                    );
                }
                return (
                    <Text
                        style={{
                            maxWidth: "100%",
                            paddingTop: 2,
                            color: "#fff",
                        }}
                        key={word}
                    >{`- ${word}`}</Text>
                );
            });
        });
        const fixedBreakLine = result.map((paragraph, index) => {
            if (paragraph.length == 1 && paragraph[0] == undefined) {
                return <Text key={index}>{"\n"}</Text>;
            } else return paragraph;
        });
        return fixedBreakLine;
    };

    const fetch = async () => {
        const nutrition = await getUserEvent(event_id);
        setTexts(parseText(nutrition.data.resource.text));
        console.log(nutrition.data.start);
        setDate(nutrition.data.start);
    };

    useFocusEffect(
        useCallback(() => {
            fetch();
        }, [])
    );

    return (
        <View style={{ flex: 1, justifyContent: "space-between", padding: 10 }}>
            <Text
                style={{
                    color: "#000",
                    fontSize: 20,
                    marginLeft: 'auto'
                }}
            >
                {new Date(date).toLocaleDateString()}
            </Text>
            <Surface
                style={{
                    display: "flex",
                    flexDirection: "column",
                    flexWrap: "wrap",
                    paddingHorizontal: 20,
                    paddingTop: 20,
                    paddingBottom: 30,
                    maxheight: 70 * vh,
                    borderRadius: 15,
                }}
                theme={{ colors: { surface: "#000" } }}
                elevation={5}
            >
                <ScrollView style={{ maxHeight: 70 * vh }}>
                    {texts?.map((paragraphs) => {
                        return !Array.isArray(paragraphs) ? (
                            <Text style={{ color: "transparent" }}>
                                {"breakline"}
                            </Text>
                        ) : (
                            paragraphs
                        );
                    })}
                    
                </ScrollView>
            </Surface>
            <View />
            <View />
        </View>
    );
}
