import { ChampionName, IChampionData, IChampionTableData, ILeagueData } from "./Interfaces";
import * as ws from './WebServiceWrapper';

const getRandomInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export async function getChampionData(): Promise<IChampionTableData[] | null> {
  const championData = await fetch('http://localhost:3010/api/getChampList');
  if (championData.ok) {
    return championData.json();
  }
  else {
    return null;
  }
}

export async function getWinPercentage(champs: Array<ChampionName | null>): Promise<number> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getRandomInt(30, 70))
        }, 1200);
    });
}