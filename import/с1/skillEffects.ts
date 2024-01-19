export function getEffects(effects: any) {
  const effectMap = new Map<
    string,
    { effectName: string; app: string[]; value: number; per: boolean }
  >();
  if (effects) {
    for (const effect of effects) {
      const effectName: string = effect.$[0];
      if (effectName === "p_physical_defence") {
        const app: string[] = effect.$[1].$;
        const value: number = effect.$[2];
        const per: boolean = effect.$[3] === "per";
        effectMap.set(effectName, { effectName, app, value, per });
      }
      if (effectName === "p_magical_defence") {
        const app: string[] = effect.$[1].$;
        const value: number = effect.$[2];
        const per: boolean = effect.$[3] === "per";
        effectMap.set(effectName, { effectName, app, value, per });
      }
      if (effectName === "p_physical_attack") {
        const app: string[] = effect.$[1].$;
        const value: number = effect.$[2];
        const per: boolean = effect.$[3] === "per";
        effectMap.set(effectName, { effectName, app, value, per });
      }
      if (effectName === "p_magical_attack") {
        const app: string[] = effect.$[1].$;
        const value: number = effect.$[2];
        const per: boolean = effect.$[3] === "per";
        effectMap.set(effectName, { effectName, app, value, per });
      }
    }
  }
  return Array.from(effectMap.values());
}
