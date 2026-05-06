import React, { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import PoemColumnBlock from "./PoemColumnBlock";

import { hasPoemContent } from "@/src/lib/has-poem-content";
import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";
import { useAppSettingsStore } from "@/src/store/settings.store";
import { spacing } from "@/src/theme/spacing";
import { getLineHeight, lineHeights, typography } from "@/src/theme/typography";
import type { PoemBlock, PoemData } from "@/src/types/poem";

interface PoemReaderProps {
    poem: PoemData;
    ListHeaderComponent?: React.ReactElement | null;
}

interface PoemRowItem {
    id: string;
    originalBlock: PoemBlock;
    translatedBlock: PoemBlock;
}

export default function PoemReader({
    poem,
    ListHeaderComponent = null,
}: PoemReaderProps) {
    const { colors } = useAppTheme();
    const fontScale = useFontScale();

    const translationLanguage = useAppSettingsStore(
        (state) => state.translationLanguage,
    );

    const translatedBlocks = useMemo(() => {
        return translationLanguage === "ru" ? poem.texts.ru : poem.texts.en;
    }, [poem, translationLanguage]);

    const hasTranslation = useMemo(() => {
        return hasPoemContent(
            translatedBlocks.filter(
                (block): block is PoemBlock => block != null,
            ),
        );
    }, [translatedBlocks]);

    const rows = useMemo<PoemRowItem[]>(() => {
        return poem.texts.on.reduce<PoemRowItem[]>(
            (acc, originalBlock, index) => {
                const translatedBlock = translatedBlocks[index];

                if (!translatedBlock) {
                    return acc;
                }

                acc.push({
                    id: originalBlock.id,
                    originalBlock,
                    translatedBlock,
                });

                return acc;
            },
            [],
        );
    }, [poem.texts.on, translatedBlocks]);

    const renderItem = useCallback(({ item }: { item: PoemRowItem }) => {
        const isProse = item.originalBlock.type === "prose";
        const isHeading = item.originalBlock.type === "heading";

        if (isProse || isHeading) {
            return (
                <View style={styles.proseRow}>
                    <PoemColumnBlock block={item.originalBlock} />
                    <PoemColumnBlock block={item.translatedBlock} />
                </View>
            );
        }

        return (
            <View style={styles.stanzaRow}>
                <View style={styles.column}>
                    <PoemColumnBlock block={item.originalBlock} />
                </View>

                <View style={styles.column}>
                    <PoemColumnBlock block={item.translatedBlock} />
                </View>
            </View>
        );
    }, []);

    const keyExtractor = useCallback((item: PoemRowItem) => item.id, []);

    if (!hasTranslation) {
        return (
            <View style={styles.emptyWrapper}>
                {ListHeaderComponent}

                <View
                    style={[
                        styles.emptyContainer,
                        {
                            borderColor: colors.border,
                            backgroundColor: colors.surface,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.emptyTitle,
                            {
                                color: colors.textPrimary,
                                fontSize: typography.titleSmall * fontScale,
                            },
                        ]}
                    >
                        {translationLanguage === "en"
                            ? "Translation unavailable"
                            : "Перевод недоступен"}
                    </Text>

                    <Text
                        style={[
                            styles.emptyText,
                            {
                                color: colors.textSecondary,
                                fontSize: typography.bodyMedium * fontScale,
                                lineHeight: getLineHeight(
                                    typography.bodyMedium * fontScale,
                                    lineHeights.relaxed,
                                ),
                            },
                        ]}
                    >
                        {translationLanguage === "en"
                            ? "English translations may appear in future updates."
                            : "Переводы могут появиться в будущих обновлениях."}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <FlatList
            data={rows}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            ListHeaderComponent={ListHeaderComponent}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            initialNumToRender={12}
            maxToRenderPerBatch={10}
            windowSize={7}
            removeClippedSubviews
        />
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        paddingHorizontal: spacing.lg,
        paddingTop: 28,
        paddingBottom: spacing.huge,
    },

    stanzaRow: {
        flexDirection: "row",
        gap: spacing.lg,
        marginBottom: spacing.xxl,
    },

    proseRow: {
        flexDirection: "column",
        gap: spacing.lg,
        marginBottom: spacing.xxl,
    },

    column: {
        flex: 1,
    },

    emptyWrapper: {
        paddingHorizontal: spacing.lg,
        paddingTop: 28,
        paddingBottom: spacing.huge,
    },

    emptyContainer: {
        borderWidth: 1,
        borderRadius: 24,
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.xxl,
        alignItems: "center",
    },

    emptyTitle: {
        fontWeight: "700",
        textAlign: "center",
        marginBottom: spacing.md,
    },

    emptyText: {
        textAlign: "center",
        maxWidth: 320,
    },
});
