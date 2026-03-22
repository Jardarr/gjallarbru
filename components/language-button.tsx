import { View, Button, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";

export default function LanguageButton() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
	};

	return (
		<View style={styles.container}>
			<Button title="EN" onPress={() => changeLanguage("en")} />
			<Button title="RU" onPress={() => changeLanguage("ru")} />
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		gap: 10,
		marginTop: 20,
	},
});
