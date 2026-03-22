/* eslint-disable import/no-named-as-default-member */
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as Localization from "expo-localization";

import en from "./locales/en.json";
import ru from "./locales/ru.json";

const locales = Localization.getLocales()
const deviceLanguage = locales[0]?.languageCode || 'en'

i18n.use(initReactI18next).init({
	compatibilityJSON: "v3",
	lng: deviceLanguage, // текущий язык
	fallbackLng: "en", // если нет перевода

	resources: {
		en: { translation: en },
		ru: { translation: ru },
	},

	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
