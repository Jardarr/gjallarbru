import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type InterfaceLanguage = "ru" | "en";
export type TranslationLanguage = "ru" | "en";
export type AppTheme = "dark" | "light";
export type FontSizeScale = 1 | 1.1 | 1.2;

export interface LastOpenedPoem {
    slug: string;
    titleOn: string;
    titleRu: string;
    titleEn: string;
}

interface AppSettingsState {
    interfaceLanguage: InterfaceLanguage | null;
    translationLanguage: TranslationLanguage;
    interfaceTheme: AppTheme;
    fontSizeScale: FontSizeScale;
    hasSelectedInterfaceLanguage: boolean;
    lastOpenedPoem: LastOpenedPoem | null;

    setInterfaceLanguage: (language: InterfaceLanguage) => void;
    setTranslationLanguage: (language: TranslationLanguage) => void;
    setInterfaceTheme: (theme: AppTheme) => void;
    setFontSizeScale: (scale: FontSizeScale) => void;
    setLastOpenedPoem: (poem: LastOpenedPoem) => void;
    clearLastOpenedPoem: () => void;
    completeLanguageSelection: (language: InterfaceLanguage) => void;
    resetSettings: () => void;
}

export const useAppSettingsStore = create<AppSettingsState>()(
    persist(
        (set) => ({
            interfaceLanguage: null,
            translationLanguage: "ru",
            interfaceTheme: "dark",
            fontSizeScale: 1,
            hasSelectedInterfaceLanguage: false,
            lastOpenedPoem: null,

            resetSettings: () =>
                set({
                    interfaceLanguage: null,
                    translationLanguage: "ru",
                    interfaceTheme: "dark",
                    fontSizeScale: 1,
                    hasSelectedInterfaceLanguage: false,
                    lastOpenedPoem: null,
                }),

            setInterfaceLanguage: (language) =>
                set({
                    interfaceLanguage: language,
                }),

            setTranslationLanguage: (language) =>
                set({
                    translationLanguage: language,
                }),

            setInterfaceTheme: (theme) =>
                set({
                    interfaceTheme: theme,
                }),

            setFontSizeScale: (scale: FontSizeScale) =>
                set({
                    fontSizeScale: scale,
                }),

            setLastOpenedPoem: (poem) =>
                set({
                    lastOpenedPoem: poem,
                }),

            clearLastOpenedPoem: () =>
                set({
                    lastOpenedPoem: null,
                }),

            completeLanguageSelection: (language) =>
                set({
                    interfaceLanguage: language,
                    translationLanguage: language,
                    hasSelectedInterfaceLanguage: true,
                }),
        }),
        {
            name: "app-settings",
            storage: createJSONStorage(() => AsyncStorage),
        },
    ),
);
