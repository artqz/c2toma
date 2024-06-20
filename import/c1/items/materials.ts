import { Item } from "../../../result/types";

export function getTypeMaterials(deps: { items: Map<number, Item> }) {
  for (const item of Array.from(deps.items.values()).filter(
    (i) => i.etcitemType === "material"
  )) {
    item.kind = "part";
    if (GEMSTONES.has(item.itemName)) {
      item.kind = "gemstone";
    }
    if (CRYSTALS.has(item.itemName)) {
      item.kind = "crystal";
    }
    if (RESOURCES.has(item.itemName)) {
      item.kind = "resource";
    }
  }
}

const GEMSTONES = new Set([
  "gemstone_d",
  "gemstone_c",
  "gemstone_b",
  "gemstone_a",
  "gemstone_s",
]);

const CRYSTALS = new Set([
  "crystal_d",
  "crystal_c",
  "crystal_b",
  "crystal_a",
  "crystal_s",
]);

const RESOURCES = new Set([
  "coal",
  "animal_bone",
  "animal_skin",
  "charcoal",
  "varnish",
  "iron_ore",
  "stem",
  "thread",
  "suede",
  "silver_nugget",
  "admantite_nugget",
  "mithril_ore",
  "stone_of_purity",
  "oriharukon_ore",
  "mold_glue",
  "mold_lubricant",
  "mold_hardener",
  "enria",
  "asofe",
  "thons",
  "leather",
  "coarse_bone_powder",
  "cokes",
  "steel",
  "braided_hemp",
  "varnish_of_purity",
  "synthesis_cokes",
  "cord",
  "silver_mold",
  "compound_braid",
  "high_grade_suede",
  "steel_mold",
  "mithirl_alloy",
  "crafted_leather",
  "blacksmith's_frame",
  "artisan's_frame",
  "oriharukon",
  "reinforcing_agent",
  "metallic_fiber",
  "reinforcing_plate",
  "iron_thread",
  "maestro_mold",
  "craftsman_mold",
  "maestro_holder",
  "maestro_anvil_lock",
  "reorins_mold",
  "warsmith_mold",
  "warsmith_holder",
  "arcsmith_anvil",
]);
