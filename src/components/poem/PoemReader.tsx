import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

import PoemColumnBlock from "./PoemColumnBlock";
import { useAppSettingsStore } from "@/src/store/settings.store";
import type { PoemData } from "@/src/types/poem";
import { spacing } from "@/src/theme/spacing";

interface PoemReaderProps {
    poem: PoemData;
}

export default function PoemReader({ poem }: PoemReaderProps) {
    const translationLanguage = useAppSettingsStore(
        (state) => state.translationLanguage,
    );

    const translatedBlocks = useMemo(() => {
        return translationLanguage === "ru" ? poem.texts.ru : poem.texts.en;
    }, [poem, translationLanguage]);

    return (
        <>
            {poem.texts.on.map((originalBlock, index) => {
                const translatedBlock = translatedBlocks[index];

                if (!translatedBlock) {
                    return null;
                }

                const isProse = originalBlock.type === "prose";

                if (isProse) {
                    return (
                        <View key={originalBlock.id} style={styles.proseRow}>
                            <PoemColumnBlock block={originalBlock} />
                            <PoemColumnBlock block={translatedBlock} />
                        </View>
                    );
                }

                return (
                    <View key={originalBlock.id} style={styles.stanzaRow}>
                        <View style={styles.column}>
                            <PoemColumnBlock block={originalBlock} />
                        </View>

                        <View style={styles.column}>
                            <PoemColumnBlock block={translatedBlock} />
                        </View>
                    </View>
                );
            })}
        </>
    );
}

const styles = StyleSheet.create({
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
