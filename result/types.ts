type Int = number;
type Float = number;
export type lstring = { en: string; ru: string };

export type Crystal =
  | "none"
  | "d"
  | "c"
  | "b"
  | "a"
  | "s"
  | "s80"
  | "s84"
  | "crystal_free"
  | "event";

export type Npc = {
  id: Int;
  npcName: string;
  name: lstring;
  nick: lstring;
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
  classes: string[];
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
  name: lstring;
  desc: lstring;
  level: Int | null;
  operateType: string | null;
  effect: string;
  operateCond: string;
  effectTime: number | undefined;
  effectType: "debuff" | "buff" | "song" | undefined;
  icon: string;
  castRange: number;
  hp_consume: number;
  mp_consume1: number;
  mp_consume2: number;
};

export type Item = {
  id: Int;
  itemName: string;
  type: string;
  icon: string;
  name: lstring;
  addName: lstring;
  desc: lstring;
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
  crystalType: Crystal;
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
  enchantBonus: EnchantBonus[];
  // recipe: Recipe[];
  // sellList: Merchant[];
  // product: Product[];
  // material: Material[];
  // dropList: ItemDrop[];
  // spoilList: ItemDrop[];
  // multisell: ItemMultisell[];
};

export type EnchantBonus = {
  level: number;
  pAtk: number;
  mAtk: number;
  pDef: number;
  mDef: number;
  crystals: number[];
};

export type Merchant = {
  npcName: string;
  tax: number;
};

export type ItemAbilityList = {
  itemName: string;
  abilityList: ShortItem[];
};

export type Set = {
  id: Int;
  setName: string;
  icon: string;
  name: lstring;
  desc: lstring;
  setEffectSkill: string;
  setAdditionalEffectSkill: string;
  items: {
    slotHead: string[];
    slotChest: string[];
    slotGloves: string[];
    slotLhand: string[];
    slotLegs: string[];
    slotFeet: string[];
  };
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

export type DropList = {
  npcName: string;
  dropList: NpcDrop[];
};

export type ItemDrop = {
  npcName: string;
  countMin: Int;
  countMax: Int;
  chance: Float;
};

export type MultisellNpcList = {
  npcName: string;
  show: boolean;
};

export type Multisell = {
  id: number;
  multisellName: string;
  sellList: SellList[];
  npcList: MultisellNpcList[];
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

export type Material = {
  itemName: string;
  count: Int;
};

export type Product = {
  itemName: string;
  count: Int;
  chance: Int;
};

export type Prof = {
  profName: string;
  parent: string | null;
  skills: ProfSkill[];
};

export type ProfSkill = {
  skillName: string;
  skillLevel: number;
  isMagic: boolean;
  operateType: string;
  getLv: number;
  lvUpSp: number;
  autoGet: boolean;
  itemNeeded: { itemName: string; count: number }[];
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
