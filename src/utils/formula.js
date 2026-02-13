const HECTARE_TO_ACRE = 2.47105;

export const hectareToAcre = (hectare) =>
  hectare ? (Number(hectare) * HECTARE_TO_ACRE).toFixed(5) : "";

export const acreToHectare = (acre) =>
  acre ? (Number(acre) / HECTARE_TO_ACRE).toFixed(5) : "";







