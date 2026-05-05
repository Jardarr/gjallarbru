import type { PoemData } from '@/src/types/poem';

import beowulf from './beowulf.json';
import caedmonesLeod from './caedmones_leod.json';
import deor from './deor.json';
import engliscGaldorcraeft from './englisc_galdorcraeft.json';
import maximsIB from './maxims_i_b.json';
import nigonWyrtaGaldor from './nigon_wyrta_galdor.json';
import waldere from './waldere.json';

export const poems: PoemData[] = [
  beowulf as PoemData,
  caedmonesLeod as PoemData,
  deor as PoemData,
  engliscGaldorcraeft as PoemData,
  maximsIB as PoemData,
  nigonWyrtaGaldor as PoemData,
  waldere as PoemData,
];
