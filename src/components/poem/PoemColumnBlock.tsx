import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";
import { spacing } from "@/src/theme/spacing";
import { getLineHeight, lineHeights, typography } from "@/src/theme/typography";
import type { PoemBlock } from "@/src/types/poem";
import * as Clipboard from "expo-clipboard";
import * as Haptics from "expo-haptics";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface PoemColumnBlockProps {
    block: PoemBlock;
}

const copyBlock = async (block: PoemBlock) => {
    const text = block.lines.filter((line) => line.trim() !== "").join("\n");

    await Clipboard.setStringAsync(text);
};

export default function PoemColumnBlock({ block }: PoemColumnBlockProps) {
    const { colors } = useAppTheme();
    const fontScale = useFontScale();
    const [selected, setSelected] = React.useState(false);

    if (block.placeholder) {
        if (block.type === "stanza") {
            return <View style={styles.placeholderBlock} />;
        }
        return null;
    }

    const handleLongPress = async () => {
        await Haptics.selectionAsync();
        setSelected(true);
        await copyBlock(block);

        setTimeout(() => setSelected(false), 300);
    };

    return (
        <Pressable onLongPress={handleLongPress}>
            <View style={[styles.block, selected && styles.blockSelected]}>
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

                {block.type === "stanza" &&
                    block.lines.map((line, index) => (
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
                    ))}

                {block.type === "prose" &&
                    block.lines.map((paragraph, index) => (
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

                {block.type === "heading" &&
                    block.lines.map((heading, index) => (
                        <Text
                            key={`${block.id}-heading-${index}`}
                            style={[
                                styles.heading,
                                {
                                    color: colors.textPrimary,
                                    fontSize:
                                        typography.titleMedium * fontScale,
                                    lineHeight: getLineHeight(
                                        typography.titleMedium * fontScale,
                                        lineHeights.tight,
                                    ),
                                },
                            ]}
                        >
                            {heading}
                        </Text>
                    ))}
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    block: {
        minHeight: 40,
    },
    blockSelected: {
        opacity: 0.6,
    },
    placeholderBlock: {
        minHeight: 40,
    },
    number: {
        fontWeight: "700",
    },
    line: {},
    prose: {},
    heading: {
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 0.5,
    },
});
