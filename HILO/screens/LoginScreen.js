import { View, Text, StyleSheet, TextInput, Pressable } from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

// rnfe

const LoginScreen = ({ navigation }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [logInValues, setLogInValues] = useState([]);
	const [ifSavedPressed, setIfSavedPressed] = useState(false);

	async function signIn() {
		const auth = getAuth(app);
		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				console.log("user signed in");
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
	}

	async function storeData() {
		console.log(logInValues);
		console.log("working");
		try {
			const savedValues = logInValues;
			const jsonValue = await AsyncStorage.setItem(
				"myLogInfo",
				JSON.stringify(savedValues)
			);
			console.log("dataSaved");
			setEmail("");
			setPassword("");
			navigation.navigate("Home");
			return jsonValue;
		} catch (e) {
			alert(e);
		}
	}

	useEffect(() => {
		if (ifSavedPressed === true) {
			storeData();
			setIfSavedPressed(false);
		}
	}, [logInValues]);

	return (
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
