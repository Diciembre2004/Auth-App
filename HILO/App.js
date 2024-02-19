import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { enableExperimentalWebImplementation } from "react-native-gesture-handler";
//add this below for removing warning if you want too
import { LogBox } from "react-native";
LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

//npm install firebase

//npm install @react-native-async-storage/async-storage

//npm install @react-navigation/native

//npm install @react-navigation/stack

//npx expo install react-native-gesture-handler

const Stack = createStackNavigator();

export default function App() {
	const [savedLogInValues, setSavedLogInValues] = useState([]);
	const [loadingApp, setLoadingApp] = useState(true);

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		if (savedLogInValues.length !== 0) {
			console.log(savedLogInValues);
		}
	}, [savedLogInValues]);

	async function getData() {
		try {
			const jsonValue = await AsyncStorage.getItem("myLogInfo");
			const jsonValue2 = JSON.parse(jsonValue);
			if (jsonValue2 === null) {
				setSavedLogInValues([]);
				setLoadingApp(false);
			} else {
				setSavedLogInValues(jsonValue2);
				setLoadingApp(false);
			}
		} catch (e) {
			alert(e);
		}
	}

	if (loadingApp === true) {
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: 25, color: "blue" }}>Loading</Text>
			</View>
		);
	}

	return (
		<NavigationContainer>
			<Stack.Navigator>
				{savedLogInValues.length !== 0 ? (
					<Stack.Screen
						name="HomeOnStart"
						options={{
							title: "Home",
							headerLeft: null,
							headerTintColor: "purple",
						}}
						component={HomeScreen}
					/>
				) : (
					<Stack.Screen
						name="LoginOnStart"
						options={{
							title: "Login",
							headerLeft: null,
							headerTintColor: "purple",
						}}
						component={LoginScreen}
					/>
				)}
				<Stack.Screen
					name="Login"
					options={{
						title: "Login",
						headerLeft: null,
						headerTintColor: "purple",
					}}
					component={LoginScreen}
				/>
				<Stack.Screen
					name="Register"
					options={{
						title: "Register",
						headerTintColor: "purple",
					}}
					component={RegisterScreen}
				/>
				<Stack.Screen
					name="Home"
					options={{
						title: "Home",
						headerLeft: null,
						headerTintColor: "purple",
					}}
					component={HomeScreen}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
});
