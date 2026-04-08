/**
 * Типографическая шкала
 * Оптимизирована под чтение текста
 */
export const typography = {
    // Заголовки
    titleXL: 34,
    titleLarge: 30,
    titleMedium: 24,
    titleSmall: 20,

    // Основной текст
    bodyXL: 18,
    bodyLarge: 17,
    bodyMedium: 16,
    bodySmall: 14,

    // Подписи / UI
    labelLarge: 15,
    labelMedium: 13,
    labelSmall: 12,

    // Служебное
    caption: 11,
} as const;

/**
 * Рекомендованные lineHeight коэффициенты
 */
export const lineHeights = {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    reading: 1.65,
};

/**
 * Хелпер для расчёта lineHeight
 */
export function getLineHeight(
    fontSize: number,
    ratio: number = lineHeights.normal,
) {
    return Math.round(fontSize * ratio);
}
