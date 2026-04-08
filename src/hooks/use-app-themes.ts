import { useMemo } from "react";

import { useAppSettingsStore } from "@/src/store/settings.store";
import { getThemeColors } from "@/src/theme/colors";

export function useAppTheme() {
    const interfaceTheme = useAppSettingsStore((state) => state.interfaceTheme);

    return useMemo(() => getThemeColors(interfaceTheme), [interfaceTheme]);
}