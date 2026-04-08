import { useAppSettingsStore } from "@/src/store/settings.store";

export function useFontScale() {
    return useAppSettingsStore((state) => state.fontSizeScale);
}