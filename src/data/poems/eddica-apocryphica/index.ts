import type { PoemData } from '@/src/types/poem';

import eddubrot from './eddubrot.json';
import solarljod from './solarljod.json';
import gunnarsslagr from './gunnarsslagr.json';

export const poems: PoemData[] = [
  eddubrot as PoemData,
  solarljod as PoemData,
  gunnarsslagr as PoemData,
];
