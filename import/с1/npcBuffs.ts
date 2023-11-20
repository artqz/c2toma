import { loadNpcBufsDataC4 } from '../../datapack/c4/npcBuffs';
import { NpcBuffsEntry } from '../../datapack/types';
import { Npc, NpcBuff, Skill } from '../../result/types';
import { Chronicle } from '../types';

export function loadNpcBuffs(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
  skills: Map<string, Skill>;
}) {
  loadNpcBuffsData(deps)
  console.log("NPCs buffs loaded.");
}

function loadNpcBuffsData (deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
  skills: Map<string, Skill>;
}) {
  switch (deps.chronicle) {
    case "c4":      
      return load({...deps, buffList: loadNpcBufsDataC4()})
  }
}

function load(deps: {
  chronicle: Chronicle;
  npcs: Map<number, Npc>;
  skills: Map<string, Skill>;
  buffList: NpcBuffsEntry[]}) {
    const buffList: NpcBuff[] = []
    const skillByName = new Map(Array.from(deps.skills.values()).map(s => [s.skillName, s]))
    const npcByName = new Map(Array.from(deps.npcs.values()).map(n => [n.npcName, n]))

    for (const buff of deps.buffList) {
      const skill = skillByName.get(buff.skill)
      if (skill) {       
        buffList.push({skillName: skill.skillName, minLevel: buff.minLvl, maxLevel: buff.maxLvl, group: buff.group})
      } else {
        "Нет такого баффа " + buff.skill
      }      
    }

    for (const buffer of NPCS.values()) {
      const npc = npcByName.get(buffer)
      if (npc) {
        npc.buffList = buffList
      } 
      else {
        "Нет такого баффера " + buffer
      }
    }
}

const NPCS = new Set (["guide_human_cnacelot", "guide_elf_roios", "guide_delf_frankia", "guide_dwarf_gullin", "guide_orc_tanai", "guide_gludin_nina", "guide_gludio_euria"])