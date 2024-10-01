import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    Text,
    View,
} from "react-native";
import getData from "../../utils/AsyncStorage/getData";
import { LineChart, BarChart } from "react-native-chart-kit";
import { vh, vw } from "../../styles/dimensions/dimensions";
import SelectDropdown from "react-native-select-dropdown";
import getActivities from "../../utils/api/get/getActivities";
import months from "../../utils/constants/months";
import {
    getLastSixMonths,
    getLastTwelveMonths,
} from "../../utils/functions/getMonths";
import getBackDate from "../../utils/functions/getBackDate";
import getSortedWeekdays from "../../utils/functions/getSortedDays";
import LoadingSpinner from "../../components/LoadingSpinner";
import activitiesVariables from "../../utils/constants/activitiesVariables";
import averageStats from "../../utils/functions/averageStats";
import useCustomFonts from "../../hooks/useCustomFonts";
import AppLoading from "../../components/AppLoading";
import zoneGraphData from "../../utils/functions/zoneGraphData";
import activityTypes from "../../utils/constants/activityTypes";

export default function Stats() {
    const [user, setUser] = useState({});
    const [activities, setActivities] = useState([]);
    const [axisX, setAxisX] = useState([]);
    const [filter, setFilter] = useState("Semanal");
    const [typeFilter, setTypeFilter] = useState("Todos");
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    const [loaded, error, font] = useCustomFonts();

    const fetch = async () => {
        const userData = await getData("user");
        setUser(userData);
        const userActivities = await getActivities(userData._id);
        setActivities(userActivities);
        if (isFirstLoad) setFilteredActivities(userActivities.slice(-7));
        setIsFirstLoad(false);
        setIsLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            fetch();
        }, [])
    );

    useEffect(() => {
        filterByDate();
        filterByType();
    }, [filter, typeFilter]);

    const filterByType = () => {
        if (typeFilter == "running")
            setFilteredActivities((curr) =>
                curr.filter((item) => item.activity_type == "running")
            );
        if (typeFilter == "bike")
            setFilteredActivities((curr) =>
                curr.filter((item) => item.activity_type == "bike")
            );
        if (typeFilter == "elliptical")
            setFilteredActivities((curr) =>
                curr.filter((item) => item.activity_type == "elliptical")
            );
        if (typeFilter == "cardio")
            setFilteredActivities((curr) =>
                curr.filter((item) => item.activity_type == "cardio")
            );
        if (typeFilter == "functional")
            setFilteredActivities((curr) =>
                curr.filter((item) => item.activity_type == "functional")
            );
    };

    const filterByDate = () => {
        let timestampToFilter;
        if (filter == "Semanal") {
            timestampToFilter = 7;
            setAxisX(getSortedWeekdays());
            setFilteredActivities(activities.slice(-timestampToFilter));
        }
        if (filter == "Mensual") {
            timestampToFilter = 31;
            setAxisX([
                getBackDate(30).split("/")[0],
                getBackDate(25).split("/")[0],
                getBackDate(20).split("/")[0],
                getBackDate(15).split("/")[0],
                getBackDate(10).split("/")[0],
                getBackDate(5).split("/")[0],
                getBackDate(0).split("/")[0],
            ]);
            setFilteredActivities(activities.slice(-timestampToFilter));
        }
        if (filter == "Semestral") {
            timestampToFilter = 186;
            setAxisX(getLastSixMonths);
            setFilteredActivities(
                averageStats(activities.slice(-timestampToFilter), 6)
            );
        }
        if (filter == "Anual") {
            timestampToFilter = 365;
            setAxisX(getLastTwelveMonths);
            setFilteredActivities(
                averageStats(activities.slice(-timestampToFilter), 12)
            );
        }
    };

    if (!loaded || error) return <AppLoading />;

    return (
        <View
            style={{
                alignItems: "center",
                backgroundColor: "#000",
                paddingVertical: 10,
            }}
        >
            <View
                style={{
                    width: "100%",
                    height: 50,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-around",
                    paddingRight: 15,
                    paddingVertical: 5,
                    borderBottomColor: "#f6f6f6",
                    borderBottomWidth: 1,
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <SelectDropdown
                        buttonStyle={{
                            borderRadius: 10,
                            width: 120,
                            height: 35,
                        }}
                        defaultButtonText={
                            typeFilter == "" ? "Seleccionalo" : typeFilter
                        }
                        data={Object.keys(activityTypes)}
                        onSelect={(selected) => {
                            setTypeFilter(activityTypes[selected]);
                        }}
                    />
                </View>
                <Text
                    adjustsFontSizeToFit={true}
                    style={{
                        color: "#f6f6f6",
                        fontSize: 20,
                        fontFamily: font,
                    }}
                >
                    Filtros
                </Text>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                    }}
                >
                    <SelectDropdown
                        buttonStyle={{
                            borderRadius: 10,
                            width: 120,
                            height: 35,
                        }}
                        defaultButtonText={
                            filter == "" ? "Seleccionalo" : filter
                        }
                        data={["Semanal", "Mensual", "Semestral", "Anual"]}
                        onSelect={(selected) => setFilter(selected)}
                    />
                </View>
            </View>
            {isLoading ? (
                <View
                    style={{
                        height: 100 * vh - 22 * vh,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <ActivityIndicator
                        style={{
                            transform: "scale(2)",
                        }}
                        size={"large"}
                        color={"#f6f6f6"}
                    />
                </View>
            ) : (
                <View
                    style={{
                        height: 100 * vh - 22 * vh - 5,
                    }}
                >
                    <ScrollView>
                        {filteredActivities.length > 0 ? (
                            <View>
                                {/* Frecuencia cardíaca */}
                                {filteredActivities
                                    .map((item) => item.average_heart_rate)
                                    .every((item) => item) && (
                                    <PointGraph
                                        axisX={axisX}
                                        axisY={filteredActivities.map(
                                            (item) => item.average_heart_rate
                                        )}
                                        measureType={"bpm"}
                                        title={"Frecuencia cardíaca"}
                                        font={font}
                                    />
                                )}
                                {/* Distancia */}
                                {filteredActivities
                                    .map((item) => item.distance)
                                    .every((item) => item) && (
                                    <PointGraph
                                        axisX={axisX}
                                        axisY={filteredActivities.map(
                                            (item) => item.distance
                                        )}
                                        measureType={"km"}
                                        title={"Distancias"}
                                        font={font}
                                    />
                                )}
                                {/* Cadencia */}
                                {filteredActivities
                                    .map((item) => item.average_cadence)
                                    .every((item) => item) && (
                                    <PointGraph
                                        axisX={axisX}
                                        axisY={filteredActivities.map(
                                            (item) => item.average_cadence
                                        )}
                                        measureType={""}
                                        title={"Cadencia"}
                                        font={font}
                                    />
                                )}
                                {/* Calorias */}
                                {filteredActivities
                                    .map((item) => item.calories)
                                    .every((item) => item) && (
                                    <PointGraph
                                        axisX={axisX}
                                        axisY={filteredActivities.map(
                                            (item) => item.calories
                                        )}
                                        measureType={"kcal"}
                                        title={"Calorias"}
                                        font={font}
                                    />
                                )}
                                {/* Tiempo total */}
                                {filteredActivities
                                    .map((item) => item.total_time)
                                    .every((item) => item) && (
                                    <PointGraph
                                        axisX={axisX}
                                        axisY={filteredActivities.map(
                                            (item) => item.total_time
                                        )}
                                        measureType={"min"}
                                        title={"Tiempo total"}
                                        font={font}
                                    />
                                )}
                                {filteredActivities
                                    .map((item) => item.average_heart_rate)
                                    .every((item) => item) && (
                                    <ZoneGraph
                                        axisX={[
                                            "Zona 1",
                                            "Zona 2",
                                            "Zona 3",
                                            "Zona 4",
                                            "Zona 5",
                                        ]}
                                        axisY={filteredActivities}
                                        measureType={"Zona"}
                                        title={"Tiempo en zonas"}
                                        font={font}
                                        userAge={user.age}
                                    />
                                )}
                            </View>
                        ) : (
                            <View
                                style={{
                                    height: 100 * vh - 22 * vh - 5,
                                    justifyContent: "center",
                                }}
                            >
                                <Text
                                    adjustsFontSizeToFit={true}
                                    style={{
                                        fontSize: 24,
                                        textAlign: "center",
                                        color: "#f6f6f6",
                                        fontFamily: font,
                                    }}
                                >
                                    Aún no tienes actividades en nuestra base de
                                    datos
                                </Text>
                            </View>
                        )}
                    </ScrollView>
                </View>
            )}
        </View>
    );
}

const PointGraph = function ({ axisX, axisY, measureType, title, font }) {
    return (
        <View
            style={{
                marginVertical: 10,
                paddingHorizontal: 5,
                marginHorizontal: 5,
                borderRadius: 15,
                paddingTop: 5,
                borderWidth: 1,
                borderColor: "#f6f6f6",
            }}
        >
            <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                    adjustsFontSizeToFit={true}
                    style={{
                        fontSize: 12,
                        textAlign: "center",
                        color: "#f6f6f6",
                        borderBottomColor: "#f6f6f6",
                        borderBottomWidth: 1,
                        paddingHorizontal: 5 * vw,
                        fontFamily: font,
                    }}
                >
                    {title}
                </Text>
            </View>
            {axisX.length > 0 && axisY.length > 0 && (
                <LineChart
                    data={{
                        labels: axisX,
                        datasets: [
                            {
                                data: axisY,
                                strokeWidth: 1,
                            },
                        ],
                    }}
                    width={Dimensions.get("window").width - 20} // from react-native
                    height={250}
                    yAxisLabel=""
                    yAxisSuffix={` ${measureType}`}
                    yLabelsOffset={5}
                    yAxisInterval={10} // optional, defaults to 1
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    xLabelsOffset={-2}
                    chartConfig={{
                        backgroundGradientFrom: "#000",
                        backgroundGradientTo: "#000",
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `#f6f6f6`,
                        labelColor: (opacity = 1) => `#f6f6f6`,
                        propsForDots: {
                            r: "1",
                            strokeWidth: "3",
                            stroke: "#f6f6f6",
                        },
                    }}
                    segments={5}
                    bezier
                    style={{
                        marginVertical: 8,
                        borderRadius: 15,
                    }}
                />
            )}
        </View>
    );
};

const ZoneGraph = function ({ axisX, axisY, title, font, userAge }) {
    return (
        <View
            style={{
                marginVertical: 10,
                paddingHorizontal: 5,
                marginHorizontal: 5,
                borderRadius: 15,
                paddingTop: 5,
                borderWidth: 1,
                borderColor: "#f6f6f6",
            }}
        >
            <View style={{ width: "100%", alignItems: "center" }}>
                <Text
                    adjustsFontSizeToFit={true}
                    style={{
                        fontSize: 12,
                        textAlign: "center",
                        color: "#f6f6f6",
                        borderBottomColor: "#f6f6f6",
                        borderBottomWidth: 1,
                        paddingHorizontal: 5 * vw,
                        fontFamily: font,
                    }}
                >
                    {title}
                </Text>
            </View>
            {axisX.length > 0 && axisY.length > 0 && (
                <BarChart
                    data={{
                        labels: axisX,
                        datasets: [
                            {
                                data: zoneGraphData(axisY, userAge),
                                strokeWidth: 1,
                            },
                        ],
                    }}
                    width={Dimensions.get("window").width - 20} // from react-native
                    height={250}
                    yAxisSuffix=" min"
                    yLabelsOffset={5}
                    yAxisInterval={10} // optional, defaults to 1
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    withInnerLines={false}
                    xLabelsOffset={-2}
                    chartConfig={{
                        backgroundGradientFrom: "#000",
                        backgroundGradientTo: "#000",
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `#f6f6f6`,
                        labelColor: (opacity = 1) => `#f6f6f6`,
                        propsForDots: {
                            r: "1",
                            strokeWidth: "3",
                            stroke: "#f6f6f6",
                        },
                    }}
                    segments={4}
                    fromNumber={5}
                    style={{
                        marginVertical: 8,
                        borderRadius: 15,
                    }}
                />
            )}
        </View>
    );
};
