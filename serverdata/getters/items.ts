import { ItemData } from "../schemas/items";

export function getType(value: string): ItemData["item"]["$"]["type"] {
  switch (value) {
    case "weapon":
      return "Weapon";
    case "armor":
      return "Armor";
    case "questitem":
      return "QuestItem";
    default:
      return "EtcItem";
  }
}
