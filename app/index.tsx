import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { useTranslation } from "react-i18next";

import { useAppSettingsStore } from "@/src/store/settings.store";

export default function IndexScreen() {
    const { i18n } = useTranslation();

    const [isHydrated, setIsHydrated] = useState(
        useAppSettingsStore.persist.hasHydrated()
    );
    const [isI18nReady, setIsI18nReady] = useState(false);

    const hasSelectedInterfaceLanguage = useAppSettingsStore(
        (state) => state.hasSelectedInterfaceLanguage
    );
    const interfaceLanguage = useAppSettingsStore(
        (state) => state.interfaceLanguage
    );

    useEffect(() => {
        const unsubscribe = useAppSettingsStore.persist.onFinishHydration(() => {
            setIsHydrated(true);
        });

        if (useAppSettingsStore.persist.hasHydrated()) {
            setIsHydrated(true);
        }

        return unsubscribe;
    }, []);

    useEffect(() => {
        const syncLanguage = async () => {
            if (!isHydrated) {
                return;
            }

            if (hasSelectedInterfaceLanguage && interfaceLanguage) {
                if (i18n.language !== interfaceLanguage) {
                    await i18n.changeLanguage(interfaceLanguage);
                }
            }

            setIsI18nReady(true);
        };

        syncLanguage();
    }, [isHydrated, hasSelectedInterfaceLanguage, interfaceLanguage, i18n]);

    if (!isHydrated || !isI18nReady) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#C2A878" />
            </View>
        );
    }

    if (hasSelectedInterfaceLanguage && interfaceLanguage) {
        return <Redirect href="/welcome" />;
    }

    return <Redirect href="/welcome" />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F0F10",
        alignItems: "center",
        justifyContent: "center",
    },
});