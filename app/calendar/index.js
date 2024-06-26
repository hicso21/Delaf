import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import { Card, Modal, Portal } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import estiramientos from '../../assets/estiramientos.mp4';
import movilidad_articular from '../../assets/movilidad_articular.mp4';
import tecnica_de_carrera from '../../assets/tecnica_de_carrera.mp4';
import { vw } from '../../styles/dimensions/dimensions';
import getData from '../../utils/AsyncStorage/getData';
import getUserEvents from '../../utils/api/get/getUserEvents';
import { spanishCalendar } from '../../utils/constants/calendarLanguages';
import standarizeCalendarData from '../../utils/functions/standarizeCalendarData';
import toYYYYMMDD from '../../utils/functions/toYYYYMMDDFormat';

LocaleConfig.locales['es'] = spanishCalendar;
LocaleConfig.defaultLocale = 'es';

const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString()?.split('T')[0];
};

export default function Schedule() {
    const [selected, setSelected] = useState({
        dateString: timeToString(Date.now()),
        day: new Date().getDate(),
        month: new Date().getMonth(),
        timestamp: Date.now(),
        year: new Date().getFullYear(),
    });
    const [items, setItems] = useState({});
    const [currentDate] = useState(
        toYYYYMMDD(Date.now() - 1000 * 60 * 60 * 24 * 4)
    );
    const [videoModal, setVideoModal] = useState({
        open: false,
        content: estiramientos,
    });
    const [eventsModal, setEventsModal] = useState(false);
    const [eventModalData, setEventModalData] = useState([]);
    const [events, setEvents] = useState([]);

    const emptyDay = () => {
        return (
            <View
                style={{
                    width: '100%',
                    height: 'auto',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingRight: 10,
                    paddingLeft: 0,
                }}
            >
                <View
                    style={{
                        alignItems: 'center',
                        width: '18%',
                    }}
                >
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{
                            fontFamily: 'System',
                            color: '#7a92a5',
                            fontSize: 28,
                        }}
                    >
                        {selected?.day}
                    </Text>
                    <Text
                        adjustsFontSizeToFit={true}
                        style={{
                            fontFamily: 'System',
                            color: '#7a92a5',
                            fontSize: 14,
                        }}
                    >
                        {
                            new Date(selected?.dateString)
                                .toGMTString()
                                ?.split(',')[0]
                        }
                    </Text>
                </View>
                <View
                    style={{
                        height: 96,
                        width: `82%`,
                        marginTop: 20,
                        borderRadius: 5,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Text adjustsFontSizeToFit={true}>
                        Aún no tienes actividades para este día
                    </Text>
                </View>
            </View>
        );
    };

    const renderItem = (item) => {
        const handlePress = () => {
            const itemsFiltered = events.filter((event) =>
                event.start?.includes(item.date)
            );
            setEventModalData(itemsFiltered);
            setEventsModal(true);
        };

        return (
            <TouchableOpacity
                onPress={handlePress}
                style={{
                    marginRight: 10,
                    marginTop: 10,
                }}
            >
                <Card style={{ backgroundColor: '#0c0c0c' }}>
                    <Card.Content>
                        <View
                            style={{
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{ fontSize: 18, color: '#f6f6f6' }}
                            >
                                {item.routines > 0 &&
                                    `${item.routines} rutina${
                                        item.routines > 1 ? 's' : ''
                                    }`}
                                {item.nutrition > 0
                                    ? `${item.races > 0 ? ', ' : ' y '}${
                                          item.nutrition
                                      } nutrición${
                                          item.nutrition > 1 ? 's' : ''
                                      }`
                                    : ''}
                                {item.races > 0
                                    ? `, ${item.races} carrera${
                                          item.races > 1 ? 's' : ''
                                      }`
                                    : ''}
                            </Text>
                            <View
                                style={{
                                    backgroundColor: item.completed
                                        ? '#2b9348'
                                        : '#000',
                                    borderColor: '#f6f6f6',
                                    borderWidth: 1,
                                    height: 50,
                                    width: 50,
                                    borderRadius: 50,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                {item.type == 'routine' && (
                                    <MaterialCommunityIcons
                                        name="dumbbell"
                                        size={24}
                                        color="#f6f6f6"
                                    />
                                )}
                                {item.type == 'nutrition' && (
                                    <MaterialCommunityIcons
                                        name="food-apple"
                                        size={24}
                                        color="#f6f6f6"
                                    />
                                )}
                                {item.type == 'race' && (
                                    <FontAwesome
                                        name="flag-checkered"
                                        size={24}
                                        color="#f6f6f6"
                                    />
                                )}
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        );
    };

    const fetch = async () => {
        const user = await getData('user');
        const data = await getUserEvents(user._id);
        setEvents(data?.data);
        if (data?.error)
            return Toast.show({
                type: 'error',
                text1: 'Ocurrió un error en el servidor.',
                text2: 'Por favor contactese con nostros.',
            });
        const events = standarizeCalendarData(data?.data);
        setItems(events);
    };

    useFocusEffect(
        useCallback(() => {
            fetch();
        }, [])
    );

    return (
        <>
            <Portal>
                <Modal
                    visible={videoModal.open}
                    onDismiss={() => {
                        setVideoModal({
                            open: false,
                            content: videoModal.content,
                        });
                    }}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            maxWidth: 90 * vw,
                            marginHorizontal: 5 * vw,
                        }}
                    >
                        <Video
                            // onLoadStart={() => {
                            // 	// start loading
                            // 	setOpen(true);
                            // }}
                            // onLoad={() => {
                            // 	// finish load
                            // 	setOpen(false);
                            // }}
                            style={{
                                width: '100%',
                                height: 'auto',
                                aspectRatio: 16 / 28,
                                backgroundColor: '#000',
                            }}
                            source={videoModal.content}
                            resizeMode={ResizeMode.CONTAIN}
                            useNativeControls
                        />
                    </View>
                </Modal>
                <Modal
                    visible={eventsModal}
                    onDismiss={() => setEventsModal(false)}
                >
                    <View
                        style={{
                            backgroundColor: 'white',
                            maxWidth: 90 * vw,
                            marginHorizontal: 5 * vw,
                            padding: 20,
                            borderRadius: 15,
                            gap: 20,
                        }}
                    >
                        {eventModalData.map((event) => {
                            const onPress = () => {
                                if (event?.type == 'routine')
                                    router.push(`/routines/${event?._id}`);
                                if (event?.type == 'nutrition')
                                    router.push(`/nutrition/${event?._id}`);
                                if (event?.type == 'race') {
                                }
                                setEventsModal(false);
                            };

                            return (
                                <TouchableOpacity onPress={onPress}>
                                    <Card
                                        style={{ backgroundColor: '#0c0c0c' }}
                                    >
                                        <Card.Content>
                                            <View
                                                style={{
                                                    flexDirection: 'row',
                                                    justifyContent:
                                                        'space-between',
                                                    alignItems: 'center',
                                                }}
                                            >
                                                <Text
                                                    adjustsFontSizeToFit={true}
                                                    style={{
                                                        fontSize: 18,
                                                        color: '#f6f6f6',
                                                    }}
                                                >
                                                    {event?.title}
                                                </Text>
                                                <View
                                                    style={{
                                                        backgroundColor:
                                                            event.completed
                                                                ? '#2b9348'
                                                                : '#000',
                                                        borderColor: '#f6f6f6',
                                                        borderWidth: 1,
                                                        height: 50,
                                                        width: 50,
                                                        borderRadius: 50,
                                                        display: 'flex',
                                                        justifyContent:
                                                            'center',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    {event.type ==
                                                        'routine' && (
                                                        <MaterialCommunityIcons
                                                            name="dumbbell"
                                                            size={24}
                                                            color="#f6f6f6"
                                                        />
                                                    )}
                                                    {event.type ==
                                                        'nutrition' && (
                                                        <MaterialCommunityIcons
                                                            name="food-apple"
                                                            size={24}
                                                            color="#f6f6f6"
                                                        />
                                                    )}
                                                    {event.type == 'race' && (
                                                        <FontAwesome
                                                            name="flag-checkered"
                                                            size={24}
                                                            color="#f6f6f6"
                                                        />
                                                    )}
                                                </View>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                </Modal>
            </Portal>
            <View style={{ flex: 1 }}>
                <View
                    style={{
                        height: 30,
                        overflow: 'scroll',
                        flexDirection: 'row',
                        width: 100 * vw,
                        justifyContent: 'space-around',
                        alignItems: 'center',
                    }}
                >
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: '#000',
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            borderRadius: 15,
                        }}
                        onPress={() => {
                            setVideoModal({
                                open: true,
                                content: estiramientos,
                            });
                        }}
                    >
                        <Text adjustsFontSizeToFit={true}>Estiramientos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: '#000',
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            borderRadius: 15,
                        }}
                        onPress={() => {
                            setVideoModal({
                                open: true,
                                content: movilidad_articular,
                            });
                        }}
                    >
                        <Text adjustsFontSizeToFit={true}>
                            Movilidad articular
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            borderWidth: 1,
                            borderColor: '#000',
                            paddingHorizontal: 5,
                            paddingVertical: 2,
                            borderRadius: 15,
                        }}
                        onPress={() => {
                            setVideoModal({
                                open: true,
                                content: tecnica_de_carrera,
                            });
                        }}
                    >
                        <Text adjustsFontSizeToFit={true}>
                            Tecnica de carrera
                        </Text>
                    </TouchableOpacity>
                </View>
                <Agenda
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                    items={items}
                    pastScrollRange={4}
                    minDate={currentDate}
                    renderItem={renderItem}
                    renderEmptyData={emptyDay}
                    onDayPress={(day) => setSelected(day)}
                    // hideKnob={true}
                    // theme={{
                    // 	backgroundColor: 'red',
                    // }}
                    // loadItemsForMonth={loadItems}
                />
            </View>
        </>
    );
}
