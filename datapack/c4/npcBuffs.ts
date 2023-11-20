import Fs from '../../utils/Fs';
import { NpcBuffsEntry } from '../types';

function loadNpcBuffsDataJson(path: string): NpcBuffsEntry[] {
  const src = Fs.readFileSync(path, "utf8");
  const json = JSON.parse(src);
  let data = NpcBuffsEntry.array().parse(json);

  return data;
}

export function loadNpcBufsDataC4() {
  return loadNpcBuffsDataJson("datapack/c4/newbieBuffs.json");
}