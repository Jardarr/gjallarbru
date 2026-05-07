import type { PoemData } from '@/src/types/poem';

import engliscGaldorcraeft from './englisc_galdorcraeft.json';
import nigonWyrtaGaldor from './nigon_wyrta_galdor.json';
import waldere from './waldere.json';
import maximsIB from './maxims_i_b.json';
import deor from './deor.json';
import caedmonesLeod from './caedmones_leod.json';
import beowulf from './beowulf.json';

export const poems: PoemData[] = [
  engliscGaldorcraeft as PoemData,
  nigonWyrtaGaldor as PoemData,
  waldere as PoemData,
  maximsIB as PoemData,
  deor as PoemData,
  caedmonesLeod as PoemData,
  beowulf as PoemData,
];
