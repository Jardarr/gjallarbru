import { useMemo } from "react";

import { useAppSettingsStore } from "@/src/store/settings.store";
import { getThemeColors, getThemeShadows } from "@/src/theme";

export function useAppTheme() {
    const interfaceTheme = useAppSettingsStore((state) => state.interfaceTheme);

    return useMemo(() => {
        return {
            theme: interfaceTheme,
            colors: getThemeColors(interfaceTheme),
            shadows: getThemeShadows(interfaceTheme),
        };
    }, [interfaceTheme]);
}