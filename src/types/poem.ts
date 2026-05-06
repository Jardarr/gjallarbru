import { PoemCategory } from "../constants/poem-categories";

export type LanguageCode = "on" | "ru" | "en";
export type TranslationLanguage = "ru" | "en";
export type PoemBlockType = "stanza" | "prose" | "heading";

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
	en: (PoemBlock | null)[]
}

export interface PoemTitle {
	on: string;
	ru: string;
	en: string;
}

export interface PoemSubTitle {
	on?: string;
	ru: string;
	en?: string;
}

export interface PoemMetaText {
	on: string;
	ru: string;
	en: string;
}

export interface PoemData {
	slug: string;
	category: PoemCategory;
	key: string;
	title: PoemTitle;
	subtitle: PoemSubTitle;
	description: PoemMetaText;
	source: PoemMetaText;
	texts: PoemTextGroup;
}

export interface PoemListItem {
	slug: string;
	key: string;
	title: PoemTitle;
	category: PoemCategory;
}
