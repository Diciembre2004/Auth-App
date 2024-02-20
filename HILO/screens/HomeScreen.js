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
	const [imagePath, setImagePath] = useState("");
	const [savedLogInValues, setSavedLogInValues] = useState([]);

	React.useEffect(() => {
		const unsubscribe = navigation.addListener("focus", () => {
			getUserData();
		});
		return unsubscribe;
	}, [navigation]);

	async function getUserData() {
		try {
			const jsonValue = await AsyncStorage.getItem("myLogInfo");
			const jsonValue2 = JSON.parse(jsonValue);
			if (jsonValue2 !== null) {
				setSavedLogInValues(jsonValue2);
			}
		} catch (e) {
			alert(e);
		}
	}

	useEffect(() => {
		if (savedLogInValues.length !== 0) {
			console.log(savedLogInValues);
			const auth = getAuth(app);
			signInWithEmailAndPassword(
				auth,
				savedLogInValues.emaill,
				savedLogInValues.passwordd
			)
				.then((userCredential) => {
					const user = userCredential.user;
					console.log("user signed in");
					if (user !== null) {
						user.providerData.forEach((profile) => {
							console.log("sign in provider: " + profile.providerId);
							console.log("provider specific UID: " + profile.uid);
							console.log("Name: " + profile.displayName);
							console.log("Email: " + profile.email);
							console.log("Photo url: " + profile.photoURL);
							setNameOfUser(profile.displayName);
							setImagePath(profile.photoURL);
						});
					}
				})
				.catch((e) => {
					alert(e);
				});
		}
	}, [savedLogInValues]);

	useEffect(() => {
		if (ifSavedPressed === true) {
			storeData();
			setIfSavedPressed(false);
		}
	}, [logInValues]);

	async function storeData() {
		console.log(logInValues);
		console.log("working");
		try {
			const savedValues = logInValues;
			const jsonValue = await AsyncStorage.setItem(
				"myLogInfo",
				JSON.stringify(savedValues)
			);
			console.log("data stored");
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
				setIfSavedPressed(true);
				setLogInValues([]);
				console.log("user has signed out");
				navigation.navigate("Login");
			})
			.catch((e) => {
				alert(e);
			});
	};

	return (
		<View style={styles.container}>
			<Text style={styles.headerText}>Bienvenido {nameOfUser}</Text>
			<Image
				style={{ width: "100%", height: 400 }}
				source={{ uri: `${imagePath}` }}
			/>
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
