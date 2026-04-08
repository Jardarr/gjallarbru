import React from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";
import {
    useAppSettingsStore,
    type AppTheme,
    type FontSizeScale,
    type InterfaceLanguage,
    type TranslationLanguage,
} from "@/src/store/settings.store";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import i18n from "@/src/i18n";

interface SettingsOptionButtonProps {
    label: string;
    isActive: boolean;
    onPress: () => void;
    colors: ReturnType<typeof useAppTheme>;
    fontScale: number;
}

function SettingsOptionButton({
    label,
    isActive,
    onPress,
    colors,
    fontScale,
}: SettingsOptionButtonProps) {
    return (
        <Pressable
            onPress={onPress}
            style={[
                styles.optionButton,
                {
                    backgroundColor: colors.surfaceSecondary,
                    borderColor: colors.border,
                },
                isActive && {
                    backgroundColor: colors.surfaceTertiary,
                    borderColor: colors.accent,
                },
            ]}
        >
            <Text
                style={[
                    styles.optionButtonText,
                    {
                        color: isActive
                            ? colors.textPrimary
                            : colors.textSecondary,
                        fontSize: typography.labelLarge * fontScale,
                    },
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

interface SettingsSectionProps {
    title: string;
    description?: string;
    colors: ReturnType<typeof useAppTheme>;
    fontScale: number;
    children: React.ReactNode;
}

function SettingsSection({
    title,
    description,
    colors,
    fontScale,
    children,
}: SettingsSectionProps) {
    return (
        <View
            style={[
                styles.sectionCard,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                },
            ]}
        >
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: colors.textPrimary,
                        fontSize: typography.titleSmall * fontScale,
                    },
                ]}
            >
                {title}
            </Text>

            {!!description && (
                <Text
                    style={[
                        styles.sectionDescription,
                        {
                            color: colors.textSecondary,
                            fontSize: typography.bodySmall * fontScale,
                            lineHeight: 22 * fontScale,
                        },
                    ]}
                >
                    {description}
                </Text>
            )}

            <View style={styles.sectionContent}>{children}</View>
        </View>
    );
}

