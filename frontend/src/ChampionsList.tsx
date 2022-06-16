import React from "react";
import Champion from "./Champion";
import { IChampionTableData } from "./Interfaces";

interface IChampionsListProps {
  championData: IChampionTableData[];
  handleChampionClick: (champion: IChampionTableData) => void;
  roleFilter?: string
}

export default function ChampionsList({
  championData,
  handleChampionClick,
}: IChampionsListProps) {
  return (
    <div className="_champions">
        {championData.map(element => {
            return <Champion key={element.internalname} name={element.prettyname} internalName={element.internalname}
                {...element} clickHandler={() => handleChampionClick(element)} />;
        })}
    </div>
  );
}
