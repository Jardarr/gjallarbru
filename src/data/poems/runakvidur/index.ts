import type { PoemData } from '@/src/types/poem';

import abecedariumNordmannicum from './abecedarium_nordmannicum.json';
import runaleod from './runaleod.json';
import runakvaedi from './runakvaedi.json';
import thrideilurRunaljod from './thrideilur_runaljod.json';

export const poems: PoemData[] = [
  abecedariumNordmannicum as PoemData,
  runaleod as PoemData,
  runakvaedi as PoemData,
  thrideilurRunaljod as PoemData,
];
