import { IChampionTableData } from "./Interfaces";
import { baseUrl } from "./Interfaces";

export async function getChampionData(): Promise<IChampionTableData[] | null> {
  const championData = await fetch(`http://${baseUrl}:3010/api/getChampList`);
  if (championData.ok) {
    return championData.json();
  }
  else {
    return null;
  }
}