export default function SettingsScreen() {
    const { i18n } = useTranslation();
    const colors = useAppTheme();
    const fontScale = useFontScale();
    const uiLanguage = i18n.language === "ru" ? "ru" : "en";

    const interfaceLanguage = useAppSettingsStore(
        (state) => state.interfaceLanguage,
    );
    const translationLanguage = useAppSettingsStore(
        (state) => state.translationLanguage,
    );
    const interfaceTheme = useAppSettingsStore((state) => state.interfaceTheme);
    const textSizeScale = useAppSettingsStore((state) => state.fontSizeScale);

    const setInterfaceLanguage = useAppSettingsStore(
        (state) => state.setInterfaceLanguage,
    );
    const setTranslationLanguage = useAppSettingsStore(
        (state) => state.setTranslationLanguage,
    );
    const setInterfaceTheme = useAppSettingsStore(
        (state) => state.setInterfaceTheme,
    );
    const setFontSizeScale = useAppSettingsStore(
        (state) => state.setFontSizeScale,
    );
    const resetSettings = useAppSettingsStore((state) => state.resetSettings);

    const handleInterfaceLanguageChange = async (
        language: InterfaceLanguage,
    ) => {
        setInterfaceLanguage(language);
        await i18n.changeLanguage(language);
    };

    const handleTranslationLanguageChange = (language: TranslationLanguage) => {
        setTranslationLanguage(language);
    };

    const handleThemeChange = (theme: AppTheme) => {
        setInterfaceTheme(theme);
    };

    const handleFontSizeChange = (scale: FontSizeScale) => {
        setFontSizeScale(scale);
    };

    const handleReset = async () => {
        resetSettings();
        await i18n.changeLanguage("ru");
    };

    return (
        <>
            <Stack.Screen
                options={{
                    title: uiLanguage === "ru" ? "Настройки" : "Settings",
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.textPrimary,
                    headerShadowVisible: false,
                }}
            />

            <ScrollView
                style={{ backgroundColor: colors.background }}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <SettingsSection
                    title={uiLanguage === "ru" ? "Язык" : "Language"}
                    description={
                        uiLanguage === "ru"
                            ? "Выбери язык интерфейса и язык отображаемого перевода."
                            : "Choose the interface language and the displayed translation language."
                    }
                    colors={colors}
                    fontScale={fontScale}
                >
                    <View style={styles.groupBlock}>
                        <Text
                            style={[
                                styles.groupLabel,
                                {
                                    color: colors.textMuted,
                                    fontSize: typography.labelSmall * fontScale,
                                },
                            ]}
                        >
                            {uiLanguage === "ru"
                                ? "Язык интерфейса"
                                : "Interface language"}
                        </Text>

                        <View style={styles.optionsRow}>
                            <SettingsOptionButton
                                label="Русский"
                                isActive={interfaceLanguage === "ru"}
                                onPress={() =>
                                    handleInterfaceLanguageChange("ru")
                                }
                                colors={colors}
                                fontScale={fontScale}
                            />
                            <SettingsOptionButton
                                label="English"
                                isActive={interfaceLanguage === "en"}
                                onPress={() =>
                                    handleInterfaceLanguageChange("en")
                                }
                                colors={colors}
                                fontScale={fontScale}
                            />
                        </View>
                    </View>

                    <View style={styles.groupBlock}>
                        <Text
                            style={[
                                styles.groupLabel,
                                {
                                    color: colors.textMuted,
                                    fontSize: typography.labelSmall * fontScale,
                                },
                            ]}
                        >
                            {uiLanguage === "ru"
                                ? "Язык перевода"
                                : "Translation language"}
                        </Text>

                        <View style={styles.optionsRow}>
                            <SettingsOptionButton
                                label="Русский"
                                isActive={translationLanguage === "ru"}
                                onPress={() =>
                                    handleTranslationLanguageChange("ru")
                                }
                                colors={colors}
                                fontScale={fontScale}
                            />
                            <SettingsOptionButton
                                label="English"
                                isActive={translationLanguage === "en"}
                                onPress={() =>
                                    handleTranslationLanguageChange("en")
                                }
                                colors={colors}
                                fontScale={fontScale}
                            />
                        </View>
                    </View>
                </SettingsSection>

                <SettingsSection
                    title={uiLanguage === "ru" ? "Размер текста" : "Reading"}
                    description={
                        uiLanguage === "ru"
                            ? "Настрой комфортный размер текста для чтения поэм."
                            : "Choose a comfortable text size for reading poems."
                    }
                    colors={colors}
                    fontScale={fontScale}
                >
                    <View style={styles.groupBlock}>
                        <Text
                            style={[
                                styles.groupLabel,
                                {
                                    color: colors.textMuted,
                                    fontSize: typography.labelSmall * fontScale,
                                },
                            ]}
                        >
                            {uiLanguage === "ru"
                                ? "Размер текста"
                                : "Text size"}
                        </Text>

                        <View style={styles.optionsRow}>
                            <SettingsOptionButton
                                label={uiLanguage === "ru" ? "Малый" : "Small"}
                                isActive={textSizeScale === 1}
                                onPress={() => handleFontSizeChange(1)}
                                colors={colors}
                                fontScale={fontScale}
                            />
                            <SettingsOptionButton
                                label={
                                    uiLanguage === "ru" ? "Средний" : "Medium"
                                }
                                isActive={textSizeScale === 1.1}
                                onPress={() => handleFontSizeChange(1.1)}
                                colors={colors}
                                fontScale={fontScale}
                            />
                            <SettingsOptionButton
                                label={
                                    uiLanguage === "ru" ? "Крупный" : "Large"
                                }
                                isActive={textSizeScale === 1.2}
                                onPress={() => handleFontSizeChange(1.2)}
                                colors={colors}
                                fontScale={fontScale}
                            />
                        </View>
                    </View>
                </SettingsSection>

                <SettingsSection
                    title={uiLanguage === "ru" ? "Внешний вид" : "Appearance"}
                    description={
                        uiLanguage === "ru"
                            ? "Выбери тему интерфейса, которая тебе комфортнее."
                            : "Choose the interface theme that feels most comfortable."
                    }
                    colors={colors}
                    fontScale={fontScale}
                >
                    <View style={styles.groupBlock}>
                        <Text
                            style={[
                                styles.groupLabel,
                                {
                                    color: colors.textMuted,
                                    fontSize: typography.labelSmall * fontScale,
                                },
                            ]}
                        >
                            {uiLanguage === "ru"
                                ? "Тема интерфейса"
                                : "Interface theme"}
                        </Text>

                        <View style={styles.optionsRow}>
                            <SettingsOptionButton
                                label={uiLanguage === "ru" ? "Тёмная" : "Dark"}
                                isActive={interfaceTheme === "dark"}
                                onPress={() => handleThemeChange("dark")}
                                colors={colors}
                                fontScale={fontScale}
                            />
                            <SettingsOptionButton
                                label={
                                    uiLanguage === "ru" ? "Светлая" : "Light"
                                }
                                isActive={interfaceTheme === "light"}
                                onPress={() => handleThemeChange("light")}
                                colors={colors}
                                fontScale={fontScale}
                            />
                        </View>
                    </View>
                </SettingsSection>

                <View
                    style={[
                        styles.resetCard,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.resetTitle,
                            {
                                color: colors.textPrimary,
                                fontSize: typography.titleSmall * fontScale,
                            },
                        ]}
                    >
                        {uiLanguage === "ru"
                            ? "Сброс настроек"
                            : "Reset settings"}
                    </Text>

                    <Text
                        style={[
                            styles.resetDescription,
                            {
                                color: colors.textSecondary,
                                fontSize: typography.bodySmall * fontScale,
                                lineHeight: 22 * fontScale,
                            },
                        ]}
                    >
                        {uiLanguage === "ru"
                            ? "Вернуть язык, тему, размер текста и стартовый экран выбора языка к исходному состоянию."
                            : "Restore language, theme, text size, and the initial language selection screen to their default state."}
                    </Text>

                    <Pressable
                        onPress={handleReset}
                        style={[
                            styles.resetButton,
                            {
                                backgroundColor: colors.surfaceSecondary,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.resetButtonText,
                                {
                                    color: colors.textPrimary,
                                    fontSize: typography.labelLarge * fontScale,
                                },
                            ]}
                        >
                            {uiLanguage === "ru"
                                ? "Сбросить настройки"
                                : "Reset settings"}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.huge,
    },
    headerBlock: {
        marginBottom: spacing.xxl,
    },
    screenTitle: {
        fontWeight: "700",
        marginBottom: spacing.xs,
    },
    screenSubtitle: {
        maxWidth: 620,
    },
    sectionCard: {
        borderWidth: 1,
        borderRadius: radius.xl,
        padding: spacing.xxl,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontWeight: "700",
        marginBottom: spacing.xs,
    },
    sectionDescription: {
        marginBottom: spacing.lg,
    },
    sectionContent: {
        gap: spacing.lg,
    },
    groupBlock: {
        gap: spacing.sm,
    },
    groupLabel: {
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    optionsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: spacing.sm,
    },
    optionButton: {
        borderWidth: 1,
        borderRadius: radius.lg,
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    optionButtonText: {
        fontWeight: "600",
    },
    resetCard: {
        borderWidth: 1,
        borderRadius: radius.xl,
        padding: spacing.xxl,
        marginTop: spacing.sm,
    },
    resetTitle: {
        fontWeight: "700",
        marginBottom: spacing.xs,
    },
    resetDescription: {
        marginBottom: spacing.lg,
    },
    resetButton: {
        borderWidth: 1,
        borderRadius: radius.lg,
        paddingVertical: 14,
        paddingHorizontal: 16,
        alignItems: "center",
    },
    resetButtonText: {
        fontWeight: "700",
    },
});
