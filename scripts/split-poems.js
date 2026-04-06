const fs = require("fs");
const path = require("path");

const INPUT_ON = path.join(__dirname, "../src/data/poems/on.json");
const INPUT_RU = path.join(__dirname, "../src/data/poems/ru.json");
const INPUT_EN = path.join(__dirname, "../src/data/poems/en.json");

const OUTPUT_DIR = path.join(__dirname, "../src/output-poems");

function readJson(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(content);
}

function ensureDir(dirPath) {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
}

function getPoemsRoot(data) {
    if (
        data &&
        typeof data === "object" &&
        data.Poems &&
        typeof data.Poems === "object"
    ) {
        return data.Poems;
    }

    if (data && typeof data === "object") {
        return data;
    }

    throw new Error("Не удалось определить корневой объект поэм.");
}

function camelToKebab(value) {
    return value
        .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();
}

function sanitizeSlug(value) {
    return value
        .normalize("NFKD")
        .replace(/[^\w\s-]/g, "")
        .replace(/_/g, "-")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .toLowerCase()
        .trim();
}

function makeSlug(poemKey, poemEN) {
    if (poemEN && typeof poemEN.Title === "string" && poemEN.Title.trim()) {
        return sanitizeSlug(poemEN.Title);
    }

    return sanitizeSlug(camelToKebab(poemKey));
}

function extractLines(block) {
    if (!block || typeof block !== "object") {
        return [];
    }

    if (Array.isArray(block.lines)) return block.lines;
    if (Array.isArray(block.linesON)) return block.linesON;
    if (Array.isArray(block.linesRU)) return block.linesRU;
    if (Array.isArray(block.linesEN)) return block.linesEN;
    if (Array.isArray(block.text)) return block.text;

    return [];
}

function normalizeBlock(block) {
    return {
        id: String(block?.id ?? ""),
        type: block?.type === "prose" ? "prose" : "stanza",
        number: typeof block?.number === "string" ? block.number : "",
        lines: extractLines(block),
        placeholder: Boolean(
            block?.placeholder || block?.isPlaceholder || false,
        ),
    };
}

function normalizeTexts(poem) {
    if (!poem || !Array.isArray(poem.Texts)) {
        return [];
    }

    return poem.Texts.map(normalizeBlock);
}

function normalizeMetaString(value) {
    if (typeof value !== "string") {
        return "";
    }

    return value.replace(/<br\s*\/?>/gi, "\n").trim();
}

function writeJson(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf-8");
}

function main() {
    ensureDir(OUTPUT_DIR);

    const onData = readJson(INPUT_ON);
    const ruData = readJson(INPUT_RU);
    const enData = readJson(INPUT_EN);

    const onPoems = getPoemsRoot(onData);
    const ruPoems = getPoemsRoot(ruData);
    const enPoems = getPoemsRoot(enData);

    const poemKeys = Array.from(
        new Set([
            ...Object.keys(onPoems),
            ...Object.keys(ruPoems),
            ...Object.keys(enPoems),
        ]),
    ).sort();

    const index = [];

    for (const poemKey of poemKeys) {
        const poemON = onPoems[poemKey] || {};
        const poemRU = ruPoems[poemKey] || {};
        const poemEN = enPoems[poemKey] || {};

        const slug = makeSlug(poemKey, poemEN);

        const poemData = {
            slug,
            key: poemKey,
            title: {
                on: typeof poemON.Title === "string" ? poemON.Title : "",
                ru: typeof poemRU.Title === "string" ? poemRU.Title : "",
                en: typeof poemEN.Title === "string" ? poemEN.Title : "",
            },
            description: {
                on: normalizeMetaString(poemON.Description),
                ru: normalizeMetaString(poemRU.Description),
                en: normalizeMetaString(poemEN.Description),
            },
            source: {
                on: normalizeMetaString(poemON.Source),
                ru: normalizeMetaString(poemRU.Source),
                en: normalizeMetaString(poemEN.Source),
            },
            texts: {
                on: normalizeTexts(poemON),
                ru: normalizeTexts(poemRU),
                en: normalizeTexts(poemEN),
            },
        };

        const onLength = poemData.texts.on.length;
        const ruLength = poemData.texts.ru.length;
        const enLength = poemData.texts.en.length;

        if (!(onLength === ruLength && onLength === enLength)) {
            console.warn(
                `[WARN] Несовпадение длин в поэме "${poemKey}": ON=${onLength}, RU=${ruLength}, EN=${enLength}`,
            );
        }

        for (let i = 0; i < Math.min(onLength, ruLength, enLength); i += 1) {
            const onId = poemData.texts.on[i].id;
            const ruId = poemData.texts.ru[i].id;
            const enId = poemData.texts.en[i].id;

            if (!(onId === ruId && onId === enId)) {
                console.warn(
                    `[WARN] Несовпадение id в поэме "${poemKey}" на индексе ${i}: ON=${onId}, RU=${ruId}, EN=${enId}`,
                );
            }
        }

        const outputFile = path.join(OUTPUT_DIR, `${slug}.json`);
        writeJson(outputFile, poemData);

        index.push({
            slug,
            key: poemKey,
            titleON: poemData.title.on,
            titleRU: poemData.title.ru,
            titleEN: poemData.title.en,
        });

        console.log(`[OK] ${poemKey} -> ${outputFile}`);
    }

    writeJson(path.join(OUTPUT_DIR, "index.json"), index);

    console.log(`\nГотово. Создано файлов: ${index.length}`);
}

main();
