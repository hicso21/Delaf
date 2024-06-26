import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    ScrollView,
    Text,
    View,
} from 'react-native';
import getData from '../../utils/AsyncStorage/getData';
import { LineChart } from 'react-native-chart-kit';
import { vh, vw } from '../../styles/dimensions/dimensions';
import SelectDropdown from 'react-native-select-dropdown';
import getActivities from '../../utils/api/get/getActivities';
import months from '../../utils/constants/months';
import {
    getLastSixMonths,
    getLastTwelveMonths,
} from '../../utils/functions/getMonths';
import getBackDate from '../../utils/functions/getBackDate';
import getSortedWeekdays from '../../utils/functions/getSortedDays';
import LoadingSpinner from '../../components/LoadingSpinner';
import activitiesVariables from '../../utils/constants/activitiesVariables';
import averageStats from '../../utils/functions/averageStats';

export default function Stats() {
    const [user, setUser] = useState({});
    const [activities, setActivities] = useState([]);
    const [axisX, setAxisX] = useState([]);
    const [filter, setFilter] = useState('Semanal');
    const [filteredActivities, setFilteredActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const fetch = async () => {
        const userData = await getData('user');
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
        let timestampToFilter;
        if (filter == 'Semanal') {
            timestampToFilter = 7;
            setAxisX(getSortedWeekdays());
            setFilteredActivities(activities.slice(-timestampToFilter));
        }
        if (filter == 'Mensual') {
            timestampToFilter = 31;
            setAxisX([
                getBackDate(30).split('/')[0],
                getBackDate(25).split('/')[0],
                getBackDate(20).split('/')[0],
                getBackDate(15).split('/')[0],
                getBackDate(10).split('/')[0],
                getBackDate(5).split('/')[0],
                getBackDate(0).split('/')[0],
            ]);
            setFilteredActivities(activities.slice(-timestampToFilter));
        }
        if (filter == 'Semestral') {
            timestampToFilter = 186;
            setAxisX(getLastSixMonths);
            setFilteredActivities(
                averageStats(activities.slice(-timestampToFilter), 6)
            );
            console.log(averageStats(activities.slice(-timestampToFilter), 6));
        }
        if (filter == 'Anual') {
            timestampToFilter = 365;
            setAxisX(getLastTwelveMonths);
            setFilteredActivities(
                averageStats(activities.slice(-timestampToFilter), 12)
            );
        }
    }, [filter]);

    return (
        <View
            style={{
                alignItems: 'center',
                backgroundColor: '#000',
                paddingVertical: 10,
            }}
        >
            <View
                style={{
                    width: '100%',
                    height: 50,
                    alignItems: 'flex-end',
                    paddingRight: 15,
                    paddingVertical: 5,
                    borderBottomColor: '#f6f6f6',
                    borderBottomWidth: 1,
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                    }}
                >
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{ color: '#f6f6f6', fontSize: 20 }}
                    >
                        Filtro
                    </Text>
                    <SelectDropdown
                        buttonStyle={{
                            borderRadius: 10,
                            width: 100,
                            height: 35,
                        }}
                        defaultButtonText={
                            filter == '' ? 'Seleccionalo' : filter
                        }
                        data={['Semanal', 'Mensual', 'Semestral', 'Anual']}
                        onSelect={(selected) => setFilter(selected)}
                    />
                </View>
            </View>
            {isLoading ? (
                <View
                    style={{
                        height: 100 * vh - 22 * vh,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <ActivityIndicator
                        style={{
                            transform: 'scale(2)',
                        }}
                        size={'large'}
                        color={'#f6f6f6'}
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
                            activitiesVariables.map(
                                ({ name, variable, measure }, idx) =>
                                    filteredActivities.every(
                                        (item) => item[variable] != ''
                                    ) && (
                                        <Chart
                                            key={idx}
                                            axisX={axisX}
                                            axisY={filteredActivities.map(
                                                (item) => item[variable]
                                            )}
                                            measureType={measure}
                                            title={name}
                                        />
                                    )
                            )
                        ) : (
                            <View
                                style={{
                                    height: 100 * vh - 22 * vh - 5,
                                    justifyContent: 'center',
                                }}
                            >
                                <Text
                                    adjustsFontSizeToFit={true}
                                    style={{
                                        fontSize: 24,
                                        textAlign: 'center',
                                        color: '#f6f6f6',
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

const Chart = function ({ axisX, axisY, measureType, title }) {
    return (
        <View
            style={{
                marginVertical: 10,
                paddingHorizontal: 5,
                marginHorizontal: 5,
                borderRadius: 15,
                paddingTop: 5,
                borderWidth: 1,
                borderColor: '#f6f6f6',
            }}
        >
            <View style={{ width: '100%', alignItems: 'center' }}>
                <Text
                    adjustsFontSizeToFit={true}
                    style={{
                        fontSize: 12,
                        textAlign: 'center',
                        color: '#f6f6f6',
                        borderBottomColor: '#f6f6f6',
                        borderBottomWidth: 1,
                        paddingHorizontal: 5 * vw,
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
                    width={Dimensions.get('window').width - 20} // from react-native
                    height={250}
                    yAxisLabel=""
                    yAxisSuffix={` ${measureType}`}
                    yLabelsOffset={5}
                    yAxisInterval={10} // optional, defaults to 1
                    withVerticalLines={false}
                    withHorizontalLines={false}
                    xLabelsOffset={-2}
                    chartConfig={{
                        backgroundGradientFrom: '#000',
                        backgroundGradientTo: '#000',
                        decimalPlaces: 0, // optional, defaults to 2dp
                        color: (opacity = 1) => `#f6f6f6`,
                        labelColor: (opacity = 1) => `#f6f6f6`,
                        propsForDots: {
                            r: '1',
                            strokeWidth: '3',
                            stroke: '#f6f6f6',
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
