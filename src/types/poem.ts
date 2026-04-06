export type LanguageCode = "on" | "ru" | "en";
export type TranslationLanguage = "ru" | "en";
export type PoemBlockType = "stanza" | "prose";

export interface PoemBlock {
    id: string;
    type: PoemBlockType;
    number?: string;
    lines: string[];
    placeholder?: boolean;
}

export interface PoemTextGroup {
    on: PoemBlock[];
    ru: PoemBlock[];
    en: PoemBlock[];
}

export interface PoemTitle {
    on: string;
    ru: string;
    en: string;
}

export interface PoemMetaText {
    on: string;
    ru: string;
    en: string;
}

export interface PoemData {
    slug: string;
    key: string;
    title: PoemTitle;
    description: PoemMetaText;
    source: PoemMetaText;
    texts: PoemTextGroup;
}

export interface PoemListItem {
    slug: string;
    key: string;
    title: PoemTitle;
}
