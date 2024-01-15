const effectName = "p_physical_defence"

export function getEffects (effects: any) {
  const effectMap = new Map<string, {effectName: string, app: string[], value: number, per: boolean}>()
  for (const effect of effects) {
    const effectName: string = effect.$[0]
    if (effectName === "p_physical_defence") {
      const app: string[] = effect.$[1].$ 
      const value: number = effect.$[2]
      const per: boolean = effect.$[3] === 'per'
      effectMap.set(effectName, {effectName, app, value, per})
    }
  }
  console.log(effectMap);
  
}