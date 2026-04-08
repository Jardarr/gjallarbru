export function normalizeSearchValue(value: string): string {
    return value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/þ/g, "th")
        .replace(/ð/g, "d")
        .replace(/æ/g, "ae")
        .replace(/œ/g, "oe")
        .trim();
}