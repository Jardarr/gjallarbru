import "../src/i18n";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useAppSettingsStore } from "@/src/store/settings.store";
import { getThemeColors } from "@/src/theme/colors";

export default function RootLayout() {
    const interfaceTheme = useAppSettingsStore((state) => state.interfaceTheme);
    const colors = getThemeColors(interfaceTheme);

    return (
        <>
            <Stack
                screenOptions={{
                    headerStyle: {
                        backgroundColor: colors.background,
                    },
                    headerTintColor: colors.textPrimary,
                    headerShadowVisible: false,
                    headerTitleStyle: {
                        fontWeight: "600",
                    },
                    contentStyle: {
                        backgroundColor: colors.background,
                    },
                }}
            >
                <Stack.Screen name="index" options={{ headerShown: false }} />
                <Stack.Screen name="welcome" options={{ headerShown: false }} />
                <Stack.Screen name="poems" options={{ title: "Poems" }} />
                <Stack.Screen name="poem/[slug]" options={{ title: "Poem" }} />
                <Stack.Screen name="settings" options={{ title: "Settings" }} />
                <Stack.Screen name="about" options={{ title: "About" }} />
            </Stack>

            <StatusBar style={interfaceTheme === "dark" ? "light" : "dark"} />
        </>
    );
}
