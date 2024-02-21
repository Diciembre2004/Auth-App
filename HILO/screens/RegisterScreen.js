import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import {
	getAuth,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import app from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RegisterScreen = ({ navigation }) => {
	//establece el estado inicial para el formulario, inicializando todos en vacio
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [logInValues, setLogInValues] = useState([]); //logInValues guarda temporalmente
	const [savedLogInValues, setSavedLogInValues] = useState([]); //savedLogInValues guarda permanentemente (en el dispositivo)
	const [ifSavedPressed, setIfSavedPressed] = useState(false);

	async function register() {
		const auth = getAuth(app); //app es del archivo firebase.js
		createUserWithEmailAndPassword(auth, email, password)
			.then(() => {
				const auth = getAuth(app);
				signInWithEmailAndPassword(auth, email, password)
					.then(() => {
						var newauth = {
							emaill: email,
							passwordd: password,
						};
						setIfSavedPressed(true);
						setLogInValues(newauth);
					})
					.catch((error) => {
						alert(error);
					});
			})
			.catch((error) => {
				alert(error);
			});
	}

	useEffect(() => {
		if (ifSavedPressed === true) {
			storeData();
			setIfSavedPressed(false);
		}
	}, [logInValues]); //se ejecuta lo de arriba cada vez que cambie gracias a useEffect

	useEffect(() => {
		getData();
	}, []); //recupera los datos dentro de getData solo una vez, cuando se carga

	async function storeData() {
		try {
			const savedValues = logInValues;
			const jsonValue = await AsyncStorage.setItem(
				"myLogInfo",
				JSON.stringify(savedValues)
			);
			setEmail("");
			setPassword("");
			setName("");
			navigation.navigate("Home");
			return jsonValue;
		} catch (e) {
			alert(e);
		}
	}

	async function getData() {
		try {
			const jsonValue = await AsyncStorage.getItem("myLogInfo"); //con asyncstorage de agarran lo datos gracias a la clave, se utiliza getitem para devolverlo en forma de cadena de json
			const jsonValue2 = JSON.parse(jsonValue); //y esto para volverlo un string
			if (jsonValue2 !== null) {
				setSavedLogInValues(jsonValue2); //actualiza informacion en setSavedLogInValues
			}
		} catch (e) {
			alert(e);
		}
	}

	return (
		<View style={styles.container}>
			<TextInput
				style={styles.textInput}
				placeholder="Enter your name"
				value={name}
				onChangeText={(text) => setName(text)}
			/>
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
			<Pressable style={styles.customButton} onPress={register}>
				<Text style={styles.buttonText}>Sign In</Text>
			</Pressable>
		</View>
	);
};

export default RegisterScreen;
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
