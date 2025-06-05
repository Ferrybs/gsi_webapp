export enum MapName {
  de_dust2 = "Dust 2",
  de_inferno = "Inferno",
  de_mirage = "Mirage",
  de_nuke = "Nuke",
  de_overpass = "Overpass",
  de_vertigo = "Vertigo",
  de_ancient = "Ancient",
  de_anubis = "Anubis",
  de_cache = "Cache",
  de_train = "Train",
  de_community = "Community",
}

export type MapKey = keyof typeof MapName;

export function formatMapName(keyOrValue: MapKey | string): string {
  // If it's already a valid enum key, use it directly
  if (keyOrValue in MapName) {
    return MapName[keyOrValue as MapKey];
  }

  // If it's a display name, find the corresponding key
  const entry = Object.entries(MapName).find(([key, value]) => {
    if (key) {
      return value === keyOrValue;
    }
  });
  if (entry) {
    return entry[1];
  }

  // Fallback: return the input as-is
  return keyOrValue;
}

export function isValidMapKey(key: string): key is MapKey {
  return key in MapName;
}

export function getMapKey(value: string): MapKey | undefined {
  const entry = Object.entries(MapName).find(([key, mapValue]) => {
    if (key && mapValue) {
      return key === value;
    }
  });
  return entry ? (entry[0] as MapKey) : undefined;
}
