import type { PoemBlock } from "@/src/types/poem";

export const hasPoemContent = (blocks: PoemBlock[]) => {
    return blocks.some((block) => {
        if (block.placeholder) {
            return false;
        }

        return block.lines.some((line) => line.trim() !== "");
    });
};