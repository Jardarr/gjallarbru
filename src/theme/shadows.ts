import { Platform, type ViewStyle } from "react-native";

import type { AppTheme } from "@/src/store/settings.store";

function iosShadow(
    color: string,
    opacity: number,
    radius: number,
    width: number,
    height: number
): ViewStyle {
    return {
        shadowColor: color,
        shadowOpacity: opacity,
        shadowRadius: radius,
        shadowOffset: {
            width,
            height,
        },
    };
}

function androidShadow(elevation: number): ViewStyle {
    return {
        elevation,
    };
}

export function getThemeShadows(theme: AppTheme) {
    const darkShadowColor = "#000000";
    const lightShadowColor = "#1A1A1A";

    const shadowColor = theme === "dark" ? darkShadowColor : lightShadowColor;

    return {
        none: {},

        sm: Platform.select<ViewStyle>({
            ios: iosShadow(shadowColor, theme === "dark" ? 0.16 : 0.08, 8, 0, 3),
            android: androidShadow(2),
            default: {},
        }) ?? {},

        md: Platform.select<ViewStyle>({
            ios: iosShadow(shadowColor, theme === "dark" ? 0.22 : 0.1, 16, 0, 6),
            android: androidShadow(4),
            default: {},
        }) ?? {},

        lg: Platform.select<ViewStyle>({
            ios: iosShadow(shadowColor, theme === "dark" ? 0.28 : 0.12, 24, 0, 10),
            android: androidShadow(8),
            default: {},
        }) ?? {},
    };
}

export type ThemeShadows = ReturnType<typeof getThemeShadows>;