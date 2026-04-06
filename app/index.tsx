import React from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";

import { getPoemsList } from "@/src/lib/poems";

export default function HomeScreen() {
    const { i18n } = useTranslation();
    const poems = getPoemsList();

    const uiLanguage = i18n.language === "ru" ? "ru" : "en";

    return (
        <View style={styles.container}>
            <Text style={styles.screenTitle}>
                {uiLanguage === "ru" ? "Поэмы" : "Poems"}
            </Text>

            <FlatList
                data={poems}
                keyExtractor={(item) => item.slug}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const translatedTitle =
                        uiLanguage === "ru" ? item.title.ru : item.title.en;

                    return (
                        <Pressable
                            style={styles.card}
                            onPress={() => router.push(`/poem/${item.slug}`)}
                        >
                            <Text style={styles.originalTitle}>
                                {item.title.on}
                            </Text>
                            <Text style={styles.translatedTitle}>
                                {translatedTitle}
                            </Text>
                        </Pressable>
                    );
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0F0F10",
        paddingTop: 24,
        paddingHorizontal: 16,
    },
    screenTitle: {
        color: "#F3F4F6",
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 32,
    },
    card: {
        backgroundColor: "#1A1A1D",
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    originalTitle: {
        color: "#F9FAFB",
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 4,
    },
    translatedTitle: {
        color: "#A1A1AA",
        fontSize: 15,
    },
});
