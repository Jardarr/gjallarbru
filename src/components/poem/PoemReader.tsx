import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import PoemColumnBlock from "./PoemColumnBlock";

import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";
import { hasPoemContent } from "@/src/lib/has-poem-content";
import { useAppSettingsStore } from "@/src/store/settings.store";
import { spacing } from "@/src/theme/spacing";
import { getLineHeight, lineHeights, typography } from "@/src/theme/typography";
import type { PoemBlock, PoemData } from "@/src/types/poem";

interface PoemReaderProps {
    poem: PoemData;
    targetBlockId?: string;
    ListHeaderComponent?: React.ReactElement | null;
}

interface PoemRowItem {
    id: string;
    originalBlock: PoemBlock;
    translatedBlock: PoemBlock;
}

export default function PoemReader({
    poem,
    targetBlockId,
    ListHeaderComponent = null,
}: PoemReaderProps) {
    const { colors } = useAppTheme();
    const fontScale = useFontScale();

    const listRef = useRef<FlatList>(null);

    const [highlightedBlockId, setHighlightedBlockId] = useState<string | null>(
        null,
    );

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

                acc.push({
                    id: originalBlock.id,
                    originalBlock,
                    translatedBlock: translatedBlock ?? {
                        ...originalBlock,
                        lines: [""],
                    },
                });

                return acc;
            },
            [],
        );
    }, [poem.texts.on, translatedBlocks]);

    const targetIndex = useMemo(() => {
        if (!targetBlockId) {
            return -1;
        }

        return rows.findIndex((row) => row.originalBlock.id === targetBlockId);
    }, [rows, targetBlockId]);

    useEffect(() => {
        if (targetIndex < 0 || !listRef.current) {
            return;
        }

        const timeout = setTimeout(() => {
            listRef.current?.scrollToIndex({
                index: targetIndex,
                animated: true,
                viewPosition: 0.15,
            });
        }, 200);

        return () => clearTimeout(timeout);
    }, [targetIndex]);

    useEffect(() => {
        if (!targetBlockId) {
            return;
        }

        setHighlightedBlockId(targetBlockId);

        const timeout = setTimeout(() => {
            setHighlightedBlockId(null);
        }, 2000);

        return () => clearTimeout(timeout);
    }, [targetBlockId]);

    const renderItem = useCallback(
        ({ item }: { item: PoemRowItem }) => {
            const isProse = item.originalBlock.type === "prose";

            const isHeading = item.originalBlock.type === "heading";

            const isHighlighted = item.originalBlock.id === highlightedBlockId;

            const highlightedStyle = isHighlighted
                ? {
                      backgroundColor: colors.surfaceSecondary,
                      borderRadius: 20,
                  }
                : undefined;

            if (isProse || isHeading) {
                return (
                    <View style={[styles.proseRow, highlightedStyle]}>
                        <PoemColumnBlock block={item.originalBlock} />

                        <PoemColumnBlock block={item.translatedBlock} />
                    </View>
                );
            }

            return (
                <View style={[styles.stanzaRow, highlightedStyle]}>
                    <View style={styles.column}>
                        <PoemColumnBlock block={item.originalBlock} />
                    </View>

                    <View style={styles.column}>
                        <PoemColumnBlock block={item.translatedBlock} />
                    </View>
                </View>
            );
        },
        [colors.surfaceSecondary, highlightedBlockId],
    );

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
            ref={listRef}
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
            onScrollToIndexFailed={(info) => {
                setTimeout(() => {
                    listRef.current?.scrollToIndex({
                        index: info.index,
                        animated: true,
                    });
                }, 500);
            }}
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
