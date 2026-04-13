import React from "react";
import {
    Linking,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import Constants from "expo-constants";

interface AboutSectionProps {
    title: string;
    children: React.ReactNode;
}

function AboutSection({ title, children }: AboutSectionProps) {
    const { colors } = useAppTheme();
    const fontScale = useFontScale();
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

            <View style={styles.sectionContent}>{children}</View>
        </View>
    );
}

function AboutParagraph({ children }: { children: React.ReactNode }) {
    const { colors } = useAppTheme();
    const fontScale = useFontScale();

    return (
        <Text
            style={[
                styles.paragraph,
                {
                    color: colors.textSecondary,
                    fontSize: typography.bodyMedium * fontScale,
                    lineHeight: 26 * fontScale,
                },
            ]}
        >
            {children}
        </Text>
    );
}

export default function AboutScreen() {
    const { i18n } = useTranslation();
    const { colors } = useAppTheme();
    const fontScale = useFontScale();
    const appVersion = Constants.expoConfig?.version ?? "1.0.0";
    const uiLanguage = i18n.language === "ru" ? "ru" : "en";
    return (
        <>
            <Stack.Screen
                options={{
                    title: uiLanguage === "ru" ? "О приложении" : "About",
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
                <View style={styles.headerBlock}>
                    <Text
                        style={[
                            styles.screenSubtitle,
                            {
                                color: colors.textSecondary,
                                fontSize: typography.bodyMedium * fontScale,
                                lineHeight: 24 * fontScale,
                            },
                        ]}
                    >
                        {uiLanguage === "ru"
                            ? "Чтение древнеисландских поэм с параллельным отображением оригинала и перевода."
                            : "A digital reading experience for Old Norse poems with parallel display of the original text and translation."}
                    </Text>
                </View>

                <AboutSection
                    title={uiLanguage === "ru" ? "Проект" : "Project"}
                >
                    <AboutParagraph>
                        {uiLanguage === "ru"
                            ? "Это офлайн-приложение для чтения древнеисландских поэм с параллельным показом оригинального текста и перевода. Проект задуман как удобное пространство для чтения, сопоставления и внимательной работы с поэтическим материалом."
                            : "This is an offline reading app for Old Norse poems with parallel display of the original text and translation. The project is designed as a comfortable space for reading, comparison, and close engagement with poetic material."}
                    </AboutParagraph>
                </AboutSection>

                <AboutSection
                    title={uiLanguage === "ru" ? "Как читать" : "How to read"}
                >
                    <AboutParagraph>
                        {uiLanguage === "ru"
                            ? "Слева отображается текст на древнеисландском языке. Справа — перевод на русский или английский. Для прозаических фрагментов текст показывается последовательно, один блок под другим, чтобы сохранить удобочитаемость."
                            : "The Old Norse text is shown on the left. On the right, you see either the Russian or English translation. Prose passages are displayed sequentially, one block under another, to preserve readability."}
                    </AboutParagraph>
                </AboutSection>

                <AboutSection
                    title={
                        uiLanguage === "ru"
                            ? "О переводах"
                            : "About the translations"
                    }
                >
                    <AboutParagraph>
                        {uiLanguage === "ru"
                            ? "Переводы в этом проекте не являются буквальными подстрочниками. Во многих местах переводчики сохраняют ритм, образность и поэтическое звучание, поэтому формулировки могут заметно отличаться от оригинала."
                            : "The translations in this project are not intended as literal interlinear renderings. In many places, translators preserve rhythm, imagery, and poetic sound, so the wording may differ noticeably from the original."}
                    </AboutParagraph>

                    <AboutParagraph>
                        {uiLanguage === "ru"
                            ? "Из-за различий между переводами границы стихотворных и прозаических блоков иногда не совпадают полностью. Это нормальная особенность поэтической традиции и переводческой практики."
                            : "Because different translations follow different editorial and poetic choices, the boundaries between stanza and prose blocks do not always align perfectly. This is a natural feature of poetic tradition and translation practice."}
                    </AboutParagraph>
                </AboutSection>

                <AboutSection
                    title={uiLanguage === "ru" ? "Источники" : "Sources"}
                >
                    <AboutParagraph>
                        {uiLanguage === "ru"
                            ? "Тексты и метаданные в приложении основаны на подготовленных редакторских материалах. Источники и справочная информация отображаются на экране конкретной поэмы в блоке «Источник»."
                            : "The texts and metadata in the app are based on prepared editorial materials. Sources and reference information are shown on each poem screen in the “Source” block."}
                    </AboutParagraph>
                </AboutSection>

                <AboutSection
                    title={
                        uiLanguage === "ru" ? "Офлайн-режим" : "Offline mode"
                    }
                >
                    <AboutParagraph>
                        {uiLanguage === "ru"
                            ? "Приложение не требует постоянного подключения к интернету: тексты, переводы и основные настройки доступны локально на устройстве."
                            : "The app does not require a constant internet connection: texts, translations, and core settings are available locally on the device."}
                    </AboutParagraph>
                </AboutSection>

                <AboutSection
                    title={
                        uiLanguage === "ru"
                            ? "Версия приложения"
                            : "App version"
                    }
                >
                    <AboutParagraph>
                        {uiLanguage === "ru"
                            ? `Текущая версия: ${appVersion}`
                            : `Current version: ${appVersion}`}
                    </AboutParagraph>
                </AboutSection>

                <View style={styles.footer}>
                    <Text
                        style={[
                            styles.footerText,
                            {
                                color: colors.textMuted,
                                fontSize: typography.bodySmall * fontScale,
                            },
                        ]}
                    >
                        jrdrr
                    </Text>

                    <Pressable
                        onPress={() =>
                            Linking.openURL("https://github.com/Jardarr")
                        }
                        style={({ pressed }) => [
                            styles.footerLink,
                            {
                                opacity: pressed ? 0.6 : 1,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.footerLinkText,
                                {
                                    color: colors.accentSoft,
                                    fontSize: typography.bodySmall * fontScale,
                                },
                            ]}
                        >
                            github.com/Jardarr
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
        paddingTop: spacing.xl,
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
        maxWidth: 700,
    },
    sectionCard: {
        borderWidth: 1,
        borderRadius: radius.xl,
        padding: spacing.xxl,
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        fontWeight: "700",
        marginBottom: spacing.md,
    },
    sectionContent: {
        gap: spacing.md,
    },
    paragraph: {},
    footer: {
        marginTop: spacing.xxl,
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
    },
    footerText: {
        textAlign: "center",
        fontWeight: "500",
    },
    footerLink: {},
    footerLinkText: {
        textAlign: "center",
        textDecorationLine: "underline",
    },
});
