import React, { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next";

import ScreenLoader from "@/src/components/ui/ScreenLoader";
import { useAppSettingsStore } from "@/src/store/settings.store";

export default function IndexScreen() {
	const { i18n } = useTranslation();

	const [isStoreHydrated, setIsStoreHydrated] = useState(() =>
		useAppSettingsStore.persist.hasHydrated(),
	);
	const [isI18nReady, setIsI18nReady] = useState(false);

	const hasSelectedInterfaceLanguage = useAppSettingsStore((state) => state.hasSelectedInterfaceLanguage);

	const interfaceLanguage = useAppSettingsStore((state) => state.interfaceLanguage);

	useEffect(() => {
		const unsubscribe = useAppSettingsStore.persist.onFinishHydration(() => {
			setIsStoreHydrated(true);
		});

		if (useAppSettingsStore.persist.hasHydrated()) {
			setIsStoreHydrated(true);
		}

		return unsubscribe;
	}, []);

	useEffect(() => {
		if (!isStoreHydrated) {
			return;
		}

		const syncLanguage = async () => {
			try {
				if (hasSelectedInterfaceLanguage && interfaceLanguage) {
					if (i18n.language !== interfaceLanguage) {
						await i18n.changeLanguage(interfaceLanguage);
					}
				}
			} finally {
				setIsI18nReady(true);
			}
		};

		setIsI18nReady(false);
		syncLanguage();
	}, [hasSelectedInterfaceLanguage, interfaceLanguage, i18n, isStoreHydrated]);

	if (!isStoreHydrated || !isI18nReady) {
		return <ScreenLoader label="Loading..." />;
	}

	if (hasSelectedInterfaceLanguage && interfaceLanguage) {
		return <Redirect href="/poems" />;
	}

	return <Redirect href="/welcome" />;
}
