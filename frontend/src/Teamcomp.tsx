import React from "react";
import BlankSelectedChampion from "./BlankSelectedChampion";
import { IChampionTableData } from "./Interfaces";
import SelectedChampion from "./SelectedChampion";

interface Props {
  champions: Array<IChampionTableData | null>;
  onClickX: (i: number) => void;
  onDrop: (i: number) => void;
  onDragStart: (c: IChampionTableData) => void;
  onClickReset: () => void;
}

export default function Teamcomp({
  champions,
  onClickX,
  onDrop,
  onDragStart,
  onClickReset,
}: Props) {
  const roles = [
    "icon-top",
    "icon-jungle",
    "icon-mid",
    "icon-bot",
    "icon-support",
  ];
  const disabled = champions.filter(x => x == null).length === 5;
  return (
    <div className="_selectedChampions">
      <div className="alert-low">Win percent is not affected by lane.</div>
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
        <input
          type="button"
          value="Reset"
          className={`_resetButton btn-secondary-100 ${disabled ? '_disabled' : ''}`}
          onClick={onClickReset}
          disabled={disabled}
        />
    </div>
  );
}
