import { Skill } from '../../result/types';

export function loadSkillCard(deps: {skills: Map<string, Skill>}) {
  const cards = new Map<string, {id: string; cardName: string; levels: Skill[]}>()
  for (const skill of deps.skills.values()) {
    
  }
  return cards
}

