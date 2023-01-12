type Int = number
type Float = number

export type Npc = {
  id: Int;
  npcName: string;
  name: string;
  nick: string;
  nickColor: "default" | "quest" | "raid";
  type: string;
  level: Int | null;
  exp: Float | null;
  sp: Float | null;
  orgHp: Float | null;
  orgMp: Float | null;
  orgHpRegen: Float | null;
  orgMpRegen: Float | null;
  agroRange: Int | null;
  baseDefend: Float | null;
  baseMagicAttack: Float | null;
  baseMagicDefend: Float | null;
  basePhysicalAttack: Float | null;
  physicalHitModify: Float | null;
  physicalAvoidModify: Float | null;
  baseAttackSpeed: Int | null;
  baseReuseDelay: Int | null;
  baseCritical: Int | null;
  magicUseSpeedModify: Float | null;
  existInC1: boolean;
};