import React from "react";
import { ChampionName, IChampionTableData } from "./Interfaces";
import SelectedChampion from "./SelectedChampion";
import "./Teamcomp.css";

interface Props {
  champions: Array<IChampionTableData | null>;
}

export default function Teamcomp({ champions }: Props) {
  return (
    <div className="_selectedChampions">
      {champions.map((c, i) => (
        <SelectedChampion key={c?.internalname || "" + i} name={c?.internalname as ChampionName} description="A crazy description" role="Support" />
      ))}
    </div>
  );
}
