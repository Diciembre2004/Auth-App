import React, { useState, useEffect } from "react";
import {
	Text,
	StyleSheet,
	View,
	ScrollView,
	TouchableOpacity,
} from "react-native";

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
import { ListItem } from "@rneui/themed";
import { ListItemChevron } from "@rneui/base/dist/ListItem/ListItem.Chevron";
import { ListItemContent } from "@rneui/base/dist/ListItem/ListItem.Content";
import { ListItemTitle } from "@rneui/base/dist/ListItem/ListItem.Title";
import { ListItemSubtitle } from "@rneui/base/dist/ListItem/ListItem.Subtitle";
import app from "../firebase";

const db = getFirestore(app);

export default function Notas(props) {
	const [lista, setLista] = useState([]); //estado de lista y con setlista que la actualiza

	//logica para llamar la lista de documentos
	useEffect(() => {
		const getLista = async () => {
			//debe ser asincornico para evitar los bloqueos y otras partes del codigo funcionen normalmente
			try {
				const querySnapshot = await getDocs(collection(db, "notas")); //de firestore agarra coleccion llamado notas. Lo guarda todo en querySnapshot
				const docs = [];
				querySnapshot.forEach((doc) => {
					//recorrido con forearch de cada doc que se guardo en querySnapshot
					const { titulo, detalle, fecha, hora } = doc.data(); //y de ahi se extraen
					docs.push({
						id: doc.id,
						titulo,
						detalle,
						fecha,
						hora,
					});
				});
				setLista(docs); //y se llama a setLista para se actualice agregando el nuevo doc
			} catch (error) {
				console.log(error);
			}
		};
		getLista();
	}, [lista]); //se ejecuta lo de arriba cada vez que cambie gracias a useEffect

	return (
		<ScrollView>
			<View>
				<TouchableOpacity
					style={styles.boton}
					onPress={() => props.navigation.navigate("Crear")}>
					<Text style={styles.textoBoton}>Agregar una nueva nota</Text>
				</TouchableOpacity>
			</View>

			<View style={styles.contenedor}>
				{lista.map(
					(
						not //map itera en cada elemento de lista y los guarda en una not(a)
					) => (
						<ListItem //cada listitem representa una nota
							bottomDivider
							key={not.id}
							onPress={() => {
								props.navigation.navigate("Detail", {
									notaId: not.id,
								});
							}}>
							<ListItemChevron /> {/* una flecha */}
							<ListItemContent>
								<ListItemTitle style={styles.titulo}>
									{not.titulo}
								</ListItemTitle>
								<ListItemSubtitle>{not.fecha}</ListItemSubtitle>
							</ListItemContent>
						</ListItem>
					)
				)}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	boton: {
		backgroundColor: "#B71375",
		borderWidth: 3,
		borderRadius: 20,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
	},
	textoBoton: {
		textAlign: "center",
		padding: 10,
		color: "white",
		fontSize: 16,
	},
	contenedor: {
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
	titulo: {
		fontWeight: "bold",
	},
});
