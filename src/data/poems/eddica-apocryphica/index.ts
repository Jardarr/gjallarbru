import type { PoemData } from '@/src/types/poem';

import eddubrot from './eddubrot.json';
import gunnarsslagr from './gunnarsslagr.json';
import solarljod from './solarljod.json';

export const poems: PoemData[] = [
  eddubrot as PoemData,
  gunnarsslagr as PoemData,
  solarljod as PoemData,
];
