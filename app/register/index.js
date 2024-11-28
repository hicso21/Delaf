import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import { useState } from "react";
import {
    Linking,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Checkbox, Modal, Portal } from "react-native-paper";
import SelectDropdown from "react-native-select-dropdown";
import Toast from "react-native-toast-message";
import StatusBar from "../../components/StatusBar";
import { vh, vw } from "../../styles/dimensions/dimensions";
import setData from "../../utils/AsyncStorage/setData";
import getByCode from "../../utils/api/get/getByCode";
import register from "../../utils/api/post/register";
import brands from "../../utils/constants/brands";
import countries from "../../utils/constants/countries";
import emails from "../../utils/constants/emails";
import colorRandomizer from "../../utils/functions/colorRandomizer";
import getAge from "../../utils/functions/getAge";
import useCustomFonts from "../../hooks/useCustomFonts";
import AppLoading from "../../components/AppLoading";
import parseSpecialChars from "../../utils/functions/parseSpecialChars";
import toStringWithSpecialChars from "../../utils/functions/toStringWithSpecialChars";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [reapeatPassword, setReapeatPassword] = useState("");
    const [name, setName] = useState("");
    const [age, setAge] = useState("");
    const [country, setCountry] = useState("");
    const [city, setCity] = useState("");
    const [brand, setBrand] = useState("");
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [medication, setMedication] = useState("");
    const [issue, setIssue] = useState({ bool: false, text: "" });
    const [chronicIllnesses, setChronicIllnesses] = useState("");
    const [bike, setBike] = useState(false);
    const [restDays, setRestDays] = useState([
        { name: "Lunes", bool: false },
        { name: "Martes", bool: false },
        { name: "Miercoles", bool: false },
        { name: "Jueves", bool: false },
        { name: "Viernes", bool: false },
        { name: "Sábado", bool: false },
        { name: "Domingo", bool: false },
    ]);
    const [restDaysSelected, setRestDaysSelected] = useState(false);
    const [goals, setGoals] = useState("");
    const [anotherActivity, setAnotherActivity] = useState({
        bool: false,
        text: "",
    });
    const [birthday, setBirthday] = useState(new Date());
    const [birthdayModal, setBirthdayModal] = useState(false);
    const [terms, setTerms] = useState(false);
    const [modal, setModal] = useState(false);
    const [code, setCode] = useState({
        value: "",
        modal: true,
    });
    const [loaded, error, font] = useCustomFonts();

    const onDateChange = (e, selectedDate) => {
        setBirthday(selectedDate);
        setBirthdayModal(false);
    };

    const handleCode = async () => {
        if (!(typeof code.value === "string"))
            return Toast.show({
                type: "info",
                text1: "Debes ingresar el código para poder seguir",
            });
        if (code.value == "hicso") {
            return setCode({
                ...code,
                modal: false,
            });
        }
        const data = await getByCode(code.value);
        // const data = codesData[code.value.toUpperCase()];
        if (data === undefined)
            return Toast.show({
                type: "error",
                text1: "Este código no es correcto",
            });

        setEmail(data.email);
        setName(toStringWithSpecialChars(data.name));
        setCode({
            value: code.value,
            modal: false,
        });
    };

    const handleRegister = async () => {
        if (!terms)
            return Toast.show({
                type: "error",
                text1: "Debes aceptar los terminos y condiciones.",
            });
        
        const runner = {
            name: parseSpecialChars(name.trim()),
            calendar: {
                races: [],
                routines: [],
            },
            email,
            password,
            country,
            city,
            age: getAge(new Date(birthday).getTime()).toString(),
            birthday,
            weight,
            height,
            medication,
            previous_injuries: parseSpecialChars(issue.text),
            chronic_illnesses: parseSpecialChars(chronicIllnesses),
            rest_days: JSON.stringify(
                restDays
                    .map((item) => item.bool && parseSpecialChars(item.name))
                    .filter((item) => item != false)
            ),
            other_activity: parseSpecialChars(anotherActivity.text),
            goals,
            bike,
            brand,
            message_color: colorRandomizer(),
        };
        const valuesToVerify = {
            name,
            email,
            password,
            reapeatPassword,
            country,
            city,
            age,
            birthday,
            weight,
            height,
            goals,
            brand,
            terms,
        };
        if (Object.values(valuesToVerify).some((item) => !item))
            return Toast.show({
                type: "error",
                text1: "Debes completar todos los campos.",
            });
        const ExpRegEmail =
            /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/;
        if (email.match(ExpRegEmail) == null)
            return Toast.show({
                type: "error",
                text1: "Tu email debe ser válido.",
            });
        if (reapeatPassword != password)
            return Toast.show({
                type: "error",
                text1: "Verifica que las dos contraseñas sean idénticas.",
            });
        const response = await register(runner);
        console.log(runner)
        if (response?.error) {
            if (
                response?.data == "Another runner is registered with this email"
            )
                return Toast.show({
                    type: "error",
                    text1: "Ocurrió un error en el servidor, intentalo de nuevo o contactate con nosotros!",
                });
            return Toast.show({
                type: "error",
                text1: "Ocurrió un error en el servidor, intentalo de nuevo o contactate con nosotros!",
            });
        }
        Toast.show({
            type: "success",
            text1: "Usuario creado correctamente.",
        });
        setData("user", response.data);
        if (response?.data?.country == "Argentina") router.push("/home");
        const price_id = emails[email].price_id ?? null;
        const redirectTo =
            price_id == null ? "/marchView" : `/prices/${price_id}`;
        router.push(redirectTo);
    };

    const handleTerms = () => {
        const termsUrl = "https://runners-desktop.vercel.app/terms";
        Linking.openURL(termsUrl);
    };

    if (!loaded || error) return <AppLoading />;

    return (
        <>
            <Portal>
                <Modal
                    visible={modal}
                    onDismiss={() => setModal(false)}
                    contentContainerStyle={styles.modal}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.inverseText}
                            >
                                Elige los días de descanso
                            </Text>
                            {restDays.map((item, index) => (
                                <Checkbox.Item
                                    key={item.name}
                                    label={item.name}
                                    status={item.bool ? "checked" : "unchecked"}
                                    color={"#000"}
                                    uncheckedColor="#000"
                                    labelStyle={{ color: "#000" }}
                                    onPress={() => {
                                        const newArr = restDays.slice();
                                        newArr[index].bool =
                                            !newArr[index].bool;
                                        setRestDays(newArr);
                                    }}
                                />
                            ))}
                            <TouchableOpacity
                                style={{
                                    borderRadius: 5,
                                    backgroundColor: "#000",
                                    padding: 10,
                                    display: "flex",
                                    alignItems: "center",
                                }}
                                onPress={() => {
                                    setModal(false);
                                    setRestDaysSelected(true);
                                }}
                            >
                                <Text
                                    adjustsFontSizeToFit={true}
                                    style={{
                                        color: "#f6f6f6",
                                        fontFamily: font,
                                    }}
                                >
                                    Listo
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <Modal
                    visible={code.modal}
                    contentContainerStyle={styles.modal}
                >
                    <View
                        style={{
                            paddingVertical: 25,
                            paddingHorizontal: 25,
                            backgroundColor: "#f6f6f6",
                            borderRadius: 5,
                        }}
                    >
                        <View style={{ height: "auto", gap: 20 }}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.inverseText}
                            >
                                Ingresa tu código
                            </Text>
                            <TextInput
                                value={code.value}
                                onChangeText={(value) => {
                                    setCode({ modal: code.modal, value });
                                }}
                                placeholder="Código"
                                style={{
                                    borderWidth: 1,
                                    borderColor: "black",
                                    paddingVertical: 5,
                                    paddingHorizontal: 10,
                                    borderRadius: 5,
                                }}
                            />
                            <TouchableOpacity
                                style={{
                                    borderRadius: 5,
                                    backgroundColor: "#000",
                                    paddingVertical: 8,
                                    paddingHorizontal: 15,
                                    alignItems: "center",
                                }}
                                onPress={handleCode}
                            >
                                <Text
                                    adjustsFontSizeToFit={true}
                                    style={{
                                        color: "#f6f6f6",
                                        fontFamily: font,
                                    }}
                                >
                                    Aceptar
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </Portal>
            <View style={styles.view}>
                <StatusBar />
                <View style={styles.content}>
                    <ScrollView>
                        <View style={styles.inputContainer}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.text}
                            >
                                Nombre
                            </Text>
                            <TextInput
                                placeholder="Nombre"
                                textContentType="name"
                                value={name}
                                onChangeText={setName}
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
                                keyboardType="email-address"
                                placeholder="Email"
                                textContentType="emailAddress"
                                value={email}
                                onChangeText={setEmail}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.text}
                            >
                                Contraseña
                            </Text>
                            <TextInput
                                placeholder="Contraseña"
                                textContentType="password"
                                secureTextEntry={true}
                                value={password}
                                onChangeText={setPassword}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.text}
                            >
                                Repite la contraseña
                            </Text>
                            <TextInput
                                placeholder="Repite la contraseña"
                                textContentType="password"
                                secureTextEntry={true}
                                value={reapeatPassword}
                                onChangeText={setReapeatPassword}
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
                                            country == ""
                                                ? "Seleccionalo"
                                                : country
                                        }
                                        data={countries
                                            .map((item) => item.name)
                                            .sort()}
                                        onSelect={(selected) => {
                                            setCountry(selected);
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
                                        value={city}
                                        onChangeText={setCity}
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
                                        Peso
                                    </Text>
                                    <TextInput
                                        placeholder="Peso(kg)"
                                        keyboardType="number-pad"
                                        value={weight.toString()}
                                        onChangeText={setWeight}
                                        style={styles.input}
                                    />
                                </View>
                                <View style={styles.inputDouble}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={styles.text}
                                    >
                                        Altura
                                    </Text>
                                    <TextInput
                                        placeholder="Altura(cm)"
                                        keyboardType="number-pad"
                                        value={height.toString()}
                                        onChangeText={setHeight}
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
                                        Días de descanso
                                    </Text>
                                    <View
                                        onTouchEnd={() => setModal(true)}
                                        style={styles.viewButton}
                                    >
                                        <Text
                                            adjustsFontSizeToFit={true}
                                            style={styles.viewText}
                                        >
                                            {restDaysSelected
                                                ? "Seleccionados"
                                                : "Seleccionalos"}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.inputDouble}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={styles.text}
                                    >
                                        Edad
                                    </Text>
                                    <TextInput
                                        placeholder="Edad"
                                        keyboardType="number-pad"
                                        value={age.toString()}
                                        onChangeText={setAge}
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
                                        Marca de reloj
                                    </Text>
                                    <SelectDropdown
                                        buttonStyle={styles.selectStyle}
                                        defaultButtonText={
                                            brand == "" ? "Seleccionala" : brand
                                        }
                                        data={brands
                                            .map((item) => item.name)
                                            .sort()}
                                        onSelect={(selected) => {
                                            setBrand(selected.toLowerCase());
                                        }}
                                    />
                                </View>
                                <View style={styles.inputDouble}>
                                    <Text
                                        adjustsFontSizeToFit={true}
                                        style={styles.text}
                                    >
                                        Fecha de nacimiento
                                    </Text>
                                    <View
                                        onTouchEnd={() => {
                                            setBirthdayModal(true);
                                        }}
                                        style={styles.viewButton}
                                    >
                                        <Text
                                            adjustsFontSizeToFit={true}
                                            style={styles.viewText}
                                        >
                                            {birthday.toLocaleDateString()}
                                        </Text>
                                    </View>
                                    {birthdayModal && (
                                        <DateTimePicker
                                            value={birthday}
                                            mode={"date"}
                                            is24Hour={true}
                                            onChange={onDateChange}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                        <View style={styles.switchContainer}>
                            <View>
                                <Text
                                    adjustsFontSizeToFit={true}
                                    style={styles.text}
                                >
                                    Tienes Bici?
                                </Text>
                                <Switch
                                    style={styles.switch}
                                    trackColor={{
                                        true: "#ccc",
                                        false: "#767577",
                                    }}
                                    thumbColor={bike ? "#00FD02" : "#ccc"}
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() =>
                                        setBike((curr) => !curr)
                                    }
                                    value={bike}
                                />
                            </View>
                            <View>
                                <Text
                                    adjustsFontSizeToFit={true}
                                    style={styles.text}
                                >
                                    Realizas otra actividad?
                                </Text>
                                <Switch
                                    style={styles.switch}
                                    trackColor={{
                                        true: "#ccc",
                                        false: "#767577",
                                    }}
                                    thumbColor={
                                        anotherActivity.bool
                                            ? "#00FD02"
                                            : "#f6f6f6"
                                    }
                                    ios_backgroundColor="#3e3e3e"
                                    onValueChange={() => {
                                        setAnotherActivity({
                                            ...anotherActivity,
                                            bool: !anotherActivity.bool,
                                        });
                                    }}
                                    value={anotherActivity.bool}
                                />
                            </View>
                        </View>
                        {anotherActivity.bool && (
                            <View style={styles.inputContainer}>
                                <Text
                                    adjustsFontSizeToFit={true}
                                    style={styles.text}
                                >
                                    Otras actividades
                                </Text>
                                <TextInput
                                    placeholder="Cuentanos tus actividades"
                                    value={anotherActivity.text}
                                    onChangeText={(text) =>
                                        setAnotherActivity({
                                            ...anotherActivity,
                                            text: text,
                                        })
                                    }
                                    style={styles.input}
                                />
                            </View>
                        )}
                        <View style={styles.inputContainer}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.text}
                            >
                                Tomas medicamentos?
                            </Text>
                            <TextInput
                                placeholder="Si no tomas, deja el campo vacío"
                                value={medication}
                                onChangeText={setMedication}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.text}
                            >
                                Alguna lesión?
                            </Text>
                            <TextInput
                                placeholder="Si no tienes, deja el campo vacío"
                                value={issue.text}
                                onChangeText={setIssue}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.text}
                            >
                                Enfermedad Crónica?
                            </Text>
                            <TextInput
                                placeholder="Si no posees, deja el campo vacío"
                                value={chronicIllnesses}
                                onChangeText={setChronicIllnesses}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.text}
                            >
                                Metas
                            </Text>
                            <TextInput
                                placeholder="Cuentanos tus metas"
                                value={goals}
                                onChangeText={setGoals}
                                style={styles.input}
                            />
                        </View>
                        <View style={styles.inputContainer}>
                            <Checkbox.Item
                                label={"Acepto los terminos y condiciones"}
                                status={terms ? "checked" : "unchecked"}
                                color={"#f6f6f6"}
                                uncheckedColor="#f6f6f6"
                                labelStyle={{
                                    color: "#f6f6f6",
                                    textAlign: "center",
                                    fontSize: 18,
                                }}
                                position="leading"
                                onPress={() => setTerms(!terms)}
                            />
                        </View>
                    </ScrollView>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity onPress={handleRegister}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={{ color: "#f6f6f6", fontFamily: font }}
                            >
                                REGISTRARSE
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.registerContainer}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.registerText}
                            >
                                Ya tienes cuenta?
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    router.push("/login");
                                }}
                            >
                                <Text
                                    adjustsFontSizeToFit={true}
                                    style={{
                                        color: "#f6f6f6",
                                        fontFamily: font,
                                    }}
                                >
                                    INICIA SESIÓN
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={handleTerms}>
                            <Text
                                adjustsFontSizeToFit={true}
                                style={styles.text}
                            >
                                Ver terminos y condiciones
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    modal: {
        height: 100 * vh,
        width: 100 * vw,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    modalContainer: {
        height: "80%",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 25,
        paddingHorizontal: 25,
        backgroundColor: "#f6f6f6",
        borderRadius: 5,
    },
    modalContent: {
        height: "100%",
        justifyContent: "space-around",
    },
    view: {
        flex: 1,
    },
    content: {
        flex: 95,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#000",
    },
    inputContainer: {
        width: 80 * vw,
        marginTop: 15,
    },
    switchContainer: {
        marginTop: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    containerDouble: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    inputDouble: {
        width: "45%",
    },
    switch: {
        alignItems: "center",
    },
    input: {
        backgroundColor: "#f6f6f6",
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
        width: "100%",
        borderRadius: 5,
        fontSize: 18,
        backgroundColor: "#f6f6f6",
    },
    viewButton: {
        width: "100%",
        borderRadius: 5,
        backgroundColor: "#f6f6f6",
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    },
    viewText: {
        fontSize: 18,
        color: "#000",
        fontFamily: "IBMPlexSansJP",
    },
    text: {
        fontSize: 14,
        color: "#f6f6f6",
        marginBottom: 5,
        fontFamily: "IBMPlexSansJP",
    },
    inverseText: {
        fontSize: 14,
        color: "#000",
        marginBottom: 5,
        fontFamily: "IBMPlexSansJP",
    },
    registerContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 10,
        gap: 5,
    },
    registerText: {
        color: "#f6f6f6",
        fontFamily: "IBMPlexSansJP",
    },
    buttonContainer: {
        marginTop: 20,
        alignItems: "center",
        paddingBottom: 10,
    },
});
