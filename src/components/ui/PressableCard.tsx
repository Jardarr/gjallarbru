import React from "react";
import {
    Pressable,
    StyleSheet,
    View,
    type GestureResponderEvent,
    type StyleProp,
    type ViewStyle,
} from "react-native";

import { useAppTheme } from "@/src/hooks/use-app-themes";
import { radius } from "@/src/theme/radius";

interface PressableCardProps {
    children: React.ReactNode;
    onPress?: (event: GestureResponderEvent) => void;
    style?: StyleProp<ViewStyle>;
    contentStyle?: StyleProp<ViewStyle>;
    disabled?: boolean;
    elevated?: boolean;
}

export default function PressableCard({
    children,
    onPress,
    style,
    contentStyle,
    disabled = false,
    elevated = false,
}: PressableCardProps) {
    const { colors, shadows } = useAppTheme();

    return (
        <Pressable
            disabled={disabled}
            onPress={onPress}
            style={({ pressed }) => [
                styles.base,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                    opacity: pressed ? 0.94 : 1,
                    transform: [{ scale: pressed ? 0.985 : 1 }],
                },
                elevated && shadows.sm,
                style,
            ]}
        >
            <View style={[styles.inner, contentStyle]}>{children}</View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        borderWidth: 1,
        borderRadius: radius.xl,
        overflow: "hidden",
    },
    inner: {
        width: "100%",
    },
});