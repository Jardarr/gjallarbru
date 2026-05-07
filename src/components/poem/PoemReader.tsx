import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
} from "react";

import {
    Animated,
    Easing,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

import PoemColumnBlock from "./PoemColumnBlock";

import { useAppTheme } from "@/src/hooks/use-app-themes";
import { useFontScale } from "@/src/hooks/use-font-scale";

import { hasPoemContent } from "@/src/lib/has-poem-content";

import { useAppSettingsStore } from "@/src/store/settings.store";

import { spacing } from "@/src/theme/spacing";

import {
    getLineHeight,
    lineHeights,
    typography,
} from "@/src/theme/typography";

import type {
    PoemBlock,
    PoemData,
} from "@/src/types/poem";

interface PoemReaderProps {
    poem: PoemData;
    targetBlockId?: string;
    ListHeaderComponent?: React.ReactElement | null;
}

interface PoemRowItem {
    id: string;
    originalBlock: PoemBlock;
    translatedBlock: PoemBlock;
}

export default function PoemReader({
    poem,
    targetBlockId,
    ListHeaderComponent = null,
}: PoemReaderProps) {
    const { colors } = useAppTheme();

    const fontScale = useFontScale();

    const scrollViewRef =
        useRef<ScrollView>(null);

    const highlightAnimation = useRef(
        new Animated.Value(0),
    ).current;

    const highlightedBlockIdRef = useRef<
        string | null
    >(null);

    const rowOffsetsRef = useRef<
        Record<string, number>
    >({});

    const pendingTargetBlockIdRef =
        useRef<string | null>(
            targetBlockId ?? null,
        );

    const [
        highlightedBlockId,
        setHighlightedBlockId,
    ] = React.useState<string | null>(
        null,
    );

    const translationLanguage =
        useAppSettingsStore(
            (state) =>
                state.translationLanguage,
        );

    const translatedBlocks =
        useMemo(() => {
            return translationLanguage ===
                "ru"
                ? poem.texts.ru
                : poem.texts.en;
        }, [poem, translationLanguage]);

    const hasTranslation =
        useMemo(() => {
            return hasPoemContent(
                translatedBlocks.filter(
                    (
                        block,
                    ): block is PoemBlock =>
                        block != null,
                ),
            );
        }, [translatedBlocks]);

    const rows = useMemo<
        PoemRowItem[]
    >(() => {
        return poem.texts.on.reduce<
            PoemRowItem[]
        >(
            (
                acc,
                originalBlock,
                index,
            ) => {
                const translatedBlock =
                    translatedBlocks[index];

                acc.push({
                    id: originalBlock.id,

                    originalBlock,

                    translatedBlock:
                        translatedBlock ?? {
                            ...originalBlock,
                            lines: [""],
                        },
                });

                return acc;
            },
            [],
        );
    }, [poem.texts.on, translatedBlocks]);

    const hasTargetBlock =
        useMemo(() => {
            if (!targetBlockId) {
                return false;
            }

            return rows.some(
                (row) =>
                    row.id ===
                    targetBlockId,
            );
        }, [rows, targetBlockId]);

    const startHighlight =
        useCallback(
            (blockId: string) => {
                highlightedBlockIdRef.current =
                    blockId;

                setHighlightedBlockId(
                    blockId,
                );

                highlightAnimation.stopAnimation();

                highlightAnimation.setValue(
                    0,
                );

                const animation =
                    Animated.sequence([
                        Animated.timing(
                            highlightAnimation,
                            {
                                toValue: 1,

                                duration: 260,

                                easing:
                                    Easing.out(
                                        Easing
                                            .cubic,
                                    ),

                                useNativeDriver: true,
                            },
                        ),

                        Animated.delay(
                            1200,
                        ),

                        Animated.timing(
                            highlightAnimation,
                            {
                                toValue: 0,

                                duration: 540,

                                easing:
                                    Easing.inOut(
                                        Easing
                                            .quad,
                                    ),

                                useNativeDriver: true,
                            },
                        ),
                    ]);

                animation.start(
                    ({ finished }) => {
                        if (
                            finished &&
                            highlightedBlockIdRef.current ===
                                blockId
                        ) {
                            highlightedBlockIdRef.current =
                                null;

                            setHighlightedBlockId(
                                null,
                            );
                        }
                    },
                );
            },
            [highlightAnimation],
        );

    const jumpToTargetBlock =
        useCallback(
            (blockId: string) => {
                const offsetY =
                    rowOffsetsRef.current[
                        blockId
                    ];

                if (
                    offsetY == null
                ) {
                    return false;
                }

                scrollViewRef.current?.scrollTo(
                    {
                        y: Math.max(
                            offsetY -
                                spacing.xl,
                            0,
                        ),

                        animated: false,
                    },
                );

                pendingTargetBlockIdRef.current =
                    null;

                startHighlight(
                    blockId,
                );

                return true;
            },
            [startHighlight],
        );

    useEffect(() => {
        rowOffsetsRef.current = {};

        pendingTargetBlockIdRef.current =
            targetBlockId ?? null;
    }, [
        poem.slug,
        targetBlockId,
        translationLanguage,
    ]);

    useEffect(() => {
        if (
            !targetBlockId ||
            !hasTargetBlock
        ) {
            pendingTargetBlockIdRef.current =
                null;

            return;
        }

        pendingTargetBlockIdRef.current =
            targetBlockId;

        jumpToTargetBlock(
            targetBlockId,
        );
    }, [
        hasTargetBlock,
        jumpToTargetBlock,
        targetBlockId,
    ]);

    const listHeaderComponent =
        useMemo(() => {
            if (
                hasTranslation
            ) {
                return ListHeaderComponent;
            }

            return (
                <View>
                    {
                        ListHeaderComponent
                    }

                    <View
                        style={[
                            styles.emptyContainer,
                            {
                                borderColor:
                                    colors.border,

                                backgroundColor:
                                    colors.surface,

                                marginBottom:
                                    spacing.xxl,
                            },
                        ]}
                    >
                        <Text
                            style={[
                                styles.emptyTitle,
                                {
                                    color:
                                        colors.textPrimary,

                                    fontSize:
                                        typography.titleSmall *
                                        fontScale,
                                },
                            ]}
                        >
                            {translationLanguage ===
                            "en"
                                ? "Translation unavailable"
                                : "Перевод недоступен"}
                        </Text>

                        <Text
                            style={[
                                styles.emptyText,
                                {
                                    color:
                                        colors.textSecondary,

                                    fontSize:
                                        typography.bodyMedium *
                                        fontScale,

                                    lineHeight:
                                        getLineHeight(
                                            typography.bodyMedium *
                                                fontScale,
                                            lineHeights.relaxed,
                                        ),
                                },
                            ]}
                        >
                            {translationLanguage ===
                            "en"
                                ? "Showing the original text. Translations may appear in future updates."
                                : "Показываю оригинальный текст. Переводы могут появиться в будущих обновлениях."}
                        </Text>
                    </View>
                </View>
            );
        }, [
            ListHeaderComponent,
            colors.border,
            colors.surface,
            colors.textPrimary,
            colors.textSecondary,
            fontScale,
            hasTranslation,
            translationLanguage,
        ]);

    const renderRow =
        useCallback(
            (
                item: PoemRowItem,
            ) => {
                const isProse =
                    item
                        .originalBlock
                        .type ===
                    "prose";

                const isHeading =
                    item
                        .originalBlock
                        .type ===
                    "heading";

                const isHighlighted =
                    item
                        .originalBlock
                        .id ===
                    highlightedBlockId;

                const highlightOverlay =
                    isHighlighted ? (
                        <Animated.View
                            pointerEvents="none"
                            style={[
                                styles.highlightOverlay,
                                {
                                    backgroundColor:
                                        colors.accentSoft,

                                    opacity:
                                        highlightAnimation.interpolate(
                                            {
                                                inputRange:
                                                    [
                                                        0,
                                                        0.15,
                                                        0.75,
                                                        1,
                                                    ],

                                                outputRange:
                                                    [
                                                        0,
                                                        0.16,
                                                        0.1,
                                                        0,
                                                    ],
                                            },
                                        ),

                                    transform:
                                        [
                                            {
                                                scale:
                                                    highlightAnimation.interpolate(
                                                        {
                                                            inputRange:
                                                                [
                                                                    0,
                                                                    0.2,
                                                                    1,
                                                                ],

                                                            outputRange:
                                                                [
                                                                    0.998,
                                                                    1,
                                                                    1,
                                                                ],
                                                        },
                                                    ),
                                            },
                                        ],
                                },
                            ]}
                        />
                    ) : null;

                let rowContent: React.ReactElement;

                if (
                    !hasTranslation
                ) {
                    rowContent = (
                        <View
                            style={
                                styles.singleColumnRow
                            }
                        >
                            <PoemColumnBlock
                                block={
                                    item.originalBlock
                                }
                            />
                        </View>
                    );
                } else if (
                    isProse ||
                    isHeading
                ) {
                    rowContent = (
                        <View
                            style={
                                styles.proseRow
                            }
                        >
                            <PoemColumnBlock
                                block={
                                    item.originalBlock
                                }
                            />

                            <PoemColumnBlock
                                block={
                                    item.translatedBlock
                                }
                            />
                        </View>
                    );
                } else {
                    rowContent = (
                        <View
                            style={
                                styles.stanzaRow
                            }
                        >
                            <View
                                style={
                                    styles.column
                                }
                            >
                                <PoemColumnBlock
                                    block={
                                        item.originalBlock
                                    }
                                />
                            </View>

                            <View
                                style={
                                    styles.column
                                }
                            >
                                <PoemColumnBlock
                                    block={
                                        item.translatedBlock
                                    }
                                />
                            </View>
                        </View>
                    );
                }

                return (
                    <View
                        key={item.id}
                        style={
                            styles.rowWrapper
                        }
                        onLayout={(
                            event,
                        ) => {
                            rowOffsetsRef.current[
                                item.id
                            ] =
                                event
                                    .nativeEvent
                                    .layout.y;

                            if (
                                pendingTargetBlockIdRef.current ===
                                item.id
                            ) {
                                jumpToTargetBlock(
                                    item.id,
                                );
                            }
                        }}
                    >
                        {
                            highlightOverlay
                        }

                        <View
                            style={
                                styles.rowContent
                            }
                        >
                            {
                                rowContent
                            }
                        </View>
                    </View>
                );
            },
            [
                colors.accentSoft,
                hasTranslation,
                highlightAnimation,
                highlightedBlockId,
                jumpToTargetBlock,
            ],
        );

    return (
        <ScrollView
            ref={scrollViewRef}
            style={
                styles.scrollView
            }
            contentContainerStyle={
                styles.contentContainer
            }
            showsVerticalScrollIndicator={
                false
            }
            automaticallyAdjustContentInsets={
                false
            }
            contentInsetAdjustmentBehavior="never"
            onContentSizeChange={() => {
                const pendingTargetBlockId =
                    pendingTargetBlockIdRef.current;

                if (
                    pendingTargetBlockId
                ) {
                    jumpToTargetBlock(
                        pendingTargetBlockId,
                    );
                }
            }}
        >
            {
                listHeaderComponent
            }

            {rows.map(renderRow)}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },

    contentContainer: {
        paddingHorizontal:
            spacing.lg,

        paddingBottom:
            spacing.huge,
    },

    rowWrapper: {
        position: "relative",

        marginBottom:
            spacing.xxl,
    },

    rowContent: {
        position: "relative",

        zIndex: 1,
    },

    highlightOverlay: {
        ...StyleSheet.absoluteFillObject,

        top: -spacing.xs,
        bottom: -spacing.xs,

        left: -spacing.sm,
        right: -spacing.sm,

        borderRadius: 20,
    },

    stanzaRow: {
        flexDirection: "row",

        gap: spacing.lg,
    },

    proseRow: {
        flexDirection: "column",

        gap: spacing.lg,
    },

    singleColumnRow: {},

    column: {
        flex: 1,
    },

    emptyContainer: {
        borderWidth: 1,

        borderRadius: 24,

        paddingVertical:
            spacing.xxl,

        paddingHorizontal:
            spacing.xxl,

        alignItems: "center",
    },

    emptyTitle: {
        fontWeight: "700",

        textAlign: "center",

        marginBottom:
            spacing.md,
    },

    emptyText: {
        textAlign: "center",

        maxWidth: 320,
    },
});