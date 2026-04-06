import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

import { getPoemBySlug } from "@/src/lib/poems";
import type { PoemBlock } from "@/src/types/poem";

export default function PoemScreen() {
    const { slug } = useLocalSearchParams<{ slug: string }>();

    const poem = typeof slug === "string" ? getPoemBySlug(slug) : null;

    if (!poem) {
        return (
            <View style={styles.centered}>
                <Text style={styles.notFoundText}>Poem not found</Text>
            </View>
        );
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: poem.title.on,
                    headerStyle: {
                        backgroundColor: "#0F0F10",
                    },
                    headerTintColor: "#F3F4F6",
                }}
            />

            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>{poem.title.on}</Text>
                <Text style={styles.subtitle}>{poem.title.ru}</Text>

                {poem.texts.on.map((originalBlock, index) => {
                    const translatedBlock = poem.texts.ru[index];

                    return (
                        <View key={originalBlock.id} style={styles.row}>
                            <View style={styles.column}>
                                <PoemColumnBlock block={originalBlock} />
                            </View>

                            <View style={styles.column}>
                                <PoemColumnBlock block={translatedBlock} />
                            </View>
                        </View>
                    );
                })}
            </ScrollView>
        </>
    );
}

interface PoemColumnBlockProps {
    block: PoemBlock;
}

function PoemColumnBlock({ block }: PoemColumnBlockProps) {
    if (block.placeholder) {
        return <View style={styles.placeholderBlock} />;
    }

    return (
        <View style={styles.block}>
            {!!block.number && (
                <Text style={styles.number}>{block.number}</Text>
            )}

            {block.type === "stanza"
                ? block.lines.map((line, index) => (
                    <Text
                        key={`${block.id}-line-${index}`}
                        style={styles.line}
                    >
                        {line}
                    </Text>
                ))
                : block.lines.map((paragraph, index) => (
                    <Text
                        key={`${block.id}-paragraph-${index}`}
                        style={styles.prose}
                    >
                        {paragraph}
                    </Text>
                ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#0F0F10",
        padding: 16,
        paddingBottom: 48,
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0F0F10",
    },
    notFoundText: {
        color: "#F3F4F6",
        fontSize: 16,
    },
    title: {
        color: "#F9FAFB",
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 6,
    },
    subtitle: {
        color: "#A1A1AA",
        fontSize: 18,
        marginBottom: 24,
    },
    row: {
        flexDirection: "row",
        gap: 12,
        marginBottom: 24,
    },
    column: {
        flex: 1,
    },
    block: {
        minHeight: 40,
    },
    placeholderBlock: {
        minHeight: 40,
    },
    number: {
        color: "#71717A",
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 6,
    },
    line: {
        color: "#F3F4F6",
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 2,
    },
    prose: {
        color: "#F3F4F6",
        fontSize: 15,
        lineHeight: 24,
        marginBottom: 8,
    },
});
