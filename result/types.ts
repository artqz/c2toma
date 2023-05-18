type Int = number;
type Float = number;
type lstring = { en: string; ru: string };

export type Npc = {
  id: Int;
  npcName: string;
  name: string;
  nick: string;
  nickColor: "default" | "quest" | "raid";
  type: string;
  ai: string;
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
  race: string;
  dropList: NpcDrop[];
  spoilList: NpcDrop[];
  skillList: string[];
  multisell: Multisell[];
  spawns: NpcSpawn[];
};

export type Point = {
  x: Float;
  y: Float;
};

export type NpcSpawn = {
  npcName: string;
  pos: Point[];
};

export type Skill = {
  id: Int;
  skillName: string;
  name: string;
  desc: string;
  level: Int | null;
  operateType: string | null;
  effectTime: number | undefined;
  effectType: "debuff" | "buff" | "song" | undefined;
  icon: string;
};

export type Item = {
  id: Int;
  itemName: string;
  type: string;
  icon: string;
  name: string;
  addName: string;
  desc: string;
  weaponType: string;
  armorType: string;
  etcitemType: string | null;
  slotBitType: string;
  weight: Int | null;
  consumeType: string | null;
  initialCount: Int | null;
  maximumCount: Int | null;
  soulshotCount: Int | null;
  spiritshotCount: Int | null;
  immediateEffect: boolean;
  defaultPrice: Int | null;
  itemSkill: string | null;
  criticalAttackSkill: string | null;
  materialType: string | null;
  crystalType: string | null;
  crystalCount: Int | null;
  isTrade: boolean;
  isDrop: boolean;
  isDestruct: boolean;
  physicalDamage: Int | null;
  randomDamage: Int | null;
  canPenetrate: boolean;
  critical: Int | null;
  hitModify: Float | null;
  avoidModify: Int | null;
  dualFhitRate: Int | null;
  shieldDefense: Int | null;
  shieldDefenseRate: Int | null;
  attackRange: Int | null;
  damageRange: string | null;
  attackSpeed: Int | null;
  reuseDelay: Int | null;
  mpConsume: Int | null;
  magicalDamage: Int | null;
  durability: Int | null;
  physicalDefense: Int | null;
  magicalDefense: Int | null;
  mpBonus: Int | null;
  magicWeapon: boolean;
  recipe: Recipe[];
  sellList: Merchant[];
  // product: Product[];
  // material: Material[];
  dropList: ItemDrop[];
  spoilList: ItemDrop[];
  multisell: Multisell[];
  specialAbility: ShortItem[];
  sets: Set[];
};

export type Merchant = {
  npcName: string;
  tax: number;
};

export type Set = {
  id: Int;
  setEffectSkill: string;
  items: ShortItem[];
};

export type ShortItem = {
  itemName: string;
};

export type NpcDrop = {
  itemName: string;
  countMin: Int;
  countMax: Int;
  chance: Float;
};

export type ItemDrop = {
  npcName: string;
  countMin: Int;
  countMax: Int;
  chance: Float;
};

export type Multisell = {
  id: number;
  multisellName: string;
  sellList: SellList[];
};

export type ItemMultisell = {
  id: number;
  multisellName: string;
  sellList: SellList[];
  npcName: string;
};

export type SellList = {
  requiredItems: { itemName: string; count: number }[];
  resultItems: { itemName: string; count: number }[];
};

export type Recipe = {
  id: Int;
  recipeName: string;
  itemName: string;
  productList: Product[];
  materialList: Material[];
  npcFeeList: Material[];
  successRate: Int | null;
  level: Int | null;
  mpConsume: Int | null;
};

export type Product = {
  itemName: string;
  count: Int;
};

export type Material = {
  itemName: string;
  count: Int;
};

export type Prof = {
  id: number;
  profName: string;
  parent: string | null;
  skills: ProfSkill[];
};

export type ProfSkill = {
  skillName: string;
  skillLevel: number;
  isMagic: boolean;
  operateType: number;
  getLv: number;
  lvUpSp: number;
  autoGet: boolean;
  itemNeeded: string | null;
  hp: number;
  mp: number;
  range: number;
};

export type Ai = {
  super: string;
  name: string;
  sell_lists: AiSellList[];
};

export type AiSellList = [string, number, number, number][];
