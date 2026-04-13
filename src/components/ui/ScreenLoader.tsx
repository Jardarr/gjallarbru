import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";

interface ScreenLoaderProps {
    label?: string;
}

export default function ScreenLoader({ label }: ScreenLoaderProps) {
    const { colors } = useAppTheme();
    const fontScale = useFontScale();

    return (
        <View
            style={[styles.container, { backgroundColor: colors.background }]}
        >
            <View
                style={[
                    styles.card,
                    {
                        backgroundColor: colors.surface,
                        borderColor: colors.border,
                    },
                ]}
            >
                <ActivityIndicator size="large" color={colors.accent} />

                {!!label && (
                    <Text
                        style={[
                            styles.label,
                            {
                                color: colors.textSecondary,
                                fontSize: typography.bodyMedium * fontScale,
                            },
                        ]}
                    >
                        {label}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: spacing.xl,
    },
    card: {
        minWidth: 220,
        borderWidth: 1,
        borderRadius: 20,
        paddingVertical: spacing.xxl,
        paddingHorizontal: spacing.xxl,
        alignItems: "center",
    },
    label: {
        marginTop: spacing.lg,
        textAlign: "center",
    },
});
