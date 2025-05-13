enum MapName {
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

type MapKey = keyof typeof MapName; 

export function formatMapName(key: MapKey): string {
  return MapName[key];
}