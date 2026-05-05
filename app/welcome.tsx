import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import type { InterfaceLanguage } from "@/src/store/settings.store";
import { useAppSettingsStore } from "@/src/store/settings.store";
import ThmrIcon from "@/assets/images/thmr.svg";
import PressableCard from "@/src/components/ui/PressableCard";

export default function WelcomeScreen() {
    const { i18n } = useTranslation();
    const completeLanguageSelection = useAppSettingsStore(
        (state) => state.completeLanguageSelection,
    );

    const handleSelectLanguage = async (language: InterfaceLanguage) => {
        await i18n.changeLanguage(language);
        completeLanguageSelection(language);
        router.replace("/poems");
    };

    return (
        <View style={styles.container}>
            <View style={styles.heroBlock}>
                <View style={styles.imagePlaceholder}>
                    <View style={styles.iconWrap}>
                        <ThmrIcon width="84" height="84" color="#9C7C38" />
                    </View>
                </View>

                <Text style={styles.title}>Elder Edda</Text>
                <Text style={styles.subtitle}>Старшая Эдда</Text>

                <Text style={styles.description}>
                    Choose interface language / Выберите язык интерфейса
                </Text>
            </View>

            <View style={styles.buttons}>
                <PressableCard
                    style={styles.button}
                    contentStyle={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => handleSelectLanguage("ru")}
                >
                    <Text style={styles.buttonText}>Русский</Text>
                </PressableCard>

                <PressableCard
                    style={styles.button}
                    contentStyle={{
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => handleSelectLanguage("en")}
                >
                    <Text style={styles.buttonText}>English</Text>
                </PressableCard>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F0F10",
        paddingHorizontal: 24,
        paddingVertical: 32,
        justifyContent: "space-between",
    },
    heroBlock: {
        alignItems: "center",
        marginTop: 48,
    },
    imagePlaceholder: {
        width: 180,
        height: 180,
        borderRadius: 24,
        backgroundColor: "#1A1A1D",
        borderWidth: 1,
        borderColor: "#2A2A2E",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 24,
    },
    imagePlaceholderText: {
        color: "#C2A878",
        fontSize: 36,
        fontWeight: "700",
        letterSpacing: 4,
    },
    title: {
        color: "#F9FAFB",
        fontSize: 32,
        fontWeight: "700",
        marginBottom: 8,
    },
    subtitle: {
        color: "#C2A878",
        fontSize: 20,
        marginBottom: 20,
    },
    description: {
        color: "#A1A1AA",
        fontSize: 16,
        lineHeight: 24,
        textAlign: "center",
        maxWidth: 280,
    },
    buttons: {
        gap: 12,
        marginBottom: 24,
    },
    button: {
        backgroundColor: "#1A1A1D",
        borderWidth: 1,
        borderColor: "#2A2A2E",
        borderRadius: 16,
        paddingVertical: 16,
        paddingHorizontal: 16,
        alignItems: "center",
    },
    buttonText: {
        color: "#F9FAFB",
        fontSize: 17,
        fontWeight: "600",
    },
    iconWrap: {
        justifyContent: "flex-end",
        alignItems: "center",
    },
});
