import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";
import type { PoemBlock } from "@/src/types/poem";
import { spacing } from "@/src/theme/spacing";
import { typography, getLineHeight, lineHeights } from "@/src/theme/typography";

interface PoemColumnBlockProps {
    block: PoemBlock;
}

export default function PoemColumnBlock({ block }: PoemColumnBlockProps) {
    const colors = useAppTheme();
    const fontScale = useFontScale();

    if (block.placeholder) {
        return <View style={styles.placeholderBlock} />;
    }

    return (
        <View style={styles.block}>
            {!!block.number && (
                <Text
                    style={[
                        styles.number,
                        {
                            color: colors.textMuted,
                            fontSize: typography.labelMedium * fontScale,
                            marginBottom: spacing.sm,
                        },
                    ]}
                >
                    {block.number}
                </Text>
            )}

            {block.type === "stanza"
                ? block.lines.map((line, index) => (
                    <Text
                        key={`${block.id}-line-${index}`}
                        style={[
                            styles.line,
                            {
                                color: colors.textPrimary,
                                fontSize: typography.bodyMedium * fontScale,
                                lineHeight: getLineHeight(
                                    typography.bodyMedium * fontScale,
                                    lineHeights.reading,
                                ),
                                marginBottom: 2,
                            },
                        ]}
                    >
                        {line}
                    </Text>
                ))
            : block.lines.map((paragraph, index) => (
                    <Text
                        key={`${block.id}-paragraph-${index}`}
                        style={[
                            styles.prose,
                            {
                                color: colors.textPrimary,
                                fontSize: typography.bodyMedium * fontScale,
                                lineHeight: getLineHeight(
                                    typography.bodyMedium * fontScale,
                                    lineHeights.reading,
                                ),
                                marginBottom: spacing.sm,
                            },
                        ]}
                    >
                        {paragraph}
                    </Text>
                ))}
        </View>
    );
}

const styles = StyleSheet.create({
    block: {
        minHeight: 40,
    },
    placeholderBlock: {
        minHeight: 40,
    },
    number: {
        fontWeight: "700",
    },
    line: {},
    prose: {},
});
