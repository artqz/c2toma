import { z } from 'zod';
import Fs from './utils/Fs';


const profs = {
  0: "fighter",
  1: "warrior",
  2: "gladiator",
  3: "warlord",
  4: "knight",
  5: "paladin",
  6: "dark_avenger",
  7: "rogue",
  8: "treasure_hunter",
  9: "hawkeye",
  10: "mage",
  11: "wizard",
  12: "sorcerer",
  13: "necromancer",
  14: "warlock",
  15: "cleric",
  16: "bishop",
  17: "prophet",
  18: "elven_fighter",
  19: "elven_knight",
  20: "temple_knight",
  21: "swordsinger",
  22: "elven_scout",
  23: "plain_walker",
  24: "silver_ranger",
  25: "elven_mage",
  26: "elven_wizard",
  27: "spellsinger",
  28: "elemental_summoner",
  29: "oracle",
  30: "elder",
  31: "dark_fighter",
  32: "palus_knight",
  33: "shillien_knight",
  34: "bladedancer",
  35: "assasin",
  36: "abyss_walker",
  37: "phantom_ranger",
  38: "dark_mage",
  39: "dark_wizard",
  40: "spellhowler",
  41: "phantom_summoner",
  42: "shillien_oracle",
  43: "shillien_elder",
  44: "orc_fighter",
  45: "orc_raider",
  46: "destroyer",
  47: "orc_monk",
  48: "tyrant",
  49: "orc_mage",
  50: "orc_shaman",
  51: "overlord",
  52: "warcryer",
  53: "dwarven_fighter",
  54: "scavenger",
  55: "bounty_hunter",
  56: "artisan",
  57: "warsmith",
}

interface IProf {
  name: string;
  id: number;
  childs?: IProf[];
}

const Prof: z.ZodType<IProf> = z.lazy(() => z.object({
    name: z.string(),
    id: z.number(),
    childs: z.array(Prof).optional()
  }))

const Profs = z.array(Prof)

const races = ["human", "elf", "delf", "orc", "dwarf"]

export function loadRaces() {
  for (const race of races) {
    const json = JSON.parse(Fs.readFileSync(`datapack/c5/profs/${race}.json`, "utf8"));
    const data = Profs.parse(json);
    
    getProfs(data);
  }  
}

function getProfs(profs: IProf[]) {
  for (const prof of profs) {
    const profData = loadProf(prof.id)
    
    if (prof.childs) {
      getProfs(prof.childs)
    }

    return {}
  }
}

const Skill = z.array(z.object({   
  skillID: z.number(),
  autoGet: z.boolean(), 
  getLv: z.number(),  
  itemNeeded: z.number(),
  lvUpSp: z.number(),
  isGroup: z.boolean()
}))

export function loadProf(id: number) {
  console.log(id);  
  const json = JSON.parse(Fs.readFileSync(`datapack/c5/profs/${id}.json`, "utf8"));
  const data = Skill.parse(json);

  return data.filter(x => !x.isGroup);
}

loadRaces()