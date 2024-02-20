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
import { ListItem, Avatar } from "@rneui/themed";
import { ListItemChevron } from "@rneui/base/dist/ListItem/ListItem.Chevron";
import { ListItemContent } from "@rneui/base/dist/ListItem/ListItem.Content";
import { ListItemTitle } from "@rneui/base/dist/ListItem/ListItem.Title";
import { ListItemSubtitle } from "@rneui/base/dist/ListItem/ListItem.Subtitle";
import app from "../firebase";

const db = getFirestore(app);

export default function Notas(props) {
	const [lista, setLista] = useState([]);

	//logica para llamar la lista de documentos
	useEffect(() => {
		const getLista = async () => {
			try {
				const querySnapshot = await getDocs(collection(db, "notas"));
				const docs = [];
				querySnapshot.forEach((doc) => {
					const { titulo, detalle, fecha, hora } = doc.data();
					docs.push({
						id: doc.id,
						titulo,
						detalle,
						fecha,
						hora,
					});
				});
				setLista(docs);
			} catch (error) {
				console.log(error);
			}
		};
		getLista();
	}, [lista]);

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
				{lista.map((not) => (
					<ListItem
						bottomDivider
						key={not.id}
						onPress={() => {
							props.navigation.navigate("Detail", {
								notaId: not.id,
							});
						}}>
						<ListItemChevron />

						<ListItemContent>
							<ListItemTitle style={styles.titulo}>{not.titulo}</ListItemTitle>
							<ListItemSubtitle>{not.fecha}</ListItemSubtitle>
						</ListItemContent>
					</ListItem>
				))}
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	boton: {
		backgroundColor: "#B71375",
		borderColor: "#FC4F00",
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
