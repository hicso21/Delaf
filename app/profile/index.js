import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import SelectDropdown from 'react-native-select-dropdown';
import Toast from 'react-native-toast-message';
import StatusBar from '../../components/StatusBar';
import { vh, vw } from '../../styles/dimensions/dimensions';
import getData from '../../utils/AsyncStorage/getData';
import getUserData from '../../utils/api/get/getUserData';
import updateRunner from '../../utils/api/put/updateRunner';
import countries from '../../utils/constants/countries';
import compareTwoObjects from '../../utils/functions/compareTwoObjects';

export default function Profile() {
    const [userData, setUserData] = useState({});
    const [dbUserData, setDbUserData] = useState({});
    const [id, setId] = useState('');
    const [modal, setModal] = useState(false);

    const showModal = () => setModal(true);
    const hideModal = () => setModal(false);

    const fetch = async () => {
        const user = await getData('user');
        setId(user._id);
        const { data: userDataAPI, error: userDataError } = await getUserData(
            user._id
        );
        setUserData({
            name: userDataAPI.data.name,
            email: userDataAPI.data.email,
            weight: userDataAPI.data.weight,
            height: userDataAPI.data.height,
            country: userDataAPI.data.country,
            city: userDataAPI.data.city,
        });
        setDbUserData({
            name: userDataAPI.data.name,
            email: userDataAPI.data.email,
            weight: userDataAPI.data.weight,
            height: userDataAPI.data.height,
            country: userDataAPI.data.country,
            city: userDataAPI.data.city,
        });
    };

    const handleUpdate = async () => {
        const condition = compareTwoObjects(userData, dbUserData);
        if (condition === false)
            return Toast.show({
                type: 'info',
                text1: 'No se cambió ningún dato',
            });
        console.log(userData);
        const res = await updateRunner(id, userData);
        console.log(res)
        if (!res.error)
            Toast.show({
                type: 'success',
                text1: 'Se cambiarón los datos correctamente',
            });
        else
            Toast.show({
                type: 'error',
                text1: 'Ocurrió un error en el servidor, intenta más tarde.',
            });
        hideModal();
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
                    visible={modal}
                    onDismiss={hideModal}
                    contentContainerStyle={{
                        backgroundColor: 'white',
                        padding: 20,
                        marginHorizontal: 30,
                        borderRadius: 10,
                    }}
                >
                    <Text style={{ textAlign: 'center', fontSize: 18 }}>
                        Estás seguro que quieres hacer estos cambios en tu
                        perfil?
                    </Text>
                    <View
                        style={{
                            width: 'auto',
                            justifyContent: 'center',
                            flexDirection: 'row',
                            paddingTop: 30,
                            paddingBottom: 10,
                            gap: 20,
                        }}
                    >
                        <TouchableOpacity onPress={hideModal}>
                            <View
                                style={{
                                    borderRadius: 5,
                                    borderColor: '#000',
                                    borderWidth: 1,
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                }}
                            >
                                <Text style={{ fontSize: 16, color: '#000' }}>
                                    Cancelar
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleUpdate}>
                            <View
                                style={{
                                    borderRadius: 5,
                                    borderColor: '#000',
                                    borderWidth: 1,
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    backgroundColor: '#000',
                                }}
                            >
                                <Text
                                    style={{ fontSize: 16, color: '#f6f6f6' }}
                                >
                                    Confirmar
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </Portal>
            <View
                style={{
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'black',
                }}
            >
                <StatusBar />
                <ScrollView>
                    <View style={styles.content}>
                        <View style={styles.inputContainer}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.text}
                            >
                                Nombre
                            </Text>
                            <TextInput
                                placeholder="Nombre"
                                // editable={false}
                                value={userData?.name}
                                onChangeText={(value) => {
                                    setUserData((curr) => {
                                        return { ...curr, name: value };
                                    });
                                }}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.text}
                            >
                                Email
                            </Text>
                            <TextInput
                                placeholder="Email"
                                editable={false}
                                value={userData?.email}
                                onChangeText={(value) => {
                                    setUserData((curr) => {
                                        return { ...curr, email: value };
                                    });
                                }}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.containerDouble}>
                                <View style={styles.inputDouble}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={styles.text}
                                    >
                                        País
                                    </Text>
                                    <SelectDropdown
                                        buttonStyle={styles.selectStyle}
                                        defaultButtonText={
                                            userData.country == ''
                                                ? 'Seleccionalo'
                                                : userData?.country
                                        }
                                        data={countries
                                            ?.map((item) => item.name)
                                            .sort()}
                                        onSelect={(selected) => {
                                            setUserData((curr) => {
                                                return {
                                                    ...curr,
                                                    country: selected,
                                                };
                                            });
                                        }}
                                    />
                                </View>
                                <View style={styles.inputDouble}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={styles.text}
                                    >
                                        Ciudad
                                    </Text>
                                    <TextInput
                                        placeholder="Ciudad"
                                        value={userData?.city}
                                        onChangeText={(value) => {
                                            setUserData((curr) => {
                                                return { ...curr, city: value };
                                            });
                                        }}
                                        style={styles.input}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.inputContainer}>
                            <View style={styles.containerDouble}>
                                <View style={styles.inputDouble}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={styles.text}
                                    >
                                        Peso (kg)
                                    </Text>
                                    <TextInput
                                        placeholder="Peso (kg)"
                                        keyboardType="number-pad"
                                        value={userData?.weight}
                                        onChangeText={(value) => {
                                            setUserData((curr) => {
                                                return {
                                                    ...curr,
                                                    weight: value,
                                                };
                                            });
                                        }}
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.inputDouble}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={styles.text}
                                    >
                                        Altura (cm)
                                    </Text>
                                    <TextInput
                                        placeholder="Altura (cm)"
                                        keyboardType="number-pad"
                                        value={userData?.height}
                                        onChangeText={(value) => {
                                            setUserData((curr) => {
                                                return {
                                                    ...curr,
                                                    height: value,
                                                };
                                            });
                                        }}
                                        style={styles.input}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            width: 'auto',
                            alignItems: 'center',
                            marginTop: 50,
                        }}
                    >
                        <TouchableOpacity onPress={showModal}>
                            <View
                                style={{
                                    borderRadius: 5,
                                    borderColor: '#f6f6f6',
                                    borderWidth: 1,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                }}
                            >
                                <Text
                                    style={{
                                        color: '#f6f6f6',
                                        fontSize: 18,
                                    }}
                                >
                                    Cambiar datos
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    modal: {
        height: 100 * vh,
        width: 100 * vw,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    modalContainer: {
        height: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 25,
        paddingHorizontal: 25,
        backgroundColor: '#f6f6f6',
        borderRadius: 5,
    },
    modalContent: {
        height: '100%',
        justifyContent: 'space-around',
    },
    view: {
        height: 100 * vh,
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    inputContainer: {
        width: 80 * vw,
        marginTop: 15,
    },
    switchContainer: {
        marginTop: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerDouble: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    inputDouble: {
        width: '45%',
    },
    switch: {
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#f6f6f6',
        height: 40,
        borderRadius: 5,
        fontSize: 18,
        paddingHorizontal: 8,
    },
    separator: {
        flex: 0.15,
    },
    selectStyle: {
        height: 40,
        width: '100%',
        borderRadius: 5,
        fontSize: 18,
        backgroundColor: '#f6f6f6',
    },
    viewButton: {
        width: '100%',
        borderRadius: 5,
        backgroundColor: '#f6f6f6',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    viewText: {
        fontSize: 18,
        color: '#000',
    },
    text: {
        fontSize: 14,
        color: '#f6f6f6',
        marginBottom: 5,
    },
    inverseText: {
        fontSize: 14,
        color: '#000',
        marginBottom: 5,
    },
    registerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
        gap: 5,
    },
    registerText: {
        color: '#f6f6f6',
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: 'center',
        paddingBottom: 10,
    },
});
