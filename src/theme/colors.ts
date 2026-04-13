import type { AppTheme } from "@/src/store/settings.store";

export const darkColors = {
    background: "#0B0B0C",
    backgroundSecondary: "#111114",

    surface: "#151518",
    surfaceSecondary: "#1D1D22",
    surfaceTertiary: "#25252B",

    textPrimary: "#F5F5F4",
    textSecondary: "#C7C7CC",
    textMuted: "#8A8A93",
    textOnAccent: "#161616",

    border: "#2A2A31",
    borderStrong: "#3A3A44",

    accent: "#C6A96B",
    accentSoft: "#8C7447",

    success: "#6C8E6B",
    danger: "#A35D5D",
    warning: "#B08A4A",

    overlay: "rgba(0, 0, 0, 0.28)",
};

export const lightColors = {
    background: "#F6F4EF",
    backgroundSecondary: "#EFEAE1",

    surface: "#FFFFFF",
    surfaceSecondary: "#F0ECE4",
    surfaceTertiary: "#E8E2D8",

    textPrimary: "#1A1A1A",
    textSecondary: "#4F4F58",
    textMuted: "#7A7A84",
    textOnAccent: "#FFFFFF",

    border: "#DDD6C8",
    borderStrong: "#CBBFA8",

    accent: "#9A7A3B",
    accentSoft: "#B89A61",

    success: "#5E7F5D",
    danger: "#9E5C5C",
    warning: "#A17A3D",

    overlay: "rgba(0, 0, 0, 0.08)",
};

export function getThemeColors(theme: AppTheme) {
    return theme === "light" ? lightColors : darkColors;
}

export type ThemeColors = ReturnType<typeof getThemeColors>;