import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next";

import { useAppSettingsStore } from "@/src/store/settings.store";

export default function IndexScreen() {
	const { i18n } = useTranslation();

	const [isI18nReady, setIsI18nReady] = useState(false);

	const hasSelectedInterfaceLanguage = useAppSettingsStore((state) => state.hasSelectedInterfaceLanguage);

	const interfaceLanguage = useAppSettingsStore((state) => state.interfaceLanguage);

	useEffect(() => {
		const syncLanguage = async () => {
			if (hasSelectedInterfaceLanguage && interfaceLanguage) {
				if (i18n.language !== interfaceLanguage) {
					await i18n.changeLanguage(interfaceLanguage);
				}
			}

			setIsI18nReady(true);
		};

		syncLanguage();
	}, [hasSelectedInterfaceLanguage, interfaceLanguage, i18n]);

	if (!isI18nReady) {
		return null;
	}

	if (hasSelectedInterfaceLanguage && interfaceLanguage) {
		return <Redirect href="/poems" />;
	}

	return <Redirect href="/welcome" />;
}