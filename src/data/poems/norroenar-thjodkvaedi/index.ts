import type { PoemData } from '@/src/types/poem';

import lokkaTattur from './lokka_tattur.json';
import torekall from './torekall.json';
import ungenSvejdal from './ungen_svejdal.json';

export const poems: PoemData[] = [
  lokkaTattur as PoemData,
  torekall as PoemData,
  ungenSvejdal as PoemData,
];
