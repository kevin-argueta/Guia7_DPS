import React, { useState } from 'react';
import { Text, StyleSheet, View, TextInput, Button, TouchableHighlight, Alert, ScrollView } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import shortid from "react-id-generator";
import colors from '../src/utils/colors';
import { Formik } from 'formik';
import * as Yup from 'yup';

// Esquema de validación
const validationSchema = Yup.object().shape({
    paciente: Yup.string().required('Campo requerido'),
    dueño: Yup.string().required('Campo requerido'),
    telefono: Yup.string().required('Campo requerido').matches(/^[0-9]+$/, 'Número de teléfono inválido'),
    fecha: Yup.string()
        .required('Campo requerido')
        .test('is-valid-date', 'Fecha inválida', (value) => {
            const date = new Date(value);
            return !isNaN(date.getTime());
        }),
    hora: Yup.string()
        .required('Campo requerido')
        .test('is-valid-time', 'Hora inválida', (value) => {
            const [hour, minute] = value.split(':');
            return hour >= 0 && hour < 24 && minute >= 0 && minute < 60;
        }),
    sintomas: Yup.string().required('Campo requerido'),
});

const Formulario = ({ citas, setCitas, guardarMostrarForm, guardarCitasStorage }) => {
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    const showDatePicker = () => setDatePickerVisibility(true);
    const hideDatePicker = () => setDatePickerVisibility(false);
    const confirmDate = (date) => {
        const opciones = { year: 'numeric', month: 'long', day: '2-digit' };
        formik.setFieldValue('fecha', date.toLocaleDateString('es-ES', opciones));
        hideDatePicker();
    };

    const showTimePicker = () => setTimePickerVisibility(true);
    const hideTimePicker = () => setTimePickerVisibility(false);
    const confirmTime = (time) => {
        const opciones = { hour: 'numeric', minute: '2-digit', hour12: false };
        
        formik.setFieldValue('hora', time.toLocaleString('es-ES', opciones).substring(0, 5)); // Extraer solo la hora
        hideTimePicker();
    };

    const crearNuevaCita = (values) => {
        const cita = { ...values, id: shortid() };
        const citasNuevo = [...citas, cita];
        setCitas(citasNuevo);
        guardarCitasStorage(JSON.stringify(citasNuevo));
        guardarMostrarForm(false);
    };

    const mostrarAlerta = () => {
        Alert.alert(
            'Error',
            'Todos los campos son obligatorios',
            [{ text: 'OK' }]
        );
    };

    return (
        <Formik
            initialValues={{
                paciente: '',
                dueño: '',
                telefono: '',
                fecha: '',
                hora: '',
                sintomas: '',
            }}
            validationSchema={validationSchema}
            onSubmit={(values) => {
                crearNuevaCita(values);
            }}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
                setFieldValue,
            }) => {
                // Definir formik aquí para usarlo en la función confirmDate y confirmTime
                const formik = {
                    setFieldValue,
                    values,
                    errors,
                    touched,
                };
                const confirmDate = (date) => {
                    const opciones = { year: 'numeric', month: 'long', day: '2-digit' };
                    formik.setFieldValue('fecha', date.toLocaleDateString('es-ES', opciones));
                    hideDatePicker();
                    const confirmTime = (time) => {
                        const opciones = { hour: 'numeric', minute: '2-digit', hour12: false };
                        
                        formik.setFieldValue('hora', time.toLocaleString('es-ES', opciones).substring(0, 5)); // Extraer solo la hora
                        hideTimePicker();
                    };
                };
                return (
                    <ScrollView style={styles.formulario}>
                        <View>
                            <Text style={styles.label}>Paciente:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('paciente')}
                                onBlur={handleBlur('paciente')}
                                value={values.paciente}
                            />
                            {touched.paciente && errors.paciente && <Text style={styles.errorText}>{errors.paciente}</Text>}
                        </View>

                        <View>
                            <Text style={styles.label}>Dueño:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('dueño')}
                                onBlur={handleBlur('dueño')}
                                value={values.dueño}
                            />
                            {touched.dueño && errors.dueño && <Text style={styles.errorText}>{errors.dueño}</Text>}
                        </View>

                        <View>
                            <Text style={styles.label}>Teléfono Contacto:</Text>
                            <TextInput
                                style={styles.input}
                                onChangeText={handleChange('telefono')}
                                onBlur={handleBlur('telefono')}
                                value={values.telefono}
                                keyboardType='numeric'
                            />
                            {touched.telefono && errors.telefono && <Text style={styles.errorText}>{errors.telefono}</Text>}
                        </View>

                        <View>
                            <Text style={styles.label}>Fecha:</Text>
                            <Button title="Seleccionar Fecha" onPress={showDatePicker} />
                            <DateTimePickerModal
                                isVisible={isDatePickerVisible}
                                mode="date"
                                onConfirm={confirmDate}
                                onCancel={hideDatePicker}
                                locale='es_ES'
                                headerTextIOS="Elige la fecha"
                                cancelTextIOS="Cancelar"
                                confirmTextIOS="Confirmar"
                            />
                            <Text>{values.fecha}</Text>
                            {touched.fecha && errors.fecha && <Text style={styles.errorText}>{errors.fecha}</Text>}
                        </View>

                        <View>
                            <Text style={styles.label}>Hora:</Text>
                            <Button title="Seleccionar Hora" onPress={showTimePicker} />
                            <DateTimePickerModal
                                isVisible={isTimePickerVisible}
                                mode="time"
                                onConfirm={confirmTime}
                                onCancel={hideTimePicker}
                                locale='es_ES'
                                headerTextIOS="Elige una Hora"
                                cancelTextIOS="Cancelar"

                                confirmTextIOS="Confirmar"
                            />
                            <Text>{values.hora}</Text>
                            {touched.hora && errors.hora && <Text style={styles.errorText}>{errors.hora}</Text>}
                        </View>

                        <View>
                            <Text style={styles.label}>Síntomas:</Text>
                            <TextInput
                                multiline
                                style={styles.input}
                                onChangeText={handleChange('sintomas')}
                                onBlur={handleBlur('sintomas')}
                                value={values.sintomas}
                            />
                            {touched.sintomas && errors.sintomas && <Text style={styles.errorText}>{errors.sintomas}</Text>}
                        </View>

                        <View>
                            <TouchableHighlight onPress={handleSubmit} style={styles.btnSubmit}>
                                <Text style={styles.textoSubmit}>Crear Nueva Cita</Text>
                            </TouchableHighlight>
                        </View>
                    </ScrollView>
                );
            }}
        </Formik>
    );
};

const styles = StyleSheet.create({
    formulario: {
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1
    },
    label: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20
    },
    input: {
        marginTop: 10,
        height: 50,
        borderColor: '#e1e1e1',
        borderWidth: 1,
        borderStyle: 'solid'
    },
    btnSubmit: {
        padding: 10,
        backgroundColor: colors.BUTTON_COLOR,
        marginVertical: 10
    },
    textoSubmit: {
        color: '#FFF',
        fontWeight: 'bold',
        textAlign: 'center'
    },
    errorText: {
        color: 'red',
        marginBottom: 12,
    },
});

export default Formulario;
