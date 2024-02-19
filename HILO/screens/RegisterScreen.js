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
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [imageURL, setImageURL] = useState("");
	const [logInValues, setLogInValues] = useState([]);
	const [savedLogInValues, setSavedLogInValues] = useState([]);
	const [ifSavedPressed, setIfSavedPressed] = useState(false);

	async function register() {
		const auth = getAuth(app);
		createUserWithEmailAndPassword(auth, email, password)
			.then(() => {
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
						updateProfilee();
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
	}, [logInValues]);

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (savedLogInValues.length !== 0) {
			console.log(savedLogInValues);
		}
	}, [savedLogInValues]);

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
			setEmail("");
			setPassword("");
			setImageURL("");
			setName("");
			navigation.navigate("Home");
			return jsonValue;
		} catch (e) {
			alert(e);
		}
	}

	async function getData() {
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

	const updateProfilee = () => {
		const auth = getAuth(app);
		updateProfile(auth.currentUser, {
			displayName: name,
			photoURL:
				"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAPFBMVEXk5ueutLepsLPo6uursbXJzc/p6+zj5ea2u76orrKvtbi0ubzZ3N3O0dPAxcfg4uPMz9HU19i8wcPDx8qKXtGiAAAFTElEQVR4nO2d3XqzIAyAhUD916L3f6+f1m7tVvtNINFg8x5tZ32fQAIoMcsEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQRAEQTghAJD1jWtnXJPP/54IgNzZQulSmxvTH6oYXX4WS+ivhTbqBa1r26cvCdCu6i0YXbdZ0o4A1rzV+5IcE3YE+z58T45lqo7g1Aa/JY5tgoqQF3qb382x7lNzBLcxft+O17QUYfQI4IIeklKsPSN4i6LKj/7Zm8n99RbHJpEw9gEBXNBpKIYLJqKYRwjOikf//r+J8ZsVuacbqCMNleI9TqGLGqMzhnVdBOdd6F/RlrFijiCoVMk320CBIahUxTWI0KKEcJqKbMdpdJb5QvdHq6wCI5qhKlgGMS/RBHkubWDAE+QZxB4xhCyDiDkLZxgGEVdQldzSKbTIhmZkFkSEPcVvmBn2SMuZB9od7fQDsMiDdKJjFUSCQarM5WirZ3C2TT/htYnyPcPfgrFHWz0BI74gr6J/IZiGUxAZGQLqmvQLTrtE/Go4YxhVRIpEw+sww1IIcqr5NKmUUzLF3d4/qPkYIp2T/obPuemlojFUR4t9Q2Vojhb7BmgElWHzLPH8hucfpefPNFTVgs9h1AdU/Pin96vwWbWdf+X9Absn3OdO34aMdsDnP8WgKYisTqI6CkNGqZQo1XA6Ef6AU32SJzOcBukHPF07/xNSgmHKa5BOhtezv6mA/rYJpwXNAnbRZ1XuF3BzDcO3vpA3+ny2909gbqE4hhD3LIPhLLyBNhPZvbZ3B+3tPYa18A7auSlXQayKwTPNLKDcuOB0xPYKDPFTkWsevQPRZ1J8Hji9I1KQ34r7hZhrwNwOZ97QxNx0drwn4QI0wQk1DcEsfKCWKdxVvxPSNUIp/knmAXT+nT+Ko3+0H96rcNb3m1fx7MBTJdeBJ7uFcWsc0wvgAsC4pROW0l2inbAmIBv/7GZmuhQH6API2rr8T0e6yuZJ+80A9LZeG62T3tik31XwxtwZcizKuTHkMjB1WdZde4Kmic/A5ZI3rr1ae21d08PlVHYfAaxw9G9CYRbJ+8ZdbTcMRV1XM3VdF0M32vtoTdZ0+u29s0OttJ5bz64UwinjaFMVY9vkqc3KKSxN21Xl+0L4Q3Vuv1tYl0pqnX6ms4XetFz7gdZVAgUEoJntfOUe4ZwsHd9FzqQ3Vv6xe41l0XJcqcKl6TZvlv7ClAW3BsqQW4X7ypApB8dmTgK4IX5wvqIVj33HtD2qSG4BqznxdIefL27Y4sahi0MdIdvUsDva8agGGbCtITmCY31MHD2O0uIdh/0rJDQ1VX5Zdxz3rR2QDbv6qXl9vudzqQtGm1Jv9LDXOsfvvB7VcZ8PDKD0mQ1VHPYQ9O+Yj4hR1IUD8rBnn3ho2m8oQMxbCFiKlL2ioSW5heeJqegED52CzxCtcGD3Kv8Wms9EYLyUhwaFIhSMBClevWEmiK/Iaogu4H7sg6ppQhQG8RUqivuTGOAJOg6FfgW0q0M0PQMRMEgXaeNf3SYDZ8PIMI0+wHgr/MgN7wYwpiLjCCqM6ydUDZLQiB6nDdNC8SDyig3jPPpFXGcC9O8BUBDVmgBY59E7Md/35Loe/UVEECEJwYggJjELZ4J71SaQSBeC02n4Da29CayJNA28SAhd2CQyC1Xw6pSmGSINQVuMhAZp4DClan9MgmkDDNmezqwS8sgtlXK/EPBhoaSmYVC/F7IO1jQEdHOlabpKh3+jzLQSTUiq4X2I+Ip/zU8rlaqAvkS21ElR+gqu3zbjjL+hIAiCIAiCIAiCIAiCsCf/AKrfVhSbvA+DAAAAAElFTkSuQmCC",
		})
			.then((res) => {
				console.log("success: ", res);
			})
			.catch((e) => {
				alert(e);
			});
	};

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
			<TextInput
				style={styles.textInput}
				placeholder="Enter your image URL"
				value={imageURL}
				onChangeText={(text) => setImageURL(text)}
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
