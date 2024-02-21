//Interfaces basicas de react
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";

import AsyncStorage from "@react-native-async-storage/async-storage"; //para almacenar y recuperar datos de forma asíncrona.
import { useState, useEffect } from "react"; //Importa 'hooks' de react para gestionar el estado y los efectos secundarios.
import "react-native-gesture-handler"; //una libreria para gestos

//Vistas
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import HomeScreen from "./screens/HomeScreen";
import Notas from "./screens/Notas";
import CreateNote from "./screens/CreateNote";
import DetailsNote from "./screens/DetailsNote";

//opcionales
//import { LogBox } from "react-native";
//LogBox.ignoreLogs(["Warning: ..."]); //ignora los mensajes que coincidan con el array
//LogBox.ignoreAllLogs(); //ignora todas las notificaciones de mensajes

const Stack = createStackNavigator();

export default function App() {
	//con el hook useState (que agrega una var. de estado a los componentes)...)
	const [savedLogInValues, setSavedLogInValues] = useState([]); //...para almacenar los inicios de sesion guardados en una lista
	const [loadingApp, setLoadingApp] = useState(true); //...para saber si la app esta cargando, empieza siendo Verdad
	//useEffect ahce que e componenete haga algo luego de renderizarse, para llamarlo mas tarde
	useEffect(() => {
		//una vez hechos los arrays, se llama a la funcion getData
		getData();
	}, []);
	//getData
	async function getData() {
		try {
			//con getItem se recupera una cadena JSON con la clave myLogInfo
			const jsonValue = await AsyncStorage.getItem("myLogInfo");
			const jsonValue2 = JSON.parse(jsonValue); //y la recupera con parse, de cadena a objetos
			if (jsonValue2 === null) {
				setSavedLogInValues([]); //aun no hay informacion almacenada
				setLoadingApp(false); //y la app ya termino de cargar
			} else {
				setSavedLogInValues(jsonValue2); //actualiza el estado de inicio de sesion
				setLoadingApp(false);
			}
		} catch (e) {
			//sino recojo los errores con catch y los muestro en una alerta
			alert(e);
		}
	}

	if (loadingApp === true) {
		//ahora se esta cargando la app
		return (
			<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
				<Text style={{ fontSize: 25, color: "blue" }}>Loading</Text>
			</View>
		);
	}

	return (
		// container envuelve todas las vistas y stack las muestra en forma de pila/hilera
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
