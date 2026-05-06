import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";

import PoemReader from "@/src/components/poem/PoemReader";
import TranslationSwitcher from "@/src/components/poem/TranslationSwitcher";
import ScreenLoader from "@/src/components/ui/ScreenLoader";
import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";
import { getPoemBySlug } from "@/src/lib/poems";
import { useAppSettingsStore } from "@/src/store/settings.store";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { getLineHeight, lineHeights, typography } from "@/src/theme/typography";

export default function PoemScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();
    const { i18n } = useTranslation();
    const { colors } = useAppTheme();
    const fontScale = useFontScale();
    const [isPreparing, setIsPreparing] = useState(true);

    const poem = typeof slug === "string" ? getPoemBySlug(slug) : null;

    const translationLanguage = useAppSettingsStore(
        (state) => state.translationLanguage,
    );

    const setLastOpenedPoem = useAppSettingsStore(
        (state) => state.setLastOpenedPoem,
    );

    useEffect(() => {
        setIsPreparing(true);

        const timeout = setTimeout(() => {
            setIsPreparing(false);
        }, 120);

        return () => clearTimeout(timeout);
    }, [slug]);

    useEffect(() => {
        if (!poem) {
            return;
        }

        setLastOpenedPoem({
            slug: poem.slug,
            titleOn: poem.title.on,
            titleRu: poem.title.ru,
            titleEn: poem.title.en,
        });
    }, [poem, setLastOpenedPoem]);

    const uiLanguage = i18n.language === "ru" ? "ru" : "en";
    const translatedTitle = poem
        ? translationLanguage === "ru"
            ? poem.title.ru
            : poem.title.en
        : "";
    const sourceText = poem ? (poem.source[translationLanguage] ?? "") : "";
    const noteText = poem ? (poem.description[translationLanguage] ?? "") : "";

    const headerComponent = useMemo(() => {
        if (!poem) {
            return null;
        }

        return (
            <View>
                <View
                    style={[
                        styles.heroCard,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.heroEyebrow,
                            {
                                color: colors.accent,
                                fontSize: typography.labelSmall * fontScale,
                            },
                        ]}
                    >
                        {uiLanguage === "ru" ? "ПОЭМА" : "POEM"}
                    </Text>

                    {/* ORIGINAL */}
                    <View style={styles.titleBlock}>
                        <Text
                            style={[
                                styles.title,
                                {
                                    color: colors.textPrimary,
                                    fontSize: typography.titleLarge * fontScale,
                                    lineHeight: getLineHeight(
                                        typography.titleLarge * fontScale,
                                        lineHeights.tight,
                                    ),
                                },
                            ]}
                        >
                            {poem.title.on}
                        </Text>

                        {!!poem.subtitle.on && (
                            <Text
                                style={[
                                    styles.originalSubtitle,
                                    {
                                        color: colors.textSecondary,
                                        fontSize:
                                            typography.bodyMedium * fontScale,
                                    },
                                ]}
                            >
                                {poem.subtitle.on}
                            </Text>
                        )}
                    </View>

                    {/* TRANSLATION */}
                    <View style={styles.translationBlock}>
                        <Text
                            style={[
                                styles.translatedTitle,
                                {
                                    color: colors.textPrimary,
                                    fontSize: typography.bodyLarge * fontScale,
                                    lineHeight: getLineHeight(
                                        typography.bodyLarge * fontScale,
                                        lineHeights.normal,
                                    ),
                                },
                            ]}
                        >
                            {translatedTitle}
                        </Text>

                        {!!poem.subtitle[translationLanguage] && (
                            <Text
                                style={[
                                    styles.translatedSubtitle,
                                    {
                                        color: colors.textMuted,
                                        fontSize:
                                            typography.bodySmall * fontScale,
                                    },
                                ]}
                            >
                                {poem.subtitle[translationLanguage]}
                            </Text>
                        )}
                    </View>
                </View>

                {!!sourceText && (
                    <View
                        style={[
                            styles.metaCard,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.metaLabel,
                                {
                                    color: colors.textMuted,
                                    fontSize: typography.labelSmall * fontScale,
                                },
                            ]}
                        >
                            {uiLanguage === "ru" ? "ИСТОЧНИК" : "SOURCE"}
                        </Text>

                        <Text
                            style={[
                                styles.metaText,
                                {
                                    color: colors.textSecondary,
                                    fontSize: typography.bodySmall * fontScale,
                                    lineHeight: getLineHeight(
                                        typography.bodySmall * fontScale,
                                        lineHeights.relaxed,
                                    ),
                                },
                            ]}
                        >
                            {sourceText}
                        </Text>
                    </View>
                )}

                {!!noteText && (
                    <View
                        style={[
                            styles.metaCard,
                            {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.metaLabel,
                                {
                                    color: colors.textMuted,
                                    fontSize: typography.labelSmall * fontScale,
                                },
                            ]}
                        >
                            {uiLanguage === "ru" ? "ПРИМЕЧАНИЯ" : "NOTES"}
                        </Text>

                        <Text
                            style={[
                                styles.metaText,
                                {
                                    color: colors.textSecondary,
                                    fontSize: typography.bodySmall * fontScale,
                                    lineHeight: getLineHeight(
                                        typography.bodySmall * fontScale,
                                        lineHeights.relaxed,
                                    ),
                                },
                            ]}
                        >
                            {noteText}
                        </Text>
                    </View>
                )}

                <TranslationSwitcher />
            </View>
        );
    }, [
        colors.accent,
        colors.border,
        colors.surface,
        colors.textMuted,
        colors.textPrimary,
        colors.textSecondary,
        fontScale,
        poem,
        sourceText,
        translatedTitle,
        uiLanguage,
    ]);

    if (!poem) {
        return (
            <View
                style={[
                    styles.centered,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <Text
                    style={[
                        styles.notFoundText,
                        {
                            color: colors.textPrimary,
                            fontSize: typography.bodyMedium * fontScale,
                        },
                    ]}
                >
                    Poem not found
                </Text>
            </View>
        );
    }

    if (isPreparing) {
        return (
            <ScreenLoader
                label={
                    i18n.language === "ru"
                        ? "Загрузка поэмы..."
                        : "Loading poem..."
                }
            />
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: poem.title.on,
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.textPrimary,
                    headerShadowVisible: false,
                }}
            />

            <View
                style={[
                    styles.screen,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
            >
                <PoemReader poem={poem} ListHeaderComponent={headerComponent} />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    notFoundText: {},

    heroCard: {
        borderWidth: 1,
        borderRadius: radius.xl,
        padding: spacing.xxl,
        marginBottom: spacing.lg,
    },

    heroEyebrow: {
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: spacing.sm,
    },

    title: {
        fontWeight: "700",
        marginBottom: spacing.xs,
    },

    subtitle: {
        maxWidth: 680,
    },

    subtitleText: {
        fontWeight: "700",
        fontSize: typography.bodySmall,
        marginBottom: spacing.xs,
    },

    metaCard: {
        borderWidth: 1,
        borderRadius: radius.lg,
        padding: spacing.xl,
        marginBottom: spacing.lg,
    },

    metaLabel: {
        fontWeight: "700",
        letterSpacing: 1,
        marginBottom: spacing.sm,
    },
    metaText: {},

    titleBlock: {
        marginBottom: spacing.lg,
    },

    translationBlock: {
        paddingTop: spacing.md,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.08)",
    },

    originalSubtitle: {
        marginTop: spacing.xs,
        fontStyle: "italic",
    },

    translatedTitle: {
        fontWeight: "600",
    },

    translatedSubtitle: {
        marginTop: spacing.xs,
        lineHeight: 22,
    },
});
