export const POEM_CATEGORIES = {
    LJODAEDDA_GODAKVAEDI: "ljodaedda-godakvaedi",
    LJODAEDDA_HETJUKVAEDI: "ljodaedda-hetjukvaedi",
    EDDICA_MINORA: "eddica-minora",
    EDDICA_APOCRYPHICA: "eddica-apocryphica",
    RUNAKVIDUR: "runakvidur",
    DIUTISK_J_SAHSISK: "diutisk-j-sahsisk",
    EALD_ENGLISC_LEODCRAEFT: "eald-englisc-leodcraeft",
    NORROENAR_THJODKVAEDI: "norroenar-thjodkvaedi",
} as const;

export type PoemCategory =
    (typeof POEM_CATEGORIES)[keyof typeof POEM_CATEGORIES];