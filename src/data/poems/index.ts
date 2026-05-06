import type { PoemData } from "@/src/types/poem";

import { poems as ljodaeddaGodakvaediPoems } from "./ljodaedda-godakvaedi";
import { poems as ljodaeddaHetjukvaediPoems } from "./ljodaedda-hetjukvaedi";
import { poems as eddiaMinoraPoems } from "./eddica-minora";
import { poems as eddiaApocryphicaPoems } from "./eddica-apocryphica";
import { poems as runakvidurPoems } from "./runakvidur";
import { poems as diutiskJSahsiskPoems } from "./diutisk-j-sahsisk";
import { poems as ealdEngliscLeodcraeftPoems } from "./eald-englisc-leodcraeft";
import { poems as norroenarThjodkvaediPoems } from "./norroenar-thjodkvaedi";

export const poems: PoemData[] = [
	...ljodaeddaGodakvaediPoems,
	...ljodaeddaHetjukvaediPoems,
	...eddiaMinoraPoems,
	...eddiaApocryphicaPoems,
	...runakvidurPoems,
	...diutiskJSahsiskPoems,
	...ealdEngliscLeodcraeftPoems,
	...norroenarThjodkvaediPoems,
];
