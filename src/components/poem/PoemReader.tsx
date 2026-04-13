import React, { useCallback, useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

import PoemColumnBlock from "./PoemColumnBlock";
import { useAppSettingsStore } from "@/src/store/settings.store";
import type { PoemBlock, PoemData } from "@/src/types/poem";
import { spacing } from "@/src/theme/spacing";

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
    const translationLanguage = useAppSettingsStore(
        (state) => state.translationLanguage,
    );

    const translatedBlocks = useMemo(() => {
        return translationLanguage === "ru" ? poem.texts.ru : poem.texts.en;
    }, [poem, translationLanguage]);

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

        if (isProse) {
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
});
