import React, { useState, useEffect } from "react";
import {
	Text,
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Platform } from "react-native";
import {
	getFirestore,
	collection,
	addDoc,
	getDocs,
	doc,
	deleteDoc,
	getDoc,
	setDoct,
} from "firebase/firestore";
import app from "../firebase";
const db = getFirestore(app);

export default function CreateNote(props) {
	const initialState = {
		titulo: "",
		detalle: "",
	};

	const [date, setDate] = useState(new Date(1598051730000));
	const [mode, setMode] = useState("date");
	const [show, setShow] = useState(false);
	const [text, setText] = useState("empty");
	const [fecha, setFecha] = useState("");
	const [hora, setHora] = useState("");
	const [estado, setEstado] = useState(initialState);

	const onChange = (event, selectedDate) => {
		const currentDate = selectedDate || date;
		setShow(Platform.OS === "ios");
		setDate(currentDate);

		let tempDate = new Date(currentDate);
		let fDate =
			tempDate.getDate() +
			"/" +
			(tempDate.getMonth() + 1) +
			"/" +
			tempDate.getFullYear();
		let fTime =
			"Hora: " + tempDate.getHours() + " minutos: " + tempDate.getMinutes();
		//   setText(fDate + " " + fTime);
		setFecha(fDate);
		setHora(fTime);
	};

	const showMode = (currentDate) => {
		setShow(true);
		setMode(currentDate);
	};

	const handleChangeText = (value, name) => {
		setEstado({ ...estado, [name]: value });
	};

	const saveNote = async () => {
		try {
			if (estado.titulo === "" || estado.detalle === "") {
				Alert.alert("mensaje importante", "debes rellenar el campo requerido");
			} else {
				const nota = {
					titulo: estado.titulo,
					detalle: estado.detalle,
					fecha: fecha,
					hora: hora,
				};
				await addDoc(collection(db, "notas"), {
					...nota,
				});
				Alert.alert("Exito", "guardado con exito");
				props.navigation.navigate("Notas");
			}
		} catch (error) {
			console.log(error);
		}

		//console.log(nota);
	};

	return (
		<View style={styles.contenedorPadre}>
			<View style={styles.tarjeta}>
				<View style={styles.contenedor}>
					<TextInput
						placeholder="Ingresa el titulo"
						style={styles.textoInput}
						value={estado.titulo}
						onChangeText={(value) => handleChangeText(value, "titulo")}
					/>
					<TextInput
						placeholder="Ingresa el detalle"
						multiline={true}
						numberOfLines={4}
						style={styles.textoInput}
						value={estado.detalle}
						onChangeText={(value) => handleChangeText(value, "detalle")}
					/>

					{/* contenedor de fecha */}
					<View style={styles.inputDate}>
						<TextInput
							placeholder="5/5/2023"
							style={styles.textoDate}
							value={fecha}
						/>
						<TouchableOpacity
							style={styles.botonDate}
							onPress={() => showMode("date")}>
							<Text style={styles.subtitle}>Date</Text>
						</TouchableOpacity>
					</View>

					{/* contenedro de hora */}
					<View style={styles.inputDate}>
						<TextInput
							placeholder="Hora: 6 minutos: 30"
							style={styles.textoDate}
							value={hora}
						/>
						<TouchableOpacity
							style={styles.botonDate}
							onPress={() => showMode("time")}>
							<Text style={styles.subtitle}>Hora</Text>
						</TouchableOpacity>
					</View>

					{show && (
						<DateTimePicker
							testID="dateTimePicker"
							value={date}
							mode={mode}
							is24Hour={true}
							display="default"
							onChange={onChange}
							minimumDate={new Date("2023-1-1")}
						/>
					)}

					{/* boton para enviar los datos */}
					<View>
						<TouchableOpacity style={styles.botonEnviar} onPress={saveNote}>
							<Text style={styles.textoBtnEnviar}>Guardar una nueva nota</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	contenedorPadre: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	tarjeta: {
		margin: 20,
		backgroundColor: "white",
		borderRadius: 20,
		width: "90%",
		padding: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	contenedor: {
		padding: 20,
	},
	textoInput: {
		borderColor: "slategray",
		borderWidth: 1,
		padding: 2,
		marginTop: 10,
		borderRadius: 8,
	},
	inputDate: {
		width: "100%",
		flexWrap: "wrap",
		flexDirection: "row",
	},
	botonDate: {
		backgroundColor: "#B71375",
		borderRadius: 5,
		padding: 10,
		width: "30%",
		height: "90%",
		marginTop: 10,
		marginLeft: 10,
	},
	textoDate: {
		borderColor: "slategray",
		borderWidth: 1,
		padding: 10,
		marginTop: 10,
		borderRadius: 8,
	},
	subtitle: {
		color: "white",
		fontSize: 18,
	},
	botonEnviar: {
		backgroundColor: "#B71375",
		borderColor: "#FC4F00",
		borderWidth: 3,
		borderRadius: 20,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
	},
	textoBtnEnviar: {
		textAlign: "center",
		padding: 10,
		color: "white",
		fontSize: 16,
	},
});
