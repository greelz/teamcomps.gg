import React from "react";
import BlankSelectedChampion from "./BlankSelectedChampion";
import { ChampionName, IChampionTableData } from "./Interfaces";
import SelectedChampion from "./SelectedChampion";

interface Props {
  champions: Array<IChampionTableData | null>;
  onClickX: (i: number) => void;
  onDrop: (i: number) => void;
  onDragStart: (c: IChampionTableData) => void;
}

export default function Teamcomp({
  champions,
  onClickX,
  onDrop,
  onDragStart,
}: Props) {
  const roles = [
    "icon-top",
    "icon-jungle",
    "icon-mid",
    "icon-bot",
    "icon-support",
  ];
  return (
    <div className="_selectedChampions">
      <div className="alert-low">Results are role-agnostic.</div>
      {roles.map((r, i) => {
        if (champions[i]) {
          return (
            <SelectedChampion
              {...champions[i]!}
              key={champions[i]?.internalname || "" + i}
              onDrop={() => onDrop(i)}
              onClickX={() => onClickX(i)}
              onDragStart={(c: IChampionTableData) => onDragStart(c)}
              role={r}
            />
          );
        } else {
          return (
            <BlankSelectedChampion key={i} onDrop={() => onDrop(i)} role={r} />
          );
        }
      })}
    </div>
  );
}
