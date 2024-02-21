import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// rnfe para crear de cero

const LoginScreen = ({ navigation }) => {
	//useState guarda los primeros campos, almacena el inicio de sesion y verifica que el boton es presionado o no
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [logInValues, setLogInValues] = useState([]);
	const [ifSavedPressed, setIfSavedPressed] = useState(false);
	//sigIn es una funcion de FireBase para guardar
	async function signIn() {
		const auth = getAuth(app);
		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				var newauth = {
					//crea un objeto con los datos del usuario actual
					emaill: email,
					passwordd: password,
				};
				setIfSavedPressed(true);
				setLogInValues(newauth); //si es exitoso lo guarda aca temporalmente
			})
			.catch((error) => {
				alert(error);
			});
	}

	async function storeData() {
		try {
			const savedValues = logInValues; //lo copio para no modificarlo directamente
			const jsonValue = await AsyncStorage.setItem(
				//await es para esperar a la respuesta Guarda la clave y los datos de inicio de sesion con setItem
				"myLogInfo",
				JSON.stringify(savedValues) //y se transforma en un string para guardarlo en asyncstorage
			);
			setEmail(""); //se reinicia los inputs
			setPassword("");
			navigation.navigate("Home"); //y te envia a la pantalla
			return jsonValue;
		} catch (e) {
			alert(e);
		}
	}

	useEffect(() => {
		if (ifSavedPressed === true) {
			//entonces si se preciona storeData guarda la informacion
			storeData();
			setIfSavedPressed(false); //y vuelve al estado de falso
		}
	}, [logInValues]); //se ejecuta lo de arriba cada vez que cambie gracias a useEffect

	return (
		//y aca es todo el renderizado
		<View style={styles.container}>
			<TextInput
				style={styles.textInput}
				placeholder="Enter your email"
				value={email}
				onChangeText={(text) => setEmail(text)}
			/>
			<TextInput
				style={styles.textInput}
				placeholder="Enter your password"
				value={password}
				onChangeText={(text) => setPassword(text)}
			/>
			<Pressable style={styles.customButton} onPress={signIn}>
				<Text style={styles.buttonText}>Sign In</Text>
			</Pressable>
			<Pressable
				style={styles.customButton}
				onPress={() => navigation.navigate("Register")}>
				<Text style={styles.buttonText}>Register</Text>
			</Pressable>
		</View>
	);
};

export default LoginScreen;

const styles = StyleSheet.create({
	button: {
		width: 200,
		marginTop: 10,
	},
	container: {
		flex: 1,
		alignItems: "center",
		padding: 10,
	},
	customButton: {
		width: "70%",
		backgroundColor: "purple",
		borderRadius: 10,
		margin: 15,
	},
	buttonText: {
		color: "white",
		fontSize: 30,
		fontWeight: "bold",
		textAlign: "center",
	},
	textInput: {
		fontSize: 30,
		textAlign: "center",
		margin: 5,
		padding: 10,
		borderBottomWidth: 2,
		borderColor: "black",
		width: "80%",
	},
});
