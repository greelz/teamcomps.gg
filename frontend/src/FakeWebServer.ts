import { IChampionListChamp } from "./ChampionsList";

export async function getChampionData(): Promise<IChampionListChamp[] | null> {
  const championData = await fetch('http://localhost:3010/api/getChampList');
  if (championData.ok) {
    return championData.json();
  }
  else {
    return null;
  }
}