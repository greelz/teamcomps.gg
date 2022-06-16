import React from "react";
import { ChampionName, IChampionTableData } from "./Interfaces";
import SelectedChampion from "./SelectedChampion";

interface Props {
  champions: Array<IChampionTableData | null>;
  onClickX: Function;
}

export default function Teamcomp({ champions, onClickX }: Props) {
  return (
    <div className="_selectedChampions">
      {champions.map((c, i) => (
        <SelectedChampion onClickX={() => onClickX(i)} key={c?.internalname || "" + i} name={c?.internalname as ChampionName} description="A crazy description" role="Support" />
      ))}
    </div>
  );
}
