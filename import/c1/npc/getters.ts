export function getClan(params: { $?: string[] | number[] }) {
  const { $ } = params;
  if ($) {
    const value = $.at(0);
    if (typeof value === "number") {
      return "ALL";
    }
    if (typeof value === "string") {
      return value.replace("@", "");
    }
  }
  return undefined;
}
