const fs = require("fs");
const path = require("path");

const poemsDir = path.join(__dirname, "../src/data/poems");
const outputFile = path.join(poemsDir, "index.ts");

function toVarName(fileName) {
    return fileName
        .replace(".json", "")
        .replace(/-([a-z])/g, (_, char) => char.toUpperCase())
        .replace(/^[^a-zA-Z_$]+/, "");
}

function main() {
    const files = fs
        .readdirSync(poemsDir)
        .filter((file) => file.endsWith(".json"))
        .sort();

    const imports = [];
    const poemVars = [];

    for (const file of files) {
        const varName = toVarName(file);
        imports.push(`import ${varName} from './${file}';`);
        poemVars.push(`${varName} as PoemData`);
    }

    const content = `import type { PoemData } from '@/src/types/poem';

${imports.join("\n")}

export const poems: PoemData[] = [
  ${poemVars.join(",\n  ")}
];
`;

    fs.writeFileSync(outputFile, content, "utf-8");
    console.log(`Готово: ${outputFile}`);
}

main();
