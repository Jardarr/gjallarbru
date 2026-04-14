import React, { useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { router, Stack } from "expo-router";
import { useTranslation } from "react-i18next";

import { getPoemsList } from "@/src/lib/poems";
import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";
import { useAppSettingsStore } from "@/src/store/settings.store";
import { radius } from "@/src/theme/radius";
import { spacing } from "@/src/theme/spacing";
import { typography } from "@/src/theme/typography";
import ThmrIcon from "@/assets/images/thmr.svg";
import { normalizeSearchValue } from "@/src/lib/search";
import PressableCard from "@/src/components/ui/PressableCard";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

export default function PoemsScreen() {
	const { i18n } = useTranslation();
	const { colors } = useAppTheme();
	const fontScale = useFontScale();
	const insets = useSafeAreaInsets();
	const [searchQuery, setSearchQuery] = useState("");
	const poems = getPoemsList();
	const lastOpenedPoem = useAppSettingsStore((state) => state.lastOpenedPoem);
	const uiLanguage = i18n.language === "ru" ? "ru" : "en";
	const filteredPoems = useMemo(() => {
		const query = normalizeSearchValue(searchQuery);
		if (!query) {
			return poems;
		}
		return poems.filter((poem) => {
			return normalizeSearchValue(poem.title.on).includes(query) || normalizeSearchValue(poem.title.ru).includes(query) || normalizeSearchValue(poem.title.en).includes(query);
		});
	}, [poems, searchQuery]);
	const continueTitle = lastOpenedPoem ? (uiLanguage === "ru" ? lastOpenedPoem.titleRu : lastOpenedPoem.titleEn) : "";
	const gradientColors: [string, string, string] =
		colors.background === "#0B0B0C" ? ["rgba(0,0,0,0.95)", "rgba(0,0,0,0.6)", "rgba(0,0,0,0)"] : ["rgba(255,255,255,0.95)", "rgba(255,255,255,0.6)", "rgba(255,255,255,0)"];
	return (
		<>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
			/>
			<SafeAreaView style={[styles.screen, { backgroundColor: colors.background }]} edges={["top"]}>
				<ScrollView style={{ backgroundColor: colors.background }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
					<View style={styles.headerRow}>
						<View
							style={[
								styles.logoCard,
								{
									backgroundColor: colors.surface,
									borderColor: colors.border,
								},
							]}>
							<ThmrIcon width="28" height="28" color={colors.accent} />
						</View>

						<PressableCard
							onPress={() => router.push("/settings")}
							style={[
								styles.settingsButton,
								{
									backgroundColor: colors.surface,
									borderColor: colors.border,
								},
							]}>
							<Text
								style={[
									styles.settingsButtonText,
									{
										color: colors.accent,
										fontSize: typography.labelLarge * fontScale,
									},
								]}>
								{uiLanguage === "ru" ? "Настройки" : "Settings"}
							</Text>
						</PressableCard>
					</View>

					<View
						style={[
							styles.heroCard,
							{
								backgroundColor: colors.surface,
								borderColor: colors.border,
							},
						]}>
						<View
							style={{
								justifyContent: "flex-end",
								alignItems: "center",
							}}>
							<Text
								style={[
									styles.heroEyebrow,
									{
										color: colors.accent,
										fontSize: typography.labelSmall * fontScale,
									},
								]}>
								{uiLanguage === "ru" ? "ЛИНГВИСТИЧЕСКИЙ ПРОЕКТ" : "LINGUISTIC PROJECT"}
							</Text>

							<Text
								style={[
									styles.heroTitle,
									{
										color: colors.textPrimary,
										fontSize: typography.titleMedium * fontScale,
									},
								]}>
								Gjallarbru
							</Text>
						</View>

						<Text
							style={[
								styles.heroText,
								{
									color: colors.textSecondary,
									fontSize: typography.bodyMedium * fontScale,
									lineHeight: 24 * fontScale,
								},
							]}>
							{uiLanguage === "ru"
								? "Чтение древнеисландских поэм с параллельным отображением оригинала и перевода."
								: "Read Old Norse poems with parallel display of the original text and translation."}
						</Text>
					</View>

					<View
						style={[
							styles.searchWrap,
							{
								backgroundColor: colors.surface,
								borderColor: colors.border,
							},
						]}>
						<TextInput
							value={searchQuery}
							onChangeText={setSearchQuery}
							placeholder={uiLanguage === "ru" ? "Поиск по названиям..." : "Search by title..."}
							placeholderTextColor={colors.textMuted}
							style={[
								styles.searchInput,
								{
									color: colors.textPrimary,
									fontSize: typography.bodyMedium * fontScale,
								},
							]}
						/>

						{!!searchQuery && (
							<Pressable
								onPress={() => setSearchQuery("")}
								style={[
									styles.clearSearchButton,
									{
										backgroundColor: colors.surfaceSecondary,
									},
								]}>
								<Text
									style={[
										styles.clearSearchButtonText,
										{
											color: colors.textSecondary,
										},
									]}>
									✕
								</Text>
							</Pressable>
						)}
					</View>

					{!!lastOpenedPoem && (
						<PressableCard
							style={[
								styles.continueCard,
								{
									backgroundColor: colors.surfaceSecondary,
									borderColor: colors.border,
								},
							]}
							onPress={() => router.push(`/poem/${lastOpenedPoem.slug}`)}>
							<Text
								style={[
									styles.continueLabel,
									{
										color: colors.accent,
										fontSize: typography.labelSmall * fontScale,
									},
								]}>
								{uiLanguage === "ru" ? "ПРОДОЛЖИТЬ ЧТЕНИЕ" : "CONTINUE READING"}
							</Text>

							<Text
								style={[
									styles.continueOriginalTitle,
									{
										color: colors.textPrimary,
										fontSize: typography.titleSmall * fontScale,
									},
								]}>
								{lastOpenedPoem.titleOn}
							</Text>

							<Text
								style={[
									styles.continueTranslatedTitle,
									{
										color: colors.textSecondary,
										fontSize: typography.bodyMedium * fontScale,
									},
								]}>
								{continueTitle}
							</Text>
						</PressableCard>
					)}

					<View style={styles.sectionHeader}>
						<Text
							style={[
								styles.sectionTitle,
								{
									color: colors.textMuted,
									fontSize: typography.labelSmall * fontScale,
								},
							]}>
							{uiLanguage === "ru" ? "ВСЕ ПОЭМЫ" : "ALL POEMS"}
						</Text>

						<Text
							style={[
								styles.sectionCount,
								{
									color: colors.textSecondary,
									fontSize: typography.bodySmall * fontScale,
								},
							]}>
							{searchQuery.trim() ? `${filteredPoems.length}` : `${poems.length}`}
						</Text>
					</View>

					<FlatList
						data={filteredPoems}
						keyExtractor={(item) => item.slug}
						scrollEnabled={false}
						contentContainerStyle={styles.listContent}
						renderItem={({ item }) => {
							const translatedTitle = uiLanguage === "ru" ? item.title.ru : item.title.en;

							return (
								<PressableCard
									style={[
										styles.poemCard,
										{
											backgroundColor: colors.surface,
											borderColor: colors.border,
										},
									]}
									contentStyle={{
										flexDirection: "row",
										alignItems: "center",
										justifyContent: "space-between",
									}}
									onPress={() => router.push(`/poem/${item.slug}`)}>
									<View style={styles.poemCardContent}>
										<Text
											style={[
												styles.poemOriginalTitle,
												{
													color: colors.textPrimary,
													fontSize: typography.bodyLarge * fontScale,
												},
											]}>
											{item.title.on}
										</Text>

										<Text
											style={[
												styles.poemTranslatedTitle,
												{
													color: colors.textSecondary,
													fontSize: typography.bodyMedium * fontScale,
												},
											]}>
											{translatedTitle}
										</Text>
									</View>

									<Text
										style={[
											styles.poemArrow,
											{
												color: colors.accent,
												fontSize: typography.titleSmall * fontScale,
												lineHeight: typography.titleSmall * fontScale,
											},
										]}>
										›
									</Text>
								</PressableCard>
							);
						}}
						ListEmptyComponent={
							<View
								style={[
									styles.emptyState,
									{
										backgroundColor: colors.surface,
										borderColor: colors.border,
									},
								]}>
								<Text
									style={[
										styles.emptyStateTitle,
										{
											color: colors.textPrimary,
											fontSize: typography.bodyLarge * fontScale,
										},
									]}>
									{uiLanguage === "ru" ? "Ничего не найдено" : "Nothing found"}
								</Text>

								<Text
									style={[
										styles.emptyStateText,
										{
											color: colors.textSecondary,
											fontSize: typography.bodyMedium * fontScale,
										},
									]}>
									{uiLanguage === "ru" ? "Попробуй ввести другое название или очистить поиск." : "Try another title or clear the search field."}
								</Text>
							</View>
						}
					/>
				</ScrollView>
				<LinearGradient
					pointerEvents="none"
					colors={gradientColors}
					style={[
						styles.topGradient,
						{
							height: insets.top + 80,
						},
					]}
				/>
			</SafeAreaView>
		</>
	);
}

const styles = StyleSheet.create({
	scrollContent: {
		paddingHorizontal: spacing.lg,
		paddingTop: 56,
		paddingBottom: 40,
	},
	headerRow: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.md,
		marginBottom: spacing.xxl,
	},
	headerTextBlock: {
		flex: 1,
		minWidth: 0,
	},
	screenTitle: {
		fontWeight: "700",
		marginBottom: spacing.xs,
	},
	screenSubtitle: {
		lineHeight: 22,
	},
	settingsButton: {
		borderWidth: 1,
		borderRadius: radius.lg,
		paddingVertical: 10,
		paddingHorizontal: 14,
		flexShrink: 0,
		alignSelf: "flex-start",
	},
	settingsButtonText: {
		fontWeight: "600",
	},
	heroCard: {
		borderWidth: 1,
		borderRadius: radius.xl,
		padding: spacing.xxl,
		marginBottom: spacing.lg,
	},
	heroEyebrow: {
		fontWeight: "700",
		letterSpacing: 1,
		marginBottom: spacing.sm,
	},
	heroTitle: {
		fontWeight: "700",
		marginBottom: spacing.sm,
	},
	heroText: {
		maxWidth: 540,
	},
	searchWrap: {
		borderWidth: 1,
		borderRadius: radius.lg,
		paddingHorizontal: spacing.lg,
		paddingVertical: 4,
		marginBottom: spacing.lg,
		flexDirection: "row",
		alignItems: "center",
	},
	searchInput: {
		minHeight: 48,
	},
	continueCard: {
		borderWidth: 1,
		borderRadius: radius.xl,
		padding: spacing.xxl,
		marginBottom: spacing.xxl,
	},
	continueLabel: {
		fontWeight: "700",
		letterSpacing: 1,
		marginBottom: spacing.sm,
	},
	continueOriginalTitle: {
		fontWeight: "700",
		marginBottom: spacing.xs,
	},
	continueTranslatedTitle: {},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		marginBottom: spacing.md,
	},
	sectionTitle: {
		fontWeight: "700",
		letterSpacing: 1,
	},
	sectionCount: {
		fontWeight: "600",
	},
	listContent: {
		paddingBottom: spacing.xl,
	},
	poemCard: {
		borderWidth: 1,
		borderRadius: radius.lg,
		paddingVertical: spacing.lg,
		paddingHorizontal: spacing.lg,
		marginBottom: spacing.md,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		gap: spacing.md,
	},
	poemCardContent: {
		flex: 1,
	},
	poemOriginalTitle: {
		fontWeight: "700",
		marginBottom: spacing.xs,
	},
	poemTranslatedTitle: {},
	poemArrow: {
		fontWeight: "400",
	},
	emptyState: {
		borderWidth: 1,
		borderRadius: radius.xl,
		padding: spacing.xxl,
		alignItems: "center",
	},
	emptyStateTitle: {
		fontWeight: "700",
		marginBottom: spacing.sm,
	},
	emptyStateText: {
		textAlign: "center",
	},
	iconWrap: {
		justifyContent: "center",
		alignItems: "center",
	},
	clearSearchButton: {
		width: 28,
		height: 28,
		borderRadius: 999,
		alignItems: "center",
		justifyContent: "center",
		marginLeft: spacing.sm,
	},
	clearSearchButtonText: {
		fontSize: 14,
		fontWeight: "700",
	},
	logoCard: {
		flexDirection: "row",
		alignItems: "center",
		borderWidth: 1,
		borderRadius: radius.lg,
		paddingVertical: spacing.sm,
		paddingHorizontal: spacing.md,
		gap: spacing.sm,
		minWidth: 0,
	},
	screen: {
		flex: 1,
	},
	topGradient: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
	},
});
