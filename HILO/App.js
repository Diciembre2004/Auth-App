import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import "react-native-gesture-handler";
import Notas from "./screens/Notas";
import CreateNote from "./screens/CreateNote";
import DetailsNote from "./screens/DetailsNote";

//add this below for removing warning if you want too
//import { LogBox } from "react-native";
//LogBox.ignoreLogs(["Warning: ..."]); // Ignore log notification by message
//LogBox.ignoreAllLogs(); //Ignore all log notifications

const Stack = createStackNavigator();

export default function App() {
	const [savedLogInValues, setSavedLogInValues] = useState([]);
	const [loadingApp, setLoadingApp] = useState(true);

	useEffect(() => {
		getData();
	}, []);

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
					component={HomeScreen}
					options={{
						title: "Home hi",
						headerLeft: null,
						headerTintColor: "purple",
					}}
				/>
				<Stack.Screen
					name="Notas"
					component={Notas}
					options={{
						title: "NOTAS APP",
						headerTitleAlign: "center",
						headerStyle: { backgroundColor: "#8B1874" },
						headerTintColor: "white",
					}}
				/>
				<Stack.Screen
					name="Crear"
					component={CreateNote}
					options={{
						title: "CREAR NOTAS",
						headerTitleAlign: "center",
						headerStyle: { backgroundColor: "#8B1874" },
						headerTintColor: "white",
					}}
				/>
				<Stack.Screen
					name="Detail"
					component={DetailsNote}
					options={{
						title: "DETALLES DE NOTA",
						headerTitleAlign: "center",
						headerStyle: { backgroundColor: "#8B1874" },
						headerTintColor: "white",
					}}
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
