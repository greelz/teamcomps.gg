import championData from "./assets/champion.json";
import { ChampionName, IChampionData, ILeagueData } from "./Interfaces";
import * as ws from './WebServiceWrapper';

export function generateChampPrimeIDList(champs: Array<ChampionName | null>, champData: ILeagueData): Array<number | undefined> {
    let ret:Array<number | undefined> = [];
    champs.forEach((champ) =>{
        if(!champ) { return; }
        ret.push(champData.data[champ].primeId);
    });
    return ret;
}