import { router, Stack } from "expo-router";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PressableCard from "@/src/components/ui/PressableCard";
import { poemCategoryMeta } from "@/src/constants/poem-category-meta";
import type { PoemCategory } from "@/src/constants/poem-categories";
import { poems } from "@/src/data/poems";
import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";
import { normalizeSearchValue } from "@/src/lib/search";
import { useAppSettingsStore } from "@/src/store/settings.store";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import type { PoemBlock, PoemData } from "@/src/types/poem";

interface SearchIndexEntry {
    poemSlug: string;

    poemTitleOn: string;
    poemTitleRu: string;
    poemTitleEn: string;

    category: PoemCategory;

    blockId: string;
    blockType: PoemBlock["type"];

    language: "on" | "ru" | "en";

    snippet: string;
    normalizedSnippet: string;
}

export default function SearchScreen() {
    const { colors } = useAppTheme();
    const fontScale = useFontScale();

    const interfaceLanguage =
        useAppSettingsStore((state) => state.interfaceLanguage) ?? "en";

    const [query, setQuery] = useState("");

    const searchIndex = useMemo<SearchIndexEntry[]>(() => {
        return poems.flatMap((poem: PoemData) => {
            const entries: SearchIndexEntry[] = [];

            const languages: Array<"on" | "ru" | "en"> = ["on", "ru", "en"];

            languages.forEach((language) => {
                const blocks = poem.texts[language];

                if (!blocks?.length) {
                    return;
                }

                blocks.forEach((block) => {
                    if (!block) {
                        return;
                    }
                    const snippet = block.lines
                        .filter(Boolean)
                        .join(" ")
                        .trim();

                    if (!snippet) {
                        return;
                    }

                    entries.push({
                        poemSlug: poem.slug,

                        poemTitleOn: poem.title.on,
                        poemTitleRu: poem.title.ru,
                        poemTitleEn: poem.title.en || poem.title.on,

                        category: poem.category,

                        blockId: block.id,
                        blockType: block.type,

                        language,

                        snippet,
                        normalizedSnippet: normalizeSearchValue(snippet),
                    });
                });
            });

            return entries;
        });
    }, []);

    const normalizedQuery = normalizeSearchValue(query);

    const results = useMemo(() => {
        if (!normalizedQuery) {
            return [];
        }

        return searchIndex
            .filter((entry) =>
                entry.normalizedSnippet.includes(normalizedQuery),
            )
            .slice(0, 120);
    }, [normalizedQuery, searchIndex]);

    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />

            <SafeAreaView
                style={[
                    styles.screen,
                    {
                        backgroundColor: colors.background,
                    },
                ]}
                edges={["top"]}
            >
                <View
                    style={[
                        styles.header,
                        {
                            borderBottomColor: colors.border,
                        },
                    ]}
                >
                    <Pressable
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Text
                            style={[
                                styles.backButtonText,
                                {
                                    color: colors.accent,
                                    fontSize: typography.bodyLarge * fontScale,
                                },
                            ]}
                        >
                            ←
                        </Text>
                    </Pressable>

                    <Text
                        style={[
                            styles.headerTitle,
                            {
                                color: colors.textPrimary,
                                fontSize: typography.titleSmall * fontScale,
                            },
                        ]}
                    >
                        {interfaceLanguage === "ru"
                            ? "Поиск по текстам"
                            : "Text Search"}
                    </Text>
                </View>

                <View
                    style={[
                        styles.searchContainer,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <TextInput
                        value={query}
                        onChangeText={setQuery}
                        autoCorrect={false}
                        autoCapitalize="none"
                        placeholder={
                            interfaceLanguage === "ru"
                                ? "Поиск по текстам..."
                                : "Search texts..."
                        }
                        placeholderTextColor={colors.textMuted}
                        style={[
                            styles.searchInput,
                            {
                                color: colors.textPrimary,
                                fontSize: typography.bodyMedium * fontScale,
                            },
                        ]}
                    />

                    {!!query && (
                        <Pressable
                            onPress={() => setQuery("")}
                            style={[
                                styles.clearButton,
                                {
                                    backgroundColor: colors.surfaceSecondary,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.clearButtonText,
                                    {
                                        color: colors.textSecondary,
                                    },
                                ]}
                            >
                                ✕
                            </Text>
                        </Pressable>
                    )}
                </View>

                {!normalizedQuery ? (
                    <View style={styles.emptySearchState}>
                        <Text
                            style={[
                                styles.emptySearchTitle,
                                {
                                    color: colors.textPrimary,
                                    fontSize: typography.bodyLarge * fontScale,
                                },
                            ]}
                        >
                            {interfaceLanguage === "ru"
                                ? "Начни поиск"
                                : "Start searching"}
                        </Text>

                        <Text
                            style={[
                                styles.emptySearchText,
                                {
                                    color: colors.textSecondary,
                                    fontSize: typography.bodyMedium * fontScale,
                                },
                            ]}
                        >
                            {interfaceLanguage === "ru"
                                ? "Ищи слова, имена, строки и руны во всех поэмах."
                                : "Search words, names, lines, and runes across all poems."}
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={results}
                        keyExtractor={(item, index) =>
                            `${item.poemSlug}-${item.blockId}-${index}`
                        }
                        contentContainerStyle={styles.resultsContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View
                                style={[
                                    styles.emptyResults,
                                    {
                                        backgroundColor: colors.surface,
                                        borderColor: colors.border,
                                    },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.emptyResultsTitle,
                                        {
                                            color: colors.textPrimary,
                                            fontSize:
                                                typography.bodyLarge *
                                                fontScale,
                                        },
                                    ]}
                                >
                                    {interfaceLanguage === "ru"
                                        ? "Ничего не найдено"
                                        : "Nothing found"}
                                </Text>

                                <Text
                                    style={[
                                        styles.emptyResultsText,
                                        {
                                            color: colors.textSecondary,
                                            fontSize:
                                                typography.bodyMedium *
                                                fontScale,
                                        },
                                    ]}
                                >
                                    {interfaceLanguage === "ru"
                                        ? "Попробуй изменить поисковый запрос."
                                        : "Try another search query."}
                                </Text>
                            </View>
                        }
                        renderItem={({ item }) => {
                            const categoryMeta =
                                poemCategoryMeta[item.category];

                            const translatedTitle =
                                interfaceLanguage === "ru"
                                    ? item.poemTitleRu
                                    : item.poemTitleEn;

                            return (
                                <PressableCard
                                    style={[
                                        styles.resultCard,
                                        {
                                            backgroundColor: colors.surface,
                                            borderColor: colors.border,
                                        },
                                    ]}
                                    onPress={() =>
                                        router.push({
                                            pathname: "/poem/[slug]",
                                            params: {
                                                slug: item.poemSlug,
                                                block: item.blockId,
                                            },
                                        })
                                    }
                                >
                                    <View style={styles.resultHeader}>
                                        <Text
                                            style={[
                                                styles.resultCategory,
                                                {
                                                    color: colors.accent,
                                                    fontSize:
                                                        typography.labelSmall *
                                                        fontScale,
                                                },
                                            ]}
                                        >
                                            {interfaceLanguage === "ru"
                                                ? categoryMeta.title.ru
                                                : categoryMeta.title.en}
                                        </Text>

                                        <Text
                                            style={[
                                                styles.resultLanguage,
                                                {
                                                    color: colors.textMuted,
                                                    fontSize:
                                                        typography.bodySmall *
                                                        fontScale,
                                                },
                                            ]}
                                        >
                                            {item.language.toUpperCase()}
                                        </Text>
                                    </View>

                                    <Text
                                        style={[
                                            styles.resultTitle,
                                            {
                                                color: colors.textPrimary,
                                                fontSize:
                                                    typography.bodyLarge *
                                                    fontScale,
                                            },
                                        ]}
                                    >
                                        {item.poemTitleOn}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.resultTranslatedTitle,
                                            {
                                                color: colors.textSecondary,
                                                fontSize:
                                                    typography.bodyMedium *
                                                    fontScale,
                                            },
                                        ]}
                                    >
                                        {translatedTitle}
                                    </Text>

                                    <Text
                                        style={[
                                            styles.resultSnippet,
                                            {
                                                color: colors.textPrimary,
                                                fontSize:
                                                    typography.bodyMedium *
                                                    fontScale,
                                            },
                                        ]}
                                        numberOfLines={4}
                                    >
                                        {item.snippet}
                                    </Text>
                                </PressableCard>
                            );
                        }}
                    />
                )}
            </SafeAreaView>
        </>
    );
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacing.md,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        borderBottomWidth: 1,
    },

    backButton: {
        width: 40,
        height: 40,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },

    backButtonText: {
        fontWeight: "700",
    },

    headerTitle: {
        fontWeight: "700",
    },

    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: radius.xl,
        marginHorizontal: spacing.lg,
        marginTop: spacing.xl,
        paddingHorizontal: spacing.lg,
    },

    searchInput: {
        flex: 1,
        minHeight: 56,
    },

    clearButton: {
        width: 28,
        height: 28,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },

    clearButtonText: {
        fontWeight: "700",
        fontSize: 14,
    },

    resultsContent: {
        padding: spacing.lg,
        paddingBottom: spacing.huge,
    },

    resultCard: {
        borderWidth: 1,
        borderRadius: radius.xl,
        padding: spacing.xl,
        marginBottom: spacing.lg,
    },

    resultHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: spacing.md,
    },

    resultCategory: {
        fontWeight: "700",
        letterSpacing: 1,
        textTransform: "uppercase",
    },

    resultLanguage: {
        fontWeight: "600",
    },

    resultTitle: {
        fontWeight: "700",
        marginBottom: spacing.xs,
    },

    resultTranslatedTitle: {
        marginBottom: spacing.lg,
    },

    resultSnippet: {
        lineHeight: 24,
    },

    emptySearchState: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: spacing.xxl,
    },

    emptySearchTitle: {
        fontWeight: "700",
        marginBottom: spacing.md,
    },

    emptySearchText: {
        textAlign: "center",
        lineHeight: 24,
    },

    emptyResults: {
        borderWidth: 1,
        borderRadius: radius.xl,
        padding: spacing.xxl,
        alignItems: "center",
    },

    emptyResultsTitle: {
        fontWeight: "700",
        marginBottom: spacing.sm,
    },

    emptyResultsText: {
        textAlign: "center",
        lineHeight: 24,
    },
});
