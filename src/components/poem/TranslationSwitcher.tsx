import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

import { useAppSettingsStore } from "@/src/store/settings.store";
import { useAppTheme } from "@/src/hooks/use-app-themes";

export default function TranslationSwitcher() {
    const { i18n } = useTranslation();
    const colors = useAppTheme();

    const translationLanguage = useAppSettingsStore(
        (state) => state.translationLanguage,
    );
    const setTranslationLanguage = useAppSettingsStore(
        (state) => state.setTranslationLanguage,
    );

    return (
        <View style={styles.wrapper}>
            <Text style={[styles.label, { color: colors.textMuted }]}>
                {i18n.language === "ru"
                    ? "Язык перевода"
                    : "Translation language"}
            </Text>

            <View
                style={[styles.switcher, { backgroundColor: colors.surface }]}
            >
                <Pressable
                    onPress={() => setTranslationLanguage("ru")}
                    style={[
                        styles.button,
                        translationLanguage === "ru" && {
                            backgroundColor: colors.surfaceSecondary,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            { color: colors.textSecondary },
                            translationLanguage === "ru" && {
                                color: colors.textPrimary,
                            },
                        ]}
                    >
                        Русский
                    </Text>
                </Pressable>

                <Pressable
                    onPress={() => setTranslationLanguage("en")}
                    style={[
                        styles.button,
                        translationLanguage === "en" && {
                            backgroundColor: colors.surfaceSecondary,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.buttonText,
                            { color: colors.textSecondary },
                            translationLanguage === "en" && {
                                color: colors.textPrimary,
                            },
                        ]}
                    >
                        English
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 24,
    },
    label: {
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 8,
        textTransform: "uppercase",
    },
    switcher: {
        flexDirection: "row",
        borderRadius: 12,
        padding: 4,
        alignSelf: "flex-start",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: "600",
    },
});
