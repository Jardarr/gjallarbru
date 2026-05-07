import { poems } from "@/src/data/poems";
import type { PoemData, PoemListItem } from "@/src/types/poem";

export function getPoemsList(): PoemListItem[] {
    return poems.map((poem) => ({
        slug: poem.slug,
        key: poem.key,
        title: poem.title,
        category: poem.category,
    }));
}

export function getPoemBySlug(slug: string): PoemData | null {
    return poems.find((poem) => poem.slug === slug) ?? null;
}
