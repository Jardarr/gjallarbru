/**
 * Базовая система отступов
 * Основана на шаге 4px
 */
export const spacing = {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    giant: 48,
} as const;

/**
 * Хелперы для удобства
 */
export const spacingHelpers = {
    paddingHorizontal: (value: number) => ({
        paddingHorizontal: value,
    }),
    paddingVertical: (value: number) => ({
        paddingVertical: value,
    }),
    marginHorizontal: (value: number) => ({
        marginHorizontal: value,
    }),
    marginVertical: (value: number) => ({
        marginVertical: value,
    }),
};
