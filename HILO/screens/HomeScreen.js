import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { getAuth, signOut, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";

const HomeScreen = ({ navigation }) => {
	const [ifSavedPressed, setIfSavedPressed] = useState(false);
	const [logInValues, setLogInValues] = useState([]);
	const [nameOfUser, setNameOfUser] = useState("");
	const [savedLogInValues, setSavedLogInValues] = useState([]);

	React.useEffect(() => {
		//cuando se muestre en la pantalla, te suscribes al evento para recuperar informacion dentro de getUserData
		const unsubscribe = navigation.addListener("focus", () => {
			getUserData();
		});
		return unsubscribe; //sirve para evitar escuchar eventos que no estan en la pantalla/no son relevantes
	}, [navigation]); //dependencia. cada vez que la navegacion cambia

	async function getUserData() {
		try {
			const jsonValue = await AsyncStorage.getItem("myLogInfo"); //con asyncstorage de agarran lo datos gracias a la clave, se utiliza getitem para devolverlo en forma de cadena de json
			const jsonValue2 = JSON.parse(jsonValue); //y se transforma en un string para guardarlo en asyncstorage
			if (jsonValue2 !== null) {
				setSavedLogInValues(jsonValue2); //actualiza informacion en setSavedLogInValues
			}
		} catch (e) {
			alert(e);
		}
	}

	useEffect(() => {
		if (savedLogInValues.length !== 0) {
			console.log(savedLogInValues);
			const auth = getAuth(app); //obtenes las instacias del auth de firebase en firebase.js
			signInWithEmailAndPassword(
				//inica sesion guardados en savedLogInValues
				auth,
				savedLogInValues.emaill,
				savedLogInValues.passwordd
			)
				.then((userCredential) => {
					const user = userCredential.user;
					if (user !== null) {
						user.providerData.forEach((profile) => {
							//se itera los datos del user
							console.log("sign in provider: " + profile.providerId);
							console.log("provider specific UID: " + profile.uid);
							console.log("Name: " + profile.displayName);
							console.log("Email: " + profile.email);
							setNameOfUser(profile.displayName); //guardo el user aca para despues saludarlo
						});
					}
				})
				.catch((e) => {
					alert(e);
				});
		}
	}, [savedLogInValues]); //cuando esto cambia, ocurre todo lo de arriba

	useEffect(() => {
		if (ifSavedPressed === true) {
			storeData(); //storeData guarda la informacion
			setIfSavedPressed(false);
		}
	}, [logInValues]); //se ejecuta lo de arriba cada vez que cambie gracias a useEffect

	async function storeData() {
		try {
			const savedValues = logInValues;
			const jsonValue = await AsyncStorage.setItem(
				//setitem alamcena los datos en el almacenamiento asincronico
				"myLogInfo", //la clave de acceso
				JSON.stringify(savedValues) //convierte de objeto a cadena JSON para guardarlo en savedValues
			);
			navigation.navigate("Login");
			return jsonValue;
		} catch (e) {
			alert(e);
		}
	}

	const signOutt = () => {
		const auth = getAuth(app);
		signOut(auth)
			.then(() => {
				setIfSavedPressed(true); //actualiza el estado de IfSavedPressed,que es el boton de guardar
				setLogInValues([]); //limpia lo almacenado
				navigation.navigate("Login");
			})
			.catch((e) => {
				alert(e);
			});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>Buenos dias {nameOfUser}</Text>
			<Pressable style={styles.customButton} onPress={signOutt}>
				<Text style={styles.buttonText}>Sign Out</Text>
			</Pressable>
			<Pressable
				style={styles.customButton}
				onPress={() => navigation.navigate("Notas")}>
				<Text style={styles.buttonText}>Ver Notas</Text>
			</Pressable>
		</View>
	);
};

export default HomeScreen;

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
	headerText: {
		fontSize: 30,
		fontWeight: "bold",
		color: "purple",
		margin: 5,
	},
});
