import type { PoemData } from '@/src/types/poem';

import dieMerseburgerZauberspruche from './die_merseburger_zauberspruche.json';
import ezzolied from './ezzolied.json';
import gegenFallsucht from './gegen_fallsucht.json';

export const poems: PoemData[] = [
  dieMerseburgerZauberspruche as PoemData,
  ezzolied as PoemData,
  gegenFallsucht as PoemData,
];